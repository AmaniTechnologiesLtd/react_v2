"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PoseEstimationHelper = void 0;
var _reactNative = require("react-native");
var _utils = require("../utils");
class PoseEstimationHelper {
  // implicit and is required here as there's no wrapper for the platform module
  // itself.

  constructor(platformModule) {
    this.platformModule = platformModule;
  }

  /**
   * Uploads the data captured from this module
   * @returns {Promise<boolean>} if validations are resulted success or not.
   *
   * **note:** depending on configuration this might return the status
   * of upload.
   */
  upload() {
    return this.platformModule.poseEstimationUpload();
  }

  /**
   * Sets the type of the selfie.
   *
   * You don't need to call this function unless you're told by Amani since
   * every pose estimation capture type does have a single type for now.
   *
   * @param type should be supplied by Amani.
   * @returns {Promise<void>}
   */
  setType(type) {
    return this.platformModule.poseEstimationSetType({
      type
    });
  }

  /**
   * You can use this function if you don't want to use the `AutoSelfie` component.
   * @param {IOSPoseEstimationSettings} iosSettings
   * @param {AndroidPoseEstimationSettings} androidSettings
   * @param {(params: {reason: string, currentAttempt: number}) => void} androidOnFailure
   * @returns {Promise<string>} base64 encoded image of selfie.
   */
  async start(iosSettings, androidSettings, androidOnFailure) {
    if (_reactNative.Platform.OS === 'ios') {
      return this.platformModule.poseEstimationStart(iosSettings);
    } else {
      let completer = new _utils.Completer();
      let autoselfieEvents = new _reactNative.NativeEventEmitter(_reactNative.NativeModules.AmaniSdkV2);
      await this.platformModule.androidPoseEstimationStart(androidSettings);
      autoselfieEvents.addListener('androidPoseEstimation#onSuccess', _ref => {
        let {
          base64image
        } = _ref;
        completer.complete(base64image);
      });
      autoselfieEvents.addListener('androidPoseEstimation#onFailure', params => {
        if (androidOnFailure) {
          androidOnFailure(params);
        }
      });
      autoselfieEvents.addListener('androidPoseEstimation#onError', _ref2 => {
        let {
          message
        } = _ref2;
        completer.reject(message);
      });
      return completer.promise;
    }
  }
}
exports.PoseEstimationHelper = PoseEstimationHelper;
//# sourceMappingURL=poseEstimation.js.map