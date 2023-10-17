package com.amanisdk.modules

import ai.amani.sdk.Amani
import android.annotation.SuppressLint
import android.app.PendingIntent
import android.content.Intent
import android.nfc.NfcAdapter
import android.os.Build
import androidx.fragment.app.FragmentActivity
import com.facebook.react.ReactActivity
import com.facebook.react.bridge.*
import java.lang.Exception
import kotlin.reflect.KFunction2

class NFC {

  private val nfcModule = Amani.sharedInstance().ScanNFC()
  private var docType: String = "XXX_NF_0"
  private var nfcAdapter: NfcAdapter? = null
  private var birthDate: String? = null
  private var expireDate: String? = null
  private var documentNo: String? = null

  private val FLAG_MUTABLE = 1 shl 25
  private val VERSION_CODES_S = 31
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


  @SuppressLint("WrongConstant")
  fun startNFC(
    activity: ReactActivity,
    promise: Promise
  ) {
    nfcAdapter = NfcAdapter.getDefaultAdapter(activity)
    if (nfcAdapter != null) {
      val intent = Intent(activity, this.javaClass)
      intent.flags = Intent.FLAG_ACTIVITY_SINGLE_TOP
      val pendingIntent = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        PendingIntent.getActivity(activity, 0, Intent(activity, javaClass)
          .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP), FLAG_MUTABLE)
      } else{
        PendingIntent.getActivity(activity, 0, Intent(activity, javaClass)
          .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP), 0)
      }
      val filter = arrayOf(arrayOf("android.nfc.tech.IsoDep"))
      nfcAdapter!!.enableForegroundDispatch(activity, pendingIntent, null, filter)
      promise.resolve(null)
      nfcAdapter!!.enableReaderMode(activity, {
        nfcModule.start(it, activity, this.birthDate!!, this.expireDate!!, this.documentNo!!) {_, isSuccess, exception ->
          if(exception.isNullOrEmpty()) {
            val params = WritableNativeMap()
            params.putBoolean("status", isSuccess)
//            sendEvent(activity.applicationContext as ReactApplicationContext, "android#onNFCComplete", params)
            this.sendEventFn?.invoke("android#onNFCComplete", params)
          } else {
            val params = WritableNativeMap()
            params.putString("error", exception)
            this.sendEventFn?.invoke("android#onNFCError", params)
//            sendEvent(activity.applicationContext as ReactApplicationContext, "android#onNFCError", params)
          }
        }
      }, NfcAdapter.FLAG_READER_NFC_A, null)
    }
  }

  fun disableNFC(activity: ReactActivity, promise: Promise) {
    // Start hasn't been called yet, resolve the promise regardless
    if (nfcAdapter == null) {
      promise.resolve(null)
    } else {
      nfcAdapter!!.disableReaderMode(activity)
      promise.resolve(null)
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
