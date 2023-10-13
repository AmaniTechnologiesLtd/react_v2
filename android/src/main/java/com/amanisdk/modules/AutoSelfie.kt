package com.amanisdk.modules

import ai.amani.sdk.Amani
import ai.amani.sdk.modules.selfie.auto_capture.ASCBuilder
import android.app.Activity
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.FrameLayout
import androidx.fragment.app.Fragment
import com.amanisdk.R
import com.amanisdk.extensions.setupBackButton
import com.amanisdk.extensions.toJpegBase64String
import com.amanisdk.models.AutoSelfieSettings
import com.facebook.react.ReactActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.UiThreadUtil

class AutoSelfie {
  private val autoSelfieModule = Amani.sharedInstance().AutoSelfieCapture()
  private var docType: String = "XXX_SE_0"
  private var frag: Fragment? = null
  private var closeButton: Button? = null
  private var settings: AutoSelfieSettings? = null

  companion object {
    val instance = AutoSelfie()
  }

  fun start(activity: ReactActivity, promise: Promise) {
    if(settings == null) {
      promise.reject("1005", "You have to call setSettings on this before using autoSelfie")
      return
    }

    UiThreadUtil.runOnUiThread {

      val id = 0x123456
      val ctx = activity.applicationContext
      val viewParams = FrameLayout.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT,
        ViewGroup.LayoutParams.MATCH_PARENT
      )

      val container = FrameLayout(ctx)
      container.id = id
      activity.addContentView(container, viewParams)

      val ascBuilder = ASCBuilder(
        messageTextColor = R.color.auto_selfie_text,
        messageTextSize = settings!!.textSize,
        counterTextColor = R.color.auto_selfie_counter_text,
        counterTextVisibility = settings!!.counterVisible,
        counterTextSize = settings!!.counterTextSize,
        timeOutManualButton = settings!!.manualCaptureTimeout,
        closeEnoughMessageText = settings!!.distanceText,
        faceNotFoundMessageText = settings!!.faceNotFoundText,
        holdStableMessageText = settings!!.stableText,
        failureMessageText = settings!!.restartText,
        ovalColor = R.color.auto_selfie_oval_view,
        successColor = R.color.auto_selfie_success_anim,
      )

      frag = autoSelfieModule.start(docType, ascBuilder, container) { bitmap, _, _ ->
        if (bitmap != null) {
          promise.resolve(bitmap.toJpegBase64String())
          activity.supportFragmentManager
            .beginTransaction()
            .remove(frag!!).commit()
        }
      }

      closeButton = container.setupBackButton(
        R.drawable.baseline_close_24,
        onClick = {
          activity.supportFragmentManager.beginTransaction().remove(frag!!).commit()
        }
      )

      activity.supportFragmentManager.beginTransaction()
        .addToBackStack(frag!!.javaClass.name)
        .replace(id, frag!!)
        .commit()
    }
  }

  fun upload(activity: ReactActivity, promise: Promise) {
    try {
      autoSelfieModule.upload(activity, docType) {
        promise.resolve(it)
      }
    } catch (e: Exception) {
      promise.reject("400012", "Upload exception", e)
    }
  }

  fun setType(type: String, promise: Promise) {
    this.docType = type
    promise.resolve(null)
  }

  fun setSettings(settings: AutoSelfieSettings) {
    this.settings = settings
  }

  fun backPressHandle(activity: Activity, result: Promise) {
    if (frag == null){
      result.reject("30001",
        "You must call this function while the module is running you can ignore this message if it's not running")
    } else {
      activity.runOnUiThread {
        frag?.let {
          closeButton!!.visibility = View.GONE
          it.parentFragmentManager.beginTransaction().remove(frag!!).commit()
          frag = null
          // This blocks the back press action.
          result.resolve(false)
        }
      }
   }
  }

}
