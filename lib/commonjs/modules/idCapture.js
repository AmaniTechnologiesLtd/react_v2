"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IDSide = exports.IDCaptureHelper = void 0;
var _reactNative = require("react-native");
var _utils = require("../utils");
/**
 * Enum variable to use with IDCaptureModule
 */
const IDSide = {
  front: 0,
  back: 1
};
exports.IDSide = IDSide;
class IDCaptureHelper {
  // implicit any is required here as there's no wrapper for the platform module
  // itself.

  constructor(platfromModule) {
    this.platformModule = platfromModule;
  }

  /**
   * Uploads the data captured from this module
   * @returns {Promise<boolean>} if validations are resulted success or not.
   *
   * **note:** depending on configuration this might return the status
   * of upload.
   */
  upload() {
    return this.platformModule.idCaptureUpload();
  }

  /**
   * Captures the NFC data from the ID.
   *
   * **Note:** this function runs only on iOS 13.0 or later.
   * @platform iOS 13.0 later.
   * @throws {WrongPlatformError}
   * @returns {Promise<boolean>} if the capture is success or not.
   */
  startNFCCaptureOnIOS() {
    if (_reactNative.Platform.OS !== 'ios') {
      throw new _utils.WrongPlatformError('startNFCCaptureOnIOS()', 'iOS');
    }
    return this.platformModule.startNFCCaptureOnIOS();
  }

  /**
   * Sets the idWithNFC flag on NFCCaptureModule
   *
   * **Note:** see the documentation for the full usage
   * @throws {WrongPlatformError}
   * @returns {Promise<void>}
   */
  setNFCCaptureFlagOnAndroid(_ref) {
    let {
      withNFC
    } = _ref;
    if (_reactNative.Platform.OS !== 'android') {
      throw new _utils.WrongPlatformError('setNFCCaptureFlagOnAndroid', 'android');
    }
    return this.platformModule.idCaptureSetWithNFC({
      withNFC
    });
  }

  /**
   * Sets the type of the ID to capture.
   *
   * If you don't call this function before the start function,
   * it might cause crashes.
   * @param type should be supplied by Amani.
   * @returns {Promise<void>}
   */
  setType(type) {
    return this.platformModule.idCaptureSetType({
      type
    });
  }

  /**
   * You can use this function if you don't want to use the `IDCapture` component.
   * @param side side of the id to capture.
   * @returns {Promise<string>} base64 encoded image of the id.
   */
  async start(side) {
    console.log(side);
    let imageData = await this.platformModule.idCaptureStart({
      side
    });
    return `data:image/jpeg;base64,${imageData}`;
  }
}
exports.IDCaptureHelper = IDCaptureHelper;
//# sourceMappingURL=idCapture.js.map