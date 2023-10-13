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

  public func start(resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async { [weak self] in
      let vc = RCTPresentedViewController()
      guard let self = self else {return}
      do {
        let view = try module.start { image in
          resolve("data:image/png;base64,\(image.toBase64PNGImage()!)")
          self.moduleView.removeFromSuperview()
        }
        
        DispatchQueue.main.async {
          self.moduleView = SDKView(sdkView: view!)
          self.moduleView.start(on: vc!)
        }
      } catch let err {
        reject("RNAmani-Selfie", err.localizedDescription, nil)
      }
    }
  }

  public func setType(type: String, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    module.setType(type: type)
    resolve(nil)
  }

  public func upload(resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    module.upload { isSuccess in
      resolve(isSuccess)
    }
  }
}
