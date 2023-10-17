package com.amanisdk.modules

import ai.amani.sdk.model.amani_events.error.AmaniError
import com.amanisdk.R
import com.amanisdk.extensions.setupBackButton
import com.facebook.react.bridge.Promise
import ai.amani.sdk.Amani
import ai.amani.sdk.model.mrz.MRZResult
import android.app.Activity
import android.graphics.Bitmap
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.FrameLayout
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import com.amanisdk.extensions.toJpegBase64String
import com.facebook.react.bridge.UiThreadUtil
import java.io.ByteArrayOutputStream
import java.lang.Exception


class IdCapture {
  private var idCaptureModule = Amani.sharedInstance().IDCapture()
  private var docType: String? = null
  private var frag: Fragment? = null
  var usesNFC = false
  var closeButton: Button? = null

  companion object {
    val instance = IdCapture()
  }

  fun start(stepID: Int, activity: Activity, promise: Promise) {
    if(docType == null) {
      promise.reject("40003", "Type not set." + "You have to call setType on idCapture before calling this method.")
      return
    }

    val side: Boolean = stepID == 0


    UiThreadUtil.runOnUiThread {

      (activity as FragmentActivity)
      val id = 0x123456
      val context = activity.applicationContext
      val viewParams = FrameLayout.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT,
        ViewGroup.LayoutParams.MATCH_PARENT
      )
      val container = FrameLayout(context)
      container.id = id
      activity.addContentView(container, viewParams)

      frag = idCaptureModule.start(activity, container, docType!!, side) { bitmap, _, _ ->
        if (bitmap != null) {
          activity.runOnUiThread {
            closeButton!!.visibility = View.GONE
          }

          promise.resolve(bitmap.toJpegBase64String())
          activity.supportFragmentManager.beginTransaction().remove(frag!!).commit()
          frag = null
        }
      }

      closeButton = container.setupBackButton(R.drawable.baseline_close_24, onClick = {
        activity.supportFragmentManager.beginTransaction().remove(frag!!).commit()
        frag = null
      })

      if (frag == null) {
        promise.reject("40005", "Failed to initialize ID Capture")
      }

      val fragmentManager = activity.supportFragmentManager
      frag?.let {
        fragmentManager.beginTransaction()
          .addToBackStack(it.javaClass.name)
          .add(id, it)
          .commit()
      }
    }
  }

  fun setWithNFC(usesNFC: Boolean = false) {
    this.usesNFC = usesNFC
    idCaptureModule.withNFC(usesNFC)
  }

  fun setManualCaptureButtonTimeout(timeout: Int) {
    idCaptureModule.setManualCropTimeOut(timeout);
  }

  fun getMRZ(onComplete: (MRZResult) -> Unit,  onError: (AmaniError) -> Unit  ) {
    Amani.sharedInstance().IDCapture().getMRZ(type = docType!!, onComplete = onComplete, onError = onError)
  }

  fun backPressHandle(activity: Activity, promise: Promise) {
    if (frag == null){
      promise.reject("30001",
        "You must call this function while the" +
          "module is running\n" + "You can ignore this message and return true" +
          "from onWillPop()")
    } else {
      activity.runOnUiThread {
        frag?.let {
          closeButton!!.visibility = View.GONE
          it.parentFragmentManager.beginTransaction().remove(frag!!).commit()
          frag = null
          // This blocks the flutters back press action.
          promise.resolve(false)
        }
      }
    }
  }

  fun upload(activity: Activity, promise: Promise) {
    try {
      idCaptureModule.upload(activity as FragmentActivity, docType!!) {
        promise.resolve(it)
      }
    } catch (e: Exception) {
      promise.reject("400012", "Upload exception", e)
    }
  }

  fun setType(type: String?, promise: Promise) {
    this.docType = type
    promise.resolve(null)
  }

}
