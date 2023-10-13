//
//  IDCaptureModule.swift
//  react-native-amani-sdk
//
//  Created by Deniz Can on 18.09.2023.
//

import Foundation
import React
import AmaniSDK

class IdCaptureModule {
  private let module = Amani.sharedInstance.IdCapture()
  private var moduleView: SDKView!
  
  public func start(stepID: Int, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let vc = RCTPresentedViewController()
    do {
      let view = try module.start(stepId: stepID) { image in
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
      reject("AmaniSDK-IdCapture", err.localizedDescription, nil)
    }
  }
  
  @available(iOS 13, *)
  public func startNFC(resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    
    module.startNFC { done in
      resolve(done)
    }
  }
  
  public func setType(type: String, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    module.setType(type: type)
    resolve(nil)
  }
  
  public func upload(resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    module.upload { (isSuccess) in
      resolve(isSuccess)
    }
  }
  
}

