"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AutoSelfieHelper = void 0;
var _reactNative = require("react-native");
class AutoSelfieHelper {
  // implicit any is required here as there's no wrapper for the platform module
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
    return this.platformModule.autoSelfieUpload();
  }

  /**
   * Sets the type of the selfie.
   *
   * You don't need to call this function unless you're told by Amani since
   * every selfie capture type does have a single type.
   *
   * @param type should be supplied by Amani.
   * @returns {Promise<void>}
   */
  setType(type) {
    return this.platformModule.autoSelfieSetType({
      type
    });
  }

  /**
   * You can use this function if you don't want to use the `AutoSelfie` component.
   * @param {IOSAutoSelfieSettings} iosSettings
   * @param {AndroidAutoSelfieSettings} iosSettings
   * @returns {Promise<string>} base64 encoded image of the id.
   */
  start(iosSettings, androidSettings) {
    let settings = _reactNative.Platform.OS === 'ios' ? iosSettings : androidSettings;
    return this.platformModule.autoSelfieStart(settings);
  }
}
exports.AutoSelfieHelper = AutoSelfieHelper;
//# sourceMappingURL=autoSelfie.js.map