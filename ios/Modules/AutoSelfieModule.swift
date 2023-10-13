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

  public func upload(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    module.upload { isSuccess in
      resolve(isSuccess)
    }
  }
}
