import { Completer, WrongPlatformError } from '../utils';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
export class AndroidNFC {
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
    if (Platform.OS === 'ios') {
      throw new WrongPlatformError('AndroidNFC.startNFC()', 'android');
    }
    let completer = new Completer();
    let nfcEvents = new NativeEventEmitter(NativeModules.AmaniSdk);
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
//# sourceMappingURL=androidNfc.js.map