import AmaniSDK
import React

@objc(AmaniSdk)
class AmaniSdk: RCTEventEmitter {
  private var hasListeners = false

  override func startObserving() {
    hasListeners = true
  }

  override func stopObserving() {
    hasListeners = false
  }

  override func sendEvent(withName name: String!, body: Any!) {
    if hasListeners {
      super.sendEvent(withName: name, body: body)
    }
  }

  @objc
  public func initAmani(_ params: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let params: InitAmaniParams = convertParamsTo(params: params) else {
      reject("RNAmani-Converter", "Failed to convert parameters to required type", nil)
      return
    }

    var source: UploadSource = .KYC
    if let sourceParam = params.uploadSource {
      source = UploadSource(rawValue: sourceParam)!
    }

    var apiVersion: ApiVersions = .v2
    if let versionParam = params.apiVersion {
      apiVersion = ApiVersions(rawValue: versionParam)!
    }

    let customerReq = CustomerRequestModel(name: params.name ?? "", email: params.email ?? "", phone: params.phone ?? "", idCardNumber: params.idCardNumber)
    Amani.sharedInstance.setDelegate(delegate: self)
    Amani.sharedInstance.initAmani(server: params.server, token: params.customerToken, customer: customerReq, uploadSource: source, apiVersion: apiVersion) { customerRes, err in
      if customerRes != nil {
        resolve(true)
      } else if let err = err {
        reject(String(describing: err.error_code), String(describing: err.error_message!), nil)
      }
    }
  }

  @objc
  public func getCustomerInfo(resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let customerInfo = Amani.sharedInstance.customerInfo().getCustomer()

    var rulesArray: [[String: Any]] = []
    if let rules = customerInfo.rules {
      for rule in rules {
        rulesArray.append(["id": rule.id as Any, "title": rule.title as Any, "documentClasses": rule.documentClasses as Any, "status": rule.status as Any])
      }
    }

    var missingRulesArray: [[String: Any]] = []
    if let missingRules = customerInfo.missingRules {
      for rule in missingRules {
        missingRulesArray.append(["id": rule.id as Any, "title": rule.title as Any, "documentClasses": rule.documentClasses as Any, "status": rule.status as Any])
      }
    }

    let customerInfoDict: [String: Any] = [
      "id": customerInfo.id as Any,
      "name": customerInfo.name as Any,
      "email": customerInfo.email as Any,
      "phone": customerInfo.phone as Any,
      "companyID": customerInfo.companyID as Any,
      "status": customerInfo.status as Any,
      "occupation": customerInfo.occupation as Any,
      "city": customerInfo.address?.city as Any,
      "address": customerInfo.address?.address as Any,
      "province": customerInfo.address?.province as Any,
      "rules": rulesArray,
      "missingRules": missingRulesArray,
    ]

    resolve(customerInfoDict)
  }

  // MARK: IDcapture

  @objc
  public func idCaptureStart(_ params: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let params: IdCaptureParams = convertParamsTo(params: params) else {
      reject("RNAmani-Converter", "Failed to convert parameters to required type", nil)
      return
    }
    let idCapture = IdCaptureModule()
    DispatchQueue.main.async {
      idCapture.start(stepID: params.stepId ?? steps.front.rawValue, resolve: resolve, rejecter: reject)
    }
  }

  @objc
  public func idCaptureSetType(_ params: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let params: SetTypeParams = convertParamsTo(params: params) else {
      reject("RNAmani-Converter", "Failed to convert parameters to required type", nil)
      return
    }
    let idCapture = IdCaptureModule()
    idCapture.setType(type: params.type, resolve: resolve, rejecter: reject)
  }

  @objc
  public func idCaptureUpload(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let idCapture = IdCaptureModule()
    idCapture.upload(resolve: resolve, rejecter: reject)
  }

  @objc
  public func idCaptureIOSStartNFC(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    if #available(iOS 13, *) {
      IdCaptureModule().startNFC(resolve: resolve, rejecter: reject)
    } else {
      reject("RNAmani-IdCapture", "NFC is only available after iOS 13 or newer", nil)
    }
  }

  // MARK: Selfie

  @objc
  public func selfieStart(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    SelfieModule().start(resolve: resolve, rejecter: reject)
  }

  @objc
  public func selfieSetType(_ params: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let params: SetTypeParams = convertParamsTo(params: params) else {
      reject("RNAmani-Converter", "Failed to convert parameters to required type", nil)
      return
    }

    let selfie = SelfieModule()
    selfie.setType(type: params.type, resolve: resolve, rejecter: reject)
  }

  @objc
  public func selfieUpload(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    SelfieModule().upload(resolve: resolve, rejecter: reject)
  }

  // MARK: AutoSelfie

  @objc
  public func autoSelfieStart(_ params: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let params: AutoSelfieSettings = convertParamsTo(params: params) else {
      reject("RNAmani-Converter", "Failed to convert parameters to required type", nil)
      return
    }
    AutoSelfieModule().start(settings: params, resolve: resolve, reject: reject)
  }

  @objc
  public func autoSelfieSetType(_ params: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let params: SetTypeParams = convertParamsTo(params: params) else {
      reject("RNAmani-Converter", "Failed to convert parameters to required type", nil)
      return
    }

    AutoSelfieModule().setType(type: params.type, resolve: resolve, reject: reject)
  }

  @objc
  public func autoSelfieUpload(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    AutoSelfieModule().upload(resolve: resolve, reject: reject)
  }

  // MARK: Pose Estimation

  @objc
  public func poseEstimationStart(_ params: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let settings: PoseEstimationSettings = convertParamsTo(params: params) else {
      reject("RNAmani-Converter", "Failed to convert parameters to required type", nil)
      return
    }

    if #available(iOS 12.0, *) {
      PoseEstimationModule().start(settings: settings, resolve: resolve, reject: reject)
    } else {
      reject("RNAmani-PoseEstimation", "Pose Estimation is only availbable in iOS 12.0 or newer", nil)
    }
  }

  @objc
  public func poseEstimationSetType(_ params: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let setTypeParams: SetTypeParams = convertParamsTo(params: params) else {
      reject("RNAmani-Converter", "Failed to convert parameters to required type", nil)
      return
    }

    if #available(iOS 12.0, *) {
      PoseEstimationModule().setType(type: setTypeParams.type, resolve: resolve, reject: reject)
    } else {
      reject("RNAmani-PoseEstimation", "Pose Estimation is only available in iOS 12.0 or newer", nil)
      return
    }
  }

  @objc
  public func poseEstimationUpload(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    if #available(iOS 12.0, *) {
      PoseEstimationModule().upload(resolve: resolve, reject: reject)
    } else {
      reject("RNAmani-PoseEstimation", "Pose Estimation is only available in iOS 12.0 or newer", nil)
      return
    }
  }

  // MARK: NFC

  @objc
  public func startIOSNFCCaptureWithBase64Image(_ imageData: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    if #available(iOS 13.0, *) {
      NFCModule().start(imageData: imageData, resolve: resolve, reject: reject)
    } else {
      reject("RNAmani-NFCCapture", "NFCCapture is only available in iOS 13.0 or newer", nil)
      return
    }
  }

  @objc
  public func startIOSNFCCaptureWithNVIModel(_ params: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let nviData: NviModel = convertParamsTo(params: params) else {
      reject("RNAmani-Converter", "Failed to convert parameters to required type", nil)
      return
    }

    if #available(iOS 13.0, *) {
      NFCModule().start(nviData: nviData, resolve: resolve, reject: reject)
    } else {
      reject("RNAmani-NFCCapture", "NFCCapture is only available in iOS 13.0 or newer", nil)
      return
    }
  }

  @objc
  public func startIOSNFCCaptureWithMRZCapture(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    if #available(iOS 13.0, *) {
      NFCModule().start(resolve: resolve, reject: reject)
    } else {
      reject("RNAmani-NFCCapture", "NFCCapture is only available in iOS 13.0 or newer", nil)
      return
    }
  }

  func IOSNFCCaptureSetType(_ params: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let params: SetTypeParams = convertParamsTo(params: params) else {
      reject("RNAmani-Converter", "Failed to convert parameters to required type", nil)
      return
    }

    if #available(iOS 13.0, *) {
      NFCModule().setType(type: params.type, resolve: resolve, reject: reject)
    } else {
      reject("RNAmani-NFCCapture", "NFCCapture is only available in iOS 13.0 or newer", nil)
      return
    }
  }

  @objc
  public func IOSNFCCaptureUpload(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    if #available(iOS 13.0, *) {
      NFCModule().upload(resolve: resolve, reject: reject)
    } else {
      reject("RNAmani-NFCCapture", "NFC Capture is only available in iOS 12.0 or newer", nil)
      return
    }
  }

  // MARK: Utils

  private func convertParamsTo<T: Decodable>(params: NSDictionary) -> T? {
    guard let params = params as? [String: Any] else {
      return nil
    }

    if let convertedParams: T = params.convertTo() {
      return convertedParams
    } else {
      return nil
    }
  }

  override func supportedEvents() -> [String]! {
    return ["onError", "profileStatus", "stepResult"]
  }
}

extension AmaniSdk: AmaniDelegate {
  func onProfileStatus(customerId: String, profile: AmaniSDK.wsProfileStatusModel) {
    do {
      let jsonData = try JSONEncoder().encode(profile)
      sendEvent(withName: "profileStatus", body: String(data: jsonData, encoding: .utf8))
    } catch {
      sendEvent(
        withName: "onError",
        body:
        [
          "type": "JSONConversation",
          "errors": [
            "error_code": "40011",
            "error_message": "\(error.localizedDescription)"]
            .toJSONString() as Any,
        ].toJSONString())
    }
  }

  func onStepModel(customerId: String, rules: [AmaniSDK.KYCRuleModel]?) {
    do {
      let jsonData = try JSONEncoder().encode(["rules": rules])
      sendEvent(withName: "stepResult", body: String(data: jsonData, encoding: .utf8))
    } catch {
      let errorResponseBody = [
        "type": "JSONConversation",
        "errors": [
          "error_code": "30011",
          "error_message": "\(error.localizedDescription)"
        ],
      ].toJSONString()
      sendEvent(withName: "onError", body: errorResponseBody)
    }
  }

  func onError(type: String, error: [AmaniSDK.AmaniError]) {
    do {
      let errorJson = String(data: try JSONEncoder().encode(error), encoding: .utf8)
      let errorResponseBody = [
        "type": type,
        "errors": errorJson as Any,
      ].toJSONString()
      sendEvent(withName: "onError", body: errorResponseBody)
    } catch {
      let errorBody = [
        "error_code": "30011",
        "error_message": "\(error.localizedDescription)",
      ].toJSONString()
      let responseBody = [
        "type": "JSONConversation",
        "errors": errorBody as Any,
      ].toJSONString()
      sendEvent(withName: "onError", body: responseBody)
    }
  }
}
