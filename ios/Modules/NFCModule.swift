//
//  NFCModule.swift
//  react-native-amani-sdk
//
//  Created by Deniz Can on 18.09.2023.
//

import AmaniSDK
import UIKit
@available(iOS 13, *)
class NFCModule {
  private let module = Amani.sharedInstance.scanNFC()
  private var moduleView: SDKView!

  func start(imageData: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
     reject("NFCModule", "start(imageData) is not supported in this version", nil)
  }

  func start(nviData: NviModel, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    Task {
      do {
        try await module.start(nviData: nviData)
        resolve(true)
      } catch let err {
        reject("ModuleError", err.localizedDescription, nil)
      }
    }
  }

  func start(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    reject("NFCModule", "start() is not supported in this version. Use start(nviData)", nil)
  }

  func setType(type: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    module.setType(type: type)
    resolve(nil)
  }

  // WORKAROUND (see RawNFCUploadConfig.swift): the native SDK's module.upload() sends
  // `device_data` / `upload_source` fields that Android's hand-rolled upload never sends, and
  // the backend currently returns an error for that shape on NFC documents
  // ("Not implemented error Zeki"). This bypasses module.upload() and POSTs a minimal multipart
  // body directly, mirroring android/.../modules/NFC.kt's uploadV1()/uploadV2().
  //
  // `mrzValue` / `nfcPortraitPhoto` / `type` are `private` on ScanNFC, so we can't read them via
  // normal property access from this module. Mirror reflects them anyway — Swift access control
  // is compile-time only and doesn't affect runtime introspection — avoiding an AmaniSDK.xcframework
  // rebuild. Remove this override (and RawNFCUploadConfig) once the backend fix ships.
  func upload(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    var mrz: String?
    var photo: UIImage?
    var docType: String?
    for child in Mirror(reflecting: module).children {
      switch child.label {
      case "mrzValue": mrz = child.value as? String
      case "nfcPortraitPhoto": photo = child.value as? UIImage
      case "type": docType = child.value as? String
      default: break
      }
    }

    guard let mrz = mrz, let photo = photo, let jpegData = photo.jpegData(compressionQuality: 1) else {
      reject("NFCModule", "No NFC scan data available to upload", nil)
      return
    }

    let base64Image = "data:image/jpeg;base64,\(jpegData.base64EncodedString())"
    let customerId = Amani.sharedInstance.customerInfo().getCustomer().id ?? ""
    let type = docType ?? ""

    let nfcPayload: [String: Any] = [
      "mrz": mrz,
      "photo": [
        "base64": base64Image,
        "height": Int(photo.size.height),
        "width": Int(photo.size.width),
      ],
    ]

    guard
      let nfcJsonData = try? JSONSerialization.data(withJSONObject: nfcPayload),
      let nfcJsonString = String(data: nfcJsonData, encoding: .utf8)
    else {
      reject("NFCModule", "Failed to encode NFC payload", nil)
      return
    }

    let server = RawNFCUploadConfig.server
    let trimmedServer = server.hasSuffix("/") ? String(server.dropLast()) : server

    let urlString: String
    let authHeader: String
    var fields: [(String, String)]

    if RawNFCUploadConfig.apiVersion == "v1" {
      urlString = "\(trimmedServer)/api/v1/recognition/web/upload?ln=\(RawNFCUploadConfig.lang)"
      authHeader = "token \(RawNFCUploadConfig.token)"
      fields = [
        ("type", type),
        ("customer_id", customerId),
        ("files[]", base64Image),
        ("nfc", nfcJsonString),
        ("cropped", "true"),
        ("attempt", "1"),
      ]
    } else {
      urlString = "\(trimmedServer)/api/v2/document"
      authHeader = "Bearer \(RawNFCUploadConfig.token)"
      fields = [
        ("type", type),
        ("profile", customerId),
        ("pages", base64Image),
        ("nfc", nfcJsonString),
        ("cropped", "true"),
        ("rotated", "true"),
      ]
    }

    guard let url = URL(string: urlString) else {
      reject("NFCModule", "Invalid server URL", nil)
      return
    }

    let boundary = "Boundary-\(UUID().uuidString)"
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
    request.setValue(authHeader, forHTTPHeaderField: "Authorization")

    var body = Data()
    func appendField(name: String, value: String) {
      body.append("--\(boundary)\r\n".data(using: .utf8)!)
      body.append("Content-Disposition: form-data; name=\"\(name)\"\r\n\r\n".data(using: .utf8)!)
      body.append("\(value)\r\n".data(using: .utf8)!)
    }
    for (name, value) in fields {
      appendField(name: name, value: value)
    }
    body.append("--\(boundary)--\r\n".data(using: .utf8)!)
    request.httpBody = body

    URLSession.shared.dataTask(with: request) { data, response, error in
      if let error = error {
        reject("NFC_UPLOAD_ERROR", error.localizedDescription, error)
        return
      }
      let statusCode = (response as? HTTPURLResponse)?.statusCode ?? 0
      let bodyString = data.flatMap { String(data: $0, encoding: .utf8) } ?? "<empty>"
      print("[RawNFCUpload] apiVersion=\(RawNFCUploadConfig.apiVersion) status=\(statusCode) body=\(bodyString)")
      resolve(statusCode >= 200 && statusCode < 300)
    }.resume()
  }
}
