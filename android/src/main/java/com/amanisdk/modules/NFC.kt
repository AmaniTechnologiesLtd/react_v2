package com.amanisdk.modules

import ai.amani.sdk.Amani
import android.nfc.NfcAdapter
import androidx.fragment.app.FragmentActivity
import com.facebook.react.ReactActivity
import com.facebook.react.bridge.*
import java.lang.Exception
import kotlin.reflect.KFunction2
import com.facebook.react.bridge.UiThreadUtil

class NFC {

  private val nfcModule = Amani.sharedInstance().ScanNFC()
  private var docType: String = "XXX_NF_0"
  private var nfcAdapter: NfcAdapter? = null
  private var birthDate: String? = null
  private var expireDate: String? = null
  private var documentNo: String? = null

  private var sendEventFn: (KFunction2<String, WritableNativeMap, Unit>)? = null
  companion object {
    val instance = NFC()
  }

  fun setSendEvent(sendEventFn: KFunction2<String, WritableNativeMap, Unit>) {
    this.sendEventFn = sendEventFn
  }

  fun start(birthDate: String?,
            expireDate: String?,
            documentNo: String?,
            activity: ReactActivity,
            promise: Promise
  ) {
    if (IdCapture.instance.usesNFC) {
      IdCapture.instance.getMRZ(
        onComplete = {
          this.birthDate = it.mRZBirthDate
          this.expireDate = it.mRZExpiryDate
          this.documentNo = it.mRZDocumentNumber
          startNFC(activity, promise)
        },
        onError = {
          // The iOS Part returns false when the MRZ request had failed.
          promise.resolve(false)
        }
      )
    } else {
      this.birthDate = birthDate
      this.expireDate = expireDate
      this.documentNo = documentNo
      startNFC(activity, promise)
    }
  }


  fun startNFC(
    activity: ReactActivity,
    promise: Promise
  ) {
    nfcAdapter = NfcAdapter.getDefaultAdapter(activity)
    if (nfcAdapter == null) {
      promise.reject("NFC_NOT_AVAILABLE", "NFC is not available on this device")
      return
    }
    UiThreadUtil.runOnUiThread {
      try {
        nfcAdapter!!.enableReaderMode(
          activity,
          { nfcTag ->
            nfcModule.start(nfcTag, activity, this.birthDate!!, this.expireDate!!, this.documentNo!!) { _, isSuccess, exception ->
              UiThreadUtil.runOnUiThread {
                try { nfcAdapter?.disableReaderMode(activity) } catch (e: Exception) { }
                nfcAdapter = null
              }
              if (exception.isNullOrEmpty()) {
                val params = WritableNativeMap()
                params.putBoolean("status", isSuccess)
                this.sendEventFn?.invoke("android#onNFCComplete", params)
              } else {
                val params = WritableNativeMap()
                params.putString("error", exception)
                this.sendEventFn?.invoke("android#onNFCError", params)
              }
            }
          },
          NfcAdapter.FLAG_READER_NFC_A or NfcAdapter.FLAG_READER_NFC_B,
          null
        )
        promise.resolve(null)
      } catch (e: Exception) {
        promise.reject("NFC_ERROR", "Failed to enable NFC reader: ${e.message}", e)
      }
    }
  }

  fun disableNFC(activity: ReactActivity, promise: Promise) {
    if (nfcAdapter == null) {
      promise.resolve(null)
    } else {
      UiThreadUtil.runOnUiThread {
        try {
          nfcAdapter!!.disableReaderMode(activity)
        } catch (e: Exception) {
          // ignore
        } finally {
          nfcAdapter = null
          promise.resolve(null)
        }
      }
    }
  }

  fun setType(type: String, promise: Promise) {
    docType = type
    promise.resolve(null)
  }

  fun upload(activity: ReactActivity, promise: Promise) {
    try {
      nfcModule.upload(activity as FragmentActivity, docType) {
        promise.resolve(it)
      }
    } catch (e: Exception) {
      promise.reject("400012", "Upload exception", e)
    }
  }

//  private fun sendEvent(
//    reactContext: ReactApplicationContext,
//    eventName: String,
//    params: WritableMap
//  ) {
//    reactContext
//      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
//      ?.emit(eventName, params)
//  }

}
