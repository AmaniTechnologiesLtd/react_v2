package com.amanisdk.modules

import ai.amani.sdk.Amani
import ai.amani.base.util.SessionManager
import android.nfc.NfcAdapter
import androidx.fragment.app.FragmentActivity
import com.facebook.react.ReactActivity
import com.facebook.react.bridge.*
import java.io.IOException
import java.lang.Exception
import kotlin.reflect.KFunction2
import com.facebook.react.bridge.UiThreadUtil
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject

class NFC {

  private val nfcModule by lazy { Amani.sharedInstance().ScanNFC() }
  private var docType: String = "XXX_NF_0"
  private var nfcAdapter: NfcAdapter? = null
  private var birthDate: String? = null
  private var expireDate: String? = null
  private var documentNo: String? = null

  var serverUrl: String = ""
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
    // Resolve immediately so JSI is satisfied and JS can attach event listeners.
    // enableReaderMode must run on the main thread, so post it separately.
    promise.resolve(null)
    UiThreadUtil.runOnUiThread {
      try {
        nfcAdapter!!.enableReaderMode(
          activity,
          { nfcTag ->
            try {
              nfcModule.start(nfcTag, activity, this.birthDate!!, this.expireDate!!, this.documentNo!!) { _, isSuccess, exception ->
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
            } catch (e: Exception) {
              val params = WritableNativeMap()
              params.putString("error", e.message ?: "NFC read error")
              this.sendEventFn?.invoke("android#onNFCError", params)
            }
          },
          NfcAdapter.FLAG_READER_NFC_A or NfcAdapter.FLAG_READER_NFC_B,
          null
        )
      } catch (e: Exception) {
        val params = WritableNativeMap()
        params.putString("error", "Failed to enable NFC reader: ${e.message}")
        this.sendEventFn?.invoke("android#onNFCError", params)
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
      val mrz = SessionManager.getMrzOnlyValue()?.replace("\n", "") ?: ""
      val nfcImage = SessionManager.getNFC() ?: ""
      val dimensions = SessionManager.getNfcWidthAndHeight()
      val customerId = SessionManager.getCustomerIdV2() ?: ""
      val token = SessionManager.getToken() ?: ""
      val height = dimensions?.getOrNull(0) ?: 0
      val width = dimensions?.getOrNull(1) ?: 0

      val photo = JSONObject().apply {
        put("base64", nfcImage)
        put("height", height)
        put("width", width)
      }
      val nfc = JSONObject().apply {
        put("mrz", mrz)
        put("photo", photo)
      }
      val body = JSONObject().apply {
        put("type", docType)
        put("profile", customerId)
        put("files", JSONArray().put(nfcImage))
        put("nfc", nfc)
        put("cropped", true)
        put("rotated", true)
      }

      val url = serverUrl.trimEnd('/') + "/api/v2/document"
      val client = OkHttpClient()
      val request = Request.Builder()
        .url(url)
        .addHeader("Authorization", "Bearer $token")
        .post(body.toString().toRequestBody("application/json".toMediaType()))
        .build()

      client.newCall(request).enqueue(object : okhttp3.Callback {
        override fun onFailure(call: okhttp3.Call, e: IOException) {
          promise.reject("NFC_UPLOAD_ERROR", e.message ?: "Upload failed")
        }
        override fun onResponse(call: okhttp3.Call, response: okhttp3.Response) {
          promise.resolve(response.isSuccessful)
          response.close()
        }
      })
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
