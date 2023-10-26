"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AndroidNFC = void 0;
var _utils = require("../utils");
var _reactNative = require("react-native");
class AndroidNFC {
  constructor(platformModule) {
    this.platformModule = platformModule;
  }

  /**
   *
   * @param nviData optional NVI Data field if not starting from id capture flow
   * **NOTE** After capturing call `stopNFCListener()` to stop the NFC capture
   * @see stopNFCListener for details
   * @throws {WrongPlatformError}
   * @returns {Promise<boolean>} capture success or not
   */
  async startNFC(nviData) {
    if (_reactNative.Platform.OS === 'ios') {
      throw new _utils.WrongPlatformError('AndroidNFC.startNFC()', 'android');
    }
    let completer = new _utils.Completer();
    let nfcEvents = new _reactNative.NativeEventEmitter(_reactNative.NativeModules.AmaniSdk);
    await this.platformModule.androidStartNFC({
      ...nviData
    });
    nfcEvents.addListener('android#onNFCComplete', _ref => {
      let {
        status
      } = _ref;
      completer.complete(status);
    });
    nfcEvents.addListener('android#onNFCError', _ref2 => {
      let {
        error
      } = _ref2;
      completer.reject(error);
    });
    return completer.promise;
  }

  /**
   * This method stops the NFC listener that has recently started.
   * It is required to call this method after the capture process is
   * completed.
   * @returns
   */
  stopNFCListener() {
    return this.platformModule.androidDisableNFC();
  }
  uploadNFC() {
    return this.platformModule.androidUploadNFC();
  }
}
exports.AndroidNFC = AndroidNFC;
//# sourceMappingURL=androidNfc.js.map