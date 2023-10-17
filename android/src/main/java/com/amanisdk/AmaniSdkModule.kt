package com.amanisdk

import ai.amani.base.utility.AmaniVersion
import ai.amani.sdk.Amani
import ai.amani.sdk.interfaces.AmaniEventCallBack
import ai.amani.sdk.model.amani_events.error.AmaniError
import ai.amani.sdk.model.amani_events.profile_status.ProfileStatus
import ai.amani.sdk.model.amani_events.steps_result.StepsResult
import ai.amani.sdk.model.customer.CustomerDetailResult
import ai.amani.sdk.modules.customer.detail.CustomerDetailObserver
import com.amanisdk.extensions.toObject
import com.amanisdk.extensions.toWritableArray
import com.amanisdk.extensions.toWritableMap
import com.amanisdk.models.AutoSelfieSettings
import com.amanisdk.models.PoseEstimationSettings
import com.amanisdk.modules.*
import com.facebook.react.ReactActivity
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.gson.Gson

class AmaniSdkModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  /* Note(ddnzcn) - This is probably the worst way of exporting loosely bridged methods across
   * multiple classes. Perhaps exporting the "across the multiple classes" thing to individual
   * proper rn modules is the better approach on this. But that means rewriting all of the
   * counterparts. Which means a total rewrite of the module. Since is this a "port" from the
   * flutter bindings it's better to stay it like this.
   * Welp, there goes nothing.
  */

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  fun initAmani(params: ReadableMap, promise: Promise) {
    val server = params.getString("server")
    val customerIdCardNumber = params.getString("idCardNumber")
    val customerToken = params.getString("customerToken")
    val lang = if (!params.getString("lang").isNullOrEmpty()) params.getString("lang") else "tr"
    // Oddly returns boolean instead of boolean?
    val useLocation = params.getBoolean("useLocation")
    val sharedSecret = params.getString("sharedSecret")
    val version = params.getString("version")

    var amaniVersion: AmaniVersion = AmaniVersion.V2
    version?.let {
      amaniVersion = if (it == "v1") {
        AmaniVersion.V1
      } else {
        AmaniVersion.V2
      }
    }

    Amani.VERSION = amaniVersion

    if (
      server.isNullOrEmpty() ||
      customerIdCardNumber.isNullOrEmpty() ||
      customerToken.isNullOrEmpty()
    ) {
      promise.reject("400002", "One of the required parameters are missing")
      return
    }
    val activity = currentActivity
    if (activity == null) {
      promise.reject("400003", "Tried to initialize while activity is not ready")
      return
    }

    UiThreadUtil.runOnUiThread {
      Amani.init(activity, server, sharedSecret)
      Amani.sharedInstance().AmaniEvent().setListener(object : AmaniEventCallBack {
        override fun onError(type: String?, error: ArrayList<AmaniError?>?) {
          if (error != null) {
            val returnMap = mapOf(
              "type" to type,
              "errors" to Gson().toJson(error),
            )
            sendEvent("onError", Gson().toJson(returnMap))
          }
        }

        override fun profileStatus(profileStatus: ProfileStatus) {
          val returnMap = mapOf(
            "profileId" to profileStatus.profile,
            "status" to profileStatus.status,
            "amlStatus" to profileStatus.amlStatus,
            "risk" to profileStatus.risk
          )
          sendEvent("profileStatus", Gson().toJson(returnMap))
        }

        override fun stepsResult(stepsResult: StepsResult?) {
          if (stepsResult != null) {
            sendEvent("stepResult", Gson().toJson(stepsResult))
          }
        }

      })

      Amani.sharedInstance().initAmani(
        activity,
        customerIdCardNumber,
        customerToken,
        useLocation,
        lang!!,
      ) { loggedIn ->
        promise.resolve(loggedIn)
      }

    }
  }

  @ReactMethod
  fun getCustomerInfo(promise: Promise) {
    Amani.sharedInstance().CustomerDetail().getCustomerDetail(object : CustomerDetailObserver {
      override fun result(customerDetail: CustomerDetailResult?, throwable: Throwable?) {
        if (throwable != null) {
          promise.reject(throwable)
          return
        } else if (customerDetail != null) {
          val responseMap = mapOf(
            "id" to customerDetail.id,
            "name" to customerDetail.name,
            "status" to customerDetail.status,
            "occupation" to customerDetail.occupation,
            "email" to customerDetail.email,
            "phone" to customerDetail.phone,
            // FIXME: v3 address changes
            "city" to null,
            "address" to null,
            "province" to null,
            "idCardNumber" to customerDetail.idCardNumber,
          ).toWritableMap()
          // rules
          val rules = WritableNativeArray()
          customerDetail.rules?.forEach {
            val map = mapOf(
              "id" to (it.id as Any),
              "title" to (it.title as Any),
              "documentClasses" to (it.documentClasses?.toWritableArray() as Any),
              "status" to (it.status as Any)
            ).toWritableMap()
            rules.pushMap(map)
          }
          responseMap.putArray("rules", rules)

          // missing rules
          val missingRules = WritableNativeArray()
          customerDetail.missingRules?.forEach {
            val map = mapOf(
              "id" to (it?.id as Any),
              "title" to (it.title as Any),
              "documentClasses" to (it.documentClasses?.toWritableArray() as Any)
            ).toWritableMap()
            missingRules.pushMap(map)
          }
          responseMap.putArray("missingRules", missingRules)
          promise.resolve(responseMap)
          return
        }
      }
    })
  }

  @ReactMethod
  fun idCaptureStart(params: ReadableMap, promise: Promise) {
    val stepId = params.getInt("side")
    IdCapture.instance.start(stepId, (currentActivity as ReactActivity), promise)
  }

  @ReactMethod
  fun idCaptureSetType(params: ReadableMap, promise: Promise) {
    val type = params.getString("type")!!
    IdCapture.instance.setType(type, promise)
  }

  @ReactMethod
  fun idCaptureUpload(promise: Promise) {
    IdCapture.instance.upload((currentActivity as ReactActivity), promise)
  }

  @ReactMethod
  fun idCaptureSetWithNFC(params: ReadableMap, promise: Promise) {
    val nfcState = params.getBoolean("withNFC")
    IdCapture.instance.setWithNFC(nfcState)
    promise.resolve(true)
  }

  @ReactMethod
  fun selfieStart(promise: Promise) {
    Selfie.instance.start(0, (currentActivity as ReactActivity), promise)
  }

  @ReactMethod
  fun selfieSetType(params: ReadableMap, promise: Promise) {
    val type = params.getString("type")
    Selfie.instance.setType(type, promise)
  }

  @ReactMethod
  fun selfieUpload(promise: Promise) {
    Selfie.instance.upload((currentActivity as ReactActivity), promise)
  }

  @ReactMethod
  fun autoSelfieStart(params: ReadableMap, promise: Promise) {
    val gson = Gson()
    val settingsJson = gson.toJson(params.toHashMap())
    val autoSelfieSettings = settingsJson.toObject<AutoSelfieSettings>()
    AutoSelfie.instance.setSettings(autoSelfieSettings)
    AutoSelfie.instance.start((currentActivity as ReactActivity), promise)
  }

  @ReactMethod
  fun autoSelfieSetType(params: ReadableMap, promise: Promise) {
    val type = params.getString("type")
    AutoSelfie.instance.setType(type!!, promise)
  }

  @ReactMethod
  fun autoSelfieUpload(promise: Promise) {
    AutoSelfie.instance.upload((currentActivity as ReactActivity), promise)
  }

  @ReactMethod
  fun androidPoseEstimationStart(params: ReadableMap, promise: Promise) {
    val settingsJson = Gson().toJson(params.toHashMap())
    val poseEstimationSettings = settingsJson.toObject<PoseEstimationSettings>()
    PoseEstimation.instance.setSettings(poseEstimationSettings)
    PoseEstimation.instance.start((currentActivity as ReactActivity), promise)
  }

  @ReactMethod
  fun poseEstimationSetType(params: ReadableMap, promise: Promise) {
    val type = params.getString("type")!!
    PoseEstimation.instance.setType(type, promise)
  }

  @ReactMethod
  fun poseEstimationUpload(promise: Promise) {
    PoseEstimation.instance.upload((currentActivity as ReactActivity), promise)
  }

  @ReactMethod
  fun androidStartNFC(params: ReadableMap, promise: Promise) {
    val birthDate = params.getString("birthDate")
    val expireDate = params.getString("expireDate")
    val documentNo = params.getString("documentNo")
    NFC.instance.setSendEvent(this::sendEventMap)
    NFC.instance.start(
      birthDate,
      expireDate,
      documentNo,
      (currentActivity as ReactActivity),
      promise
    )
  }

  @ReactMethod
  fun androidDisableNFC(promise: Promise) {
    NFC.instance.disableNFC((currentActivity as ReactActivity), promise)
  }

  @ReactMethod
  fun androidNFCSetType(params: ReadableMap, promise: Promise) {
    val type = params.getString("type")!!
    NFC.instance.setType(type, promise)
  }

  @ReactMethod
  fun addListener(eventName: String?) {
    // Keep: Required for RN built in Event Emitter Calls.
  }

  @ReactMethod
  fun removeListeners(count: Int?) {
    // Keep: Required for RN built in Event Emitter Calls.
  }

  companion object {
    const val NAME = "AmaniSdk"
  }

  /*
  * Sends event to js side
  * note: this method takes a json string
  * */
  private fun sendEvent(
    eventName: String,
    params: String
  ) {
    this.reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      ?.emit(eventName, params)
  }

  private fun sendEventMap(
    eventName: String,
    params: WritableNativeMap
  ) {
    this.reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      ?.emit(eventName, params)
  }

}
