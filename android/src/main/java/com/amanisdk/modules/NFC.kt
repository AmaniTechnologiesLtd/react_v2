package com.amanisdk.modules

import ai.amani.sdk.Amani
import android.app.PendingIntent
import android.app.PendingIntent.FLAG_MUTABLE
import android.content.Intent
import android.nfc.NfcAdapter
import android.os.Build
import androidx.fragment.app.FragmentActivity
import com.facebook.react.ReactActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.lang.Exception

class NFC {
  private val nfcModule = Amani.sharedInstance().ScanNFC()
  private var docType: String = "XXX_NF_0"
  private var nfcAdapter: NfcAdapter? = null

  companion object {
    val instance = NFC()
  }

  fun start(
    birthDate: String,
    expireDate: String,
    documentNo: String,
    activity: ReactActivity,
    promise: Promise
  ) {
    nfcAdapter = NfcAdapter.getDefaultAdapter(activity)
    if (nfcAdapter != null) {
//      val intent = Intent(activity, this.javaClass)
//      intent.flags = Intent.FLAG_ACTIVITY_SINGLE_TOP
//      val pendingIntent = PendingIntent.getActivity(
//        activity,
//        0,
//        intent,
//        PendingIntent.FLAG_UPDATE_CURRENT)
//      val filter = arrayOf(arrayOf("android.nfc.tech.IsoDep"))

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
        nfcModule.start(it, activity, birthDate, expireDate, documentNo) {_, isSuccess, exception ->
          if(exception == null) {
            promise.resolve(isSuccess)
            val params = WritableNativeMap()
            params.putBoolean("status", isSuccess)
            sendEvent(activity.applicationContext as ReactContext, "android#onNFCComplete", params)
          } else {
            val params = WritableNativeMap()
            params.putString("error", exception)
            sendEvent(activity.applicationContext as ReactContext, "android#onNFCComplete", params)
          }
        }
      }, NfcAdapter.FLAG_READER_NFC_A, null)
    }
  }

  fun disableNFC(activity: ReactActivity, promise: Promise) {
    // No start hasn't been called, resolve regardless
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

  private fun sendEvent(
    reactContext: ReactContext,
    eventName: String,
    params: WritableMap
  ) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      ?.emit(eventName, params)
  }

}
