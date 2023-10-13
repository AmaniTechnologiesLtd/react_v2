package com.amanisdk.modules

import com.amanisdk.R
import com.amanisdk.extensions.setupBackButton
import com.facebook.react.bridge.Promise
import java.lang.Exception
import ai.amani.sdk.Amani
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

class Selfie {
  private val selfieModule = Amani.sharedInstance().Selfie()
  private var docType: String? = "XXX_SE_0"
  private var frag: Fragment? = null
  private var closeButton: Button? = null
  companion object {
    val instance = Selfie()
  }


  fun start(stepID: Int, activity: Activity, promise: Promise) {
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

      frag = selfieModule.start(docType) { bitmap, _, _ ->
        if (bitmap != null) {
          promise.resolve(bitmap.toJpegBase64String())
          activity.supportFragmentManager
            .beginTransaction()
            .remove(frag!!).commit()

          activity.runOnUiThread {
            closeButton!!.visibility = View.GONE
          }
        }
      }

      closeButton = container.setupBackButton(R.drawable.baseline_close_24, onClick = {
        activity.supportFragmentManager.beginTransaction().remove(frag!!).commit()
      })

      activity.supportFragmentManager
        .beginTransaction()
        .replace(id, frag!!)
        .commit()
    }
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
          promise.resolve(false)
        }
      }
    }
  }

  fun upload(activity: Activity, promise: Promise) {
    try {
      selfieModule.upload(activity as FragmentActivity, docType!!) {
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
