package com.amanisdk.extensions

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Base64
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.FrameLayout
import android.widget.LinearLayout
import androidx.annotation.DrawableRes
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import com.facebook.react.ReactActivity
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import java.io.ByteArrayOutputStream
import com.google.gson.Gson
import java.io.File


interface JSONConvertible{
  fun toJSON(): String = Gson().toJson(this)
}

inline fun <reified T: JSONConvertible> String.toObject(): T = Gson().fromJson(this, T::class.java)

fun Bitmap.toJpegBase64String(): String {
  val stream = ByteArrayOutputStream()
  this.compress(Bitmap.CompressFormat.JPEG, 100, stream)
  return Base64.encodeToString(stream.toByteArray(), Base64.NO_WRAP)
}

fun <K, V> Map<K, V>.toWritableMap(): WritableNativeMap {
  val writableMap = WritableNativeMap()
  for ((key, value) in this) {
    when (value) {
      is String -> writableMap.putString(key as String, value)
      is Int -> writableMap.putInt(key as String, value)
      is Boolean -> writableMap.putBoolean(key as String, value)
      is WritableNativeArray -> writableMap.putArray(key as String, value)
      is WritableNativeMap -> writableMap.putMap(key as String, value)
      else -> Log.d("Mapper", value.toString())
    }
  }
  return writableMap
}

fun <T> List<T>.toWritableArray(): WritableNativeArray {
  val writableArray = WritableNativeArray()
  for (value in this) {
    when (value) {
      is String -> writableArray.pushString(value)
      is Int -> writableArray.pushInt(value)
      is Boolean -> writableArray.pushBoolean(value)
      is WritableNativeMap -> writableArray.pushMap(value)
    }
  }
  return writableArray
}

fun ViewGroup.installHierarchyFitter() {
  setOnHierarchyChangeListener(object : ViewGroup.OnHierarchyChangeListener {
    override fun onChildViewRemoved(parent: View?, child: View?) = Unit
    override fun onChildViewAdded(parent: View?, child: View?) {
      parent?.measure(
        View.MeasureSpec.makeMeasureSpec(measuredWidth, View.MeasureSpec.EXACTLY),
        View.MeasureSpec.makeMeasureSpec(measuredHeight, View.MeasureSpec.EXACTLY)
      )
      parent?.layout(0, 0, parent.measuredWidth, parent.measuredHeight)
    }
  })
}

fun FrameLayout.setupBackButton(@DrawableRes drawable: Int, onClick: () -> Unit  ): Button {
  val buttonWidth = 90
  val buttonHeight = 90
  val padding = 40
  var statusBarHeight = 0

  val button = Button(this.context)
  val params = LinearLayout.LayoutParams(buttonWidth, buttonHeight)

  val resourceId: Int = this.context.resources.getIdentifier("status_bar_height", "dimen", "android")
  if (resourceId > 0) {
    statusBarHeight = this.context.resources.getDimensionPixelSize(resourceId)
  }

  params.setMargins(
    this.resources.displayMetrics.widthPixels - (padding + buttonWidth),
    statusBarHeight + padding,
    padding + buttonWidth,
    0
  )

  button.layoutParams = params
  button.z = 99f

  button.background = ContextCompat.getDrawable(this.context, drawable)

  button.setOnClickListener {
    this.removeView(button)
    onClick.invoke()
  }

  this.addView(button)
  return button
}

fun String.filePathToBitmap(): Bitmap? {
  return BitmapFactory.decodeFile(this)
}

fun ReactActivity.removeFragment(fragment: Fragment?) {
  if (fragment == null) return
  this.supportFragmentManager
    .beginTransaction()
    .remove(fragment).commit()
}
