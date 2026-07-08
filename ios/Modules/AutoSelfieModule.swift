//
//  AutoSelfieModule.swift
//  react-native-amani-sdk
//
//  Created by Deniz Can on 18.09.2023.
//

import AmaniSDK
import React

class AutoSelfieModule {
  private let module = Amani.sharedInstance.autoSelfie()
  private var moduleView: SDKView!

  public func start(settings: AutoSelfieSettings, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    
    // Set settings.
    module.setInfoMessages(infoMessages: [
      .faceTooBig: settings.faceTooBig,
      .faceTooSmall: settings.faceTooSmall,
      .notInArea: settings.notInArea,
      .completed: settings.completed,
      .faceIsOk: settings.faceIsOk,
    ])
    
    module.setScreenConfigs(screenConfig: [
      .appBackgroundColor: settings.appBackgroundColor,
      .appFontColor: settings.appFontColor,
      .ovalBorderColor: settings.ovalBorderColor,
      .ovalBorderSuccessColor: settings.ovalBorderSuccessColor,
      .countTimer: settings.countTimer,
    ])
    
    DispatchQueue.main.async {
      let vc = RCTPresentedViewController()
      do {
         let view = try self.module.start { image in
          resolve("data:image/png;base64,\(image.toBase64PNGImage()!)")
          
          DispatchQueue.main.async {
            self.moduleView.removeFromSuperview()
          }
        }
        
        DispatchQueue.main.async {
          self.moduleView = SDKView(sdkView: view!)
          self.moduleView.start(on: vc!)
        }
      } catch let err {
        reject("RNAmani-AutoSelfie", err.localizedDescription, nil)
      }
    }
  }

  public func setType(type: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    module.setType(type: type)
    resolve(nil)
  }

  // WORKAROUND (see RawUploadConfig.swift): same backend gap as NFCModule/SelfieModule.upload()
  // — the native SDK's upload() sends `device_data` / `upload_source` fields the backend can't
  // handle ("Not implemented error"). This bypasses module.upload() and POSTs a minimal
  // multipart body directly, same minimal field set as NFC's Android wrapper.
  //
  // `type` and `imgSession` are `private` on AutoSelfie (and imgSession's own type, DocImage, and
  // its `imageObj` aren't `public` either) — none of it is reachable via normal property access
  // from this module. Mirror reflects through both the same way NFCModule/SelfieModule do, since
  // access control is compile-time only.
  //
  // The captured image's location depends on the installed SDK version: current IOS_SDK_V2 source
  // has AutoSelfie delegate entirely to PoseEstimation.sharedInstance's own `imgSession`, but the
  // pinned 3.4.27 binary still stores it on AutoSelfie's own `imgSession` (confirmed via runtime
  // inspection — the source and binary have diverged). Checking AutoSelfie's own imgSession first
  // covers the version actually shipping; PoseEstimation's is a fallback for whenever the pinned
  // version catches up to current source. Remove this override (and RawUploadConfig) once the
  // backend fix ships.
  private func extractRawBase64(from imgSessionValue: Any) -> String? {
    for child in Mirror(reflecting: imgSessionValue).children {
      if child.label == "imageObj", let imageObj = child.value as? [Int: String] {
        return imageObj[0]
      }
    }
    return nil
  }

  public func upload(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    var docType: String?
    var autoSelfieImgSession: Any?
    for child in Mirror(reflecting: module).children {
      if child.label == "type" {
        docType = child.value as? String
      }
      if child.label == "imgSession" {
        autoSelfieImgSession = child.value
      }
    }

    var rawBase64: String?
    var foundVia = "none"
    if let autoSelfieImgSession = autoSelfieImgSession, let found = extractRawBase64(from: autoSelfieImgSession) {
      rawBase64 = found
      foundVia = "AutoSelfie"
    } else {
      for child in Mirror(reflecting: PoseEstimation.sharedInstance).children where child.label == "imgSession" {
        if let found = extractRawBase64(from: child.value) {
          rawBase64 = found
          foundVia = "PoseEstimation"
        }
      }
    }
    print("[RawAutoSelfieUpload] image found via=\(foundVia)")

    guard let rawBase64 = rawBase64, let type = docType else {
      reject("AutoSelfieModule", "No selfie capture data available to upload", nil)
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
      reject("AutoSelfieModule", "Invalid server URL", nil)
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
        reject("AUTOSELFIE_UPLOAD_ERROR", error.localizedDescription, error)
        return
      }
      let statusCode = (response as? HTTPURLResponse)?.statusCode ?? 0
      let bodyString = data.flatMap { String(data: $0, encoding: .utf8) } ?? "<empty>"
      print("[RawAutoSelfieUpload] apiVersion=\(RawUploadConfig.apiVersion) status=\(statusCode) body=\(bodyString)")
      resolve(statusCode >= 200 && statusCode < 300)
    }.resume()
  }
}
