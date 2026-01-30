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

  func upload(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    module.upload { isSuccess in
      resolve(isSuccess)
    }
  }
}
