//
//  NFCModule.swift
//  react-native-amani-sdk
//
//  Created by Deniz Can on 18.09.2023.
//

import AmaniSDK
@available(iOS 13, *)
class NFCModule {
  private let module = Amani.sharedInstance.scanNFC()
  private var moduleView: SDKView!

  func start(imageData: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    module.start(imageBase64: imageData) { _ in
      resolve(true)
    }
  }

  func start(nviData: NviModel, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    do {
      try module.start(nviData: nviData) { _ in
        resolve(true)
      }

    } catch let err {
      reject("ModuleError", err.localizedDescription, nil)
    }
  }

  func start(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    let vc = UIApplication.shared.windows.last?.rootViewController

    let view = module.start { _ in
      resolve(true)
      DispatchQueue.main.async {
        self.moduleView.removeFromSuperview()
      }
    }

    DispatchQueue.main.async {
      self.moduleView = SDKView(sdkView: view!)
      self.moduleView.start(on: vc!)
    }
  }

  func setType(type: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    module.setType(type: type)
    resolve(nil)
  }

  func upload(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    module.upload { isSuccess in
      resolve(isSuccess)
    }
  }
}
