package com.amanisdk.modules

import ai.amani.sdk.Amani
import ai.amani.sdk.modules.document.DocBuilder
import ai.amani.sdk.modules.document.interfaces.IDocumentCallBack
import ai.amani.sdk.modules.selfie.auto_capture.ASCBuilder
import android.annotation.SuppressLint
import android.view.ViewGroup
import android.widget.Button
import android.widget.FrameLayout
import androidx.fragment.app.Fragment
import com.amanisdk.R
import com.amanisdk.extensions.filePathToBitmap
import com.amanisdk.extensions.removeFragment
import com.amanisdk.extensions.setupBackButton
import com.amanisdk.extensions.toJpegBase64String
import com.amanisdk.models.AutoSelfieSettings
import com.facebook.react.ReactActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.UiThreadUtil
import javax.xml.parsers.DocumentBuilder

/**
 * @Author: @zekiamani
 * @Date: 28.02.2024
 */
class DocumentCapture {

  private val documentCaptureModule = Amani.sharedInstance().Document()
  private var docType: String = "XXX_SE_0"
  private var frag: Fragment? = null
  private var closeButton: Button? = null

  companion object {
    @SuppressLint("StaticFieldLeak")
    val instance = DocumentCapture()
  }

  fun start(activity: ReactActivity,  promise: Promise) {

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

      frag = documentCaptureModule.start(docType, null, container, object : IDocumentCallBack{
        override fun cb(listOfDocumentAbsolutePath: ArrayList<String>?, isSuccess: Boolean) {
          if (!listOfDocumentAbsolutePath.isNullOrEmpty()) {
              promise.resolve(listOfDocumentAbsolutePath.last().filePathToBitmap()?.toJpegBase64String())
              activity.removeFragment(frag)
          } else {
            promise.reject("20001", "No document image is returned")
          }
        }
      })

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

  fun setType(type: String, promise: Promise) {
    this.docType = type
    promise.resolve(null)
  }

  fun upload(activity: ReactActivity, promise: Promise) {
    try {
      documentCaptureModule.upload(activity, docType) {
        promise.resolve(it)
      }
    } catch (e: Exception) {
      promise.reject("20002", "Document upload exception", e)
    }
  }
}
