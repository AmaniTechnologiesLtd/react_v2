package com.amanisdk.modules

import ai.amani.sdk.Amani
import ai.amani.sdk.modules.selfie.pose_estimation.observable.OnFailurePoseEstimation
import ai.amani.sdk.modules.selfie.pose_estimation.observable.PoseEstimationObserver
import android.app.Activity
import android.graphics.Bitmap
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.FrameLayout
import androidx.fragment.app.Fragment
import com.amanisdk.R
import com.amanisdk.extensions.setupBackButton
import com.amanisdk.extensions.toJpegBase64String
import com.amanisdk.extensions.toWritableMap
import com.amanisdk.models.PoseEstimationSettings
import com.facebook.react.ReactActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class PoseEstimation {
  private val poseEstimationModule = Amani.sharedInstance().SelfiePoseEstimation()
  private var docType: String = "XXX_SE_0"
  private var frag: Fragment? = null
  private var closeButton: Button? = null

  private var settings: PoseEstimationSettings? = null

  companion object {
    val instance = PoseEstimation()
  }

  fun start(activity: ReactActivity, promise: Promise) {
    if (settings == null) {
      promise.reject("400001", "You have to call setSettings before calling poseEstimation.start()")
    }

    UiThreadUtil.runOnUiThread {
      val observer: PoseEstimationObserver = object : PoseEstimationObserver {
        override fun onError(error: Error) {
          activity.supportFragmentManager
            .beginTransaction().remove(frag!!)
            .commitAllowingStateLoss()
          sendEvent(
            activity.applicationContext as ReactApplicationContext,
            "androidPoseEstimation#onError",
            mapOf("message" to error.message).toWritableMap()
          )
        }

        override fun onFailure(reason: OnFailurePoseEstimation, currentAttempt: Int) {
          sendEvent(
            activity.applicationContext as ReactApplicationContext,
            "androidPoseEstimation#onFailure",
            mapOf(
              "reason" to reason.name,
              "currentAttempt" to currentAttempt,
            ).toWritableMap()
          )
        }

        override fun onSuccess(bitmap: Bitmap?) {
          if (bitmap != null) {
            activity.supportFragmentManager
              .beginTransaction().remove(frag!!)
              .commit()
            promise.resolve(bitmap.toJpegBase64String())
          }
        }
      }

      frag = poseEstimationModule
        .Builder()
        .requestedPoseNumber(numberOfPose = settings!!.poseCount)
        .ovalViewAnimationDurationMilSec(settings!!.animationDuration)
        .userInterfaceTexts(
          faceNotInside = settings!!.faceNotInside,
          faceNotStraight = settings!!.faceNotStraight,
          faceIsTooFar = settings!!.faceIsTooFar,
          faceStraight = settings!!.keepStraight,
          alertTitle = settings!!.alertTitle,
          alertDescription = settings!!.alertDescription,
          alertTryAgain = settings!!.alertTryAgain,
        )
        .userInterfaceColors(
          ovalViewStartColor = R.color.pose_estimation_oval_view_start,
          ovalViewSuccessColor = R.color.pose_estimation_oval_view_success,
          ovalViewErrorColor = R.color.pose_estimation_oval_view_error,
          alertTitleFontColor = R.color.pose_estimation_alert_title,
          alertDescriptionFontColor = R.color.pose_estimation_alert_description,
          alertTryAgainFontColor = R.color.pose_estimation_alert_try_again,
          alertBackgroundFontColor = R.color.pose_estimation_alert_background,
          appFontColor = R.color.pose_estimation_font,
        )
        .observe(observer)
        .build(activity)

      val id = 0x123456
      val ctx = activity.applicationContext
      val viewParams = FrameLayout.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT,
        ViewGroup.LayoutParams.MATCH_PARENT
      )
      val container = FrameLayout(ctx)
      container.id = id
      activity.addContentView(container, viewParams)

      closeButton = container.setupBackButton(
        R.drawable.baseline_close_24,
        onClick = {
          activity.supportFragmentManager.beginTransaction().remove(frag!!).commit()
        }
      )

      activity.supportFragmentManager.beginTransaction()
        .replace(id, frag!!)
        .commit()
    }
  }

  fun upload(activity: ReactActivity, promise: Promise) {
    try {
      poseEstimationModule.upload(activity, docType) {
        promise.resolve(it)
      }
    } catch (e: Exception) {
      promise.reject("400012", "Upload exception", e)
    }
  }

  fun setSettings(settings: PoseEstimationSettings) {
    this.settings = settings
  }

  fun setType(type: String, promise: Promise) {
    this.docType = type
    promise.resolve(null)
  }

  private fun sendEvent(
    reactContext: ReactApplicationContext,
    eventName: String,
    params: WritableMap
  ) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      ?.emit(eventName, params)
  }

  fun backPressHandle(activity: Activity, promise: Promise) {
    if (frag == null) {
      promise.reject(
        "30001",
        "You should call this function while the" +
          "module is running otherwise you can ignore this message"
      )
    } else {
      activity.runOnUiThread {
        frag?.let {
          closeButton!!.visibility = View.GONE
          it.parentFragmentManager.beginTransaction().remove(frag!!).commit()
          frag = null
          // This blocks the react native's back press action.
          promise.resolve(false)
        }
      }
    }
  }
}
