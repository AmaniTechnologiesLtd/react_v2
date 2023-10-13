package com.amanisdk.models

import com.amanisdk.extensions.JSONConvertible
import kotlinx.parcelize.Parcelize

@Parcelize
class PoseEstimationSettings(
  val poseCount: Int,
  val animationDuration: Int,
  val faceNotInside: String,
  val faceNotStraight: String,
  val faceIsTooFar: String,
  val keepStraight: String,
  val alertTitle: String,
  val alertDescription: String,
  val alertTryAgain: String
): JSONConvertible
