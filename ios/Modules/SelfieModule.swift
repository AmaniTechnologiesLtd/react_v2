//
//  SelfieModule.swift
//  react-native-amani-sdk
//
//  Created by Deniz Can on 18.09.2023.
//

import AmaniSDK
import React

class SelfieModule {
  private let module = Amani.sharedInstance.selfie()
  private var moduleView: SDKView!

  // FIX: this originally wrapped the entire body in DispatchQueue.main.async { [weak self] in ... }.
  // SelfieModule() is created as a temporary object in AmaniSdk.swift (`SelfieModule().start(...)`)
  // with nothing holding a strong reference to it afterward. Deferring the whole method onto the
  // main queue meant ARC could deallocate `self` before the block ran, silently hitting
  // `guard let self = self else { return }` — module.start() never even got called, so the JS
  // promise hung forever with no resolve/reject and no native-side log output at all.
  //
  // The main-queue dispatch itself is still required though: module.start() touches UIKit
  // (UIScreen.main.bounds, building the capture view), and RN native module methods run on a
  // background queue by default — calling this synchronously crashed with SIGTRAP (signal 5).
  // The actual fix is to keep the dispatch but capture `self` strongly instead of weakly — the
  // escaping closure holding a strong reference is enough to keep this temporary instance alive
  // until it finishes presenting the view, no external retain needed.
  public func start(resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let vc = RCTPresentedViewController()
      do {
        let view = try self.module.start { image in
          resolve("data:image/png;base64,\(image.toBase64PNGImage()!)")
          self.moduleView.removeFromSuperview()
        }

        self.moduleView = SDKView(sdkView: view!)
        self.moduleView.start(on: vc!)
      } catch let err {
        reject("RNAmani-Selfie", err.localizedDescription, nil)
      }
    }
  }

  public func setType(type: String, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    module.setType(type: type)
    resolve(nil)
  }

  // WORKAROUND (see RawUploadConfig.swift): same backend gap as NFCModule.upload() — the native
  // SDK's module.upload() sends `device_data` / `upload_source` fields the backend can't handle
  // ("Not implemented error"), even though Android's Selfie module just calls its native upload
  // directly (no custom implementation to mirror there). This bypasses module.upload() and POSTs
  // a minimal multipart body directly instead, using the same minimal field set NFC's Android
  // wrapper uses.
  //
  // `type` and `imgSession` are `private` on Selfie, and `imgSession`'s own type (DocImage) and
  // its `imageObj` property aren't `public` either — none of it is reachable via normal property
  // access from this module. Mirror reflects through both objects anyway, same technique as
  // NFCModule: Swift access control is compile-time only, so runtime introspection can still read
  // internal/private storage across the module boundary. `imageObj[0]` holds the front-step
  // capture as a raw base64 JPEG string (steps.front.rawValue == 0) — already exactly what the
  // native upload would have sent, so no re-encoding needed. Remove this override (and
  // RawUploadConfig) once the backend fix ships.
  public func upload(resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    var docType: String?
    var imgSessionValue: Any?
    for child in Mirror(reflecting: module).children {
      switch child.label {
      case "type": docType = child.value as? String
      case "imgSession": imgSessionValue = child.value
      default: break
      }
    }

    var rawBase64: String?
    if let imgSessionValue = imgSessionValue {
      for child in Mirror(reflecting: imgSessionValue).children {
        if child.label == "imageObj", let imageObj = child.value as? [Int: String] {
          rawBase64 = imageObj[0]
        }
      }
    }

    guard let rawBase64 = rawBase64, let type = docType else {
      reject("SelfieModule", "No selfie capture data available to upload", nil)
      return
    }

    let base64Image = "data:image/jpeg;base64,\(rawBase64)"
    let customerId = Amani.sharedInstance.customerInfo().getCustomer().id ?? ""

    let server = RawUploadConfig.server
    let trimmedServer = server.hasSuffix("/") ? String(server.dropLast()) : server

    let urlString: String
    let authHeader: String
    var fields: [(String, String)]

    if RawUploadConfig.apiVersion == "v1" {
      urlString = "\(trimmedServer)/api/v1/recognition/web/upload?ln=\(RawUploadConfig.lang)"
      authHeader = "token \(RawUploadConfig.token)"
      fields = [
        ("type", type),
        ("customer_id", customerId),
        ("files[]", base64Image),
        ("cropped", "false"),
        ("attempt", "1"),
      ]
    } else {
      urlString = "\(trimmedServer)/api/v2/document"
      authHeader = "Bearer \(RawUploadConfig.token)"
      fields = [
        ("type", type),
        ("profile", customerId),
        ("pages", base64Image),
        ("cropped", "false"),
        ("rotated", "true"),
      ]
    }

    guard let url = URL(string: urlString) else {
      reject("SelfieModule", "Invalid server URL", nil)
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
        reject("SELFIE_UPLOAD_ERROR", error.localizedDescription, error)
        return
      }
      let statusCode = (response as? HTTPURLResponse)?.statusCode ?? 0
      let bodyString = data.flatMap { String(data: $0, encoding: .utf8) } ?? "<empty>"
      print("[RawSelfieUpload] apiVersion=\(RawUploadConfig.apiVersion) status=\(statusCode) body=\(bodyString)")
      resolve(statusCode >= 200 && statusCode < 300)
    }.resume()
  }
}
