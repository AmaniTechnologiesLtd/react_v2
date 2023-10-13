//
//  PoseEstimationModule.swift
//  react-native-amani-sdk
//
//  Created by Deniz Can on 18.09.2023.
//

import AmaniSDK
import React

@available(iOS 12.0, *)
class PoseEstimationModule {
  private let module = Amani.sharedInstance.poseEstimation()
  private var moduleView: SDKView!

  public func start(settings: PoseEstimationSettings, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    // Set settings
    module.setScreenConfig(screenConfig: [
      .appBackgroundColor: settings.appBackgroundColor,
      .appFontColor: settings.appFontColor,
      .primaryButtonBackgroundColor: settings.primaryButtonBackgroundColor,
      .primaryButtonTextColor: settings.primaryButtonTextColor,
      .ovalBorderColor: settings.ovalBorderColor,
      .ovalBorderSuccessColor: settings.ovalBorderSuccessColor,
      .poseCount: settings.poseCount,
    ])

    module.setInfoMessages(infoMessages: [
      .faceIsOk: settings.faceIsOk,
      .notInArea: settings.notInArea,
      .faceTooSmall: settings.faceTooSmall,
      .faceTooBig: settings.faceTooBig,
      .completed: settings.completed,
      .turnRight: settings.turnRight,
      .turnLeft: settings.turnLeft,
      .turnUp: settings.turnUp,
      .turnDown: settings.turnDown,
      .lookStraight: settings.lookStraight,
      .errorMessage: settings.errorMessage,
      .next: settings.next,
      .tryAgain: settings.tryAgain,
      .errorTitle: settings.errorTitle,
      .informationScreenDesc1: settings.informationScreenDesc1,
      .informationScreenDesc2: settings.informationScreenDesc2,
      .informationScreenTitle: settings.informationScreenTitle,
      .wrongPose: settings.wrongPose,
      .descriptionHeader: settings.descriptionHeader,
    ])

    module.setManualCropTimeout(Timeout: settings.manualCropTimeout)

    // Start the module
    DispatchQueue.main.async {
      do {
        let vc = RCTPresentedViewController()
        let view = try self.module.start { [weak self] image in
          guard let self = self else { return }
          resolve("data:image/png;base64,\(image.toBase64PNGImage()!)")

          DispatchQueue.main.async {
            self.moduleView.removeFromSuperview()
          }
        }

        // Add the module view
        DispatchQueue.main.async {
          self.moduleView = SDKView(sdkView: view!)
          self.moduleView.start(on: vc!)
        }
        // Reject the promise with errors.
      } catch let err {
        reject("RNAmani-PoseEstimation", err.localizedDescription, err)
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
