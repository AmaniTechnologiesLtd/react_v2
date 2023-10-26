import { Platform } from 'react-native';
import { WrongPlatformError } from '../utils';
/**
 * Enum variable to use with IDCaptureModule
 */
export const IDSide = {
  front: 0,
  back: 1
};
export class IDCaptureHelper {
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
    if (Platform.OS !== 'ios') {
      throw new WrongPlatformError('startNFCCaptureOnIOS()', 'iOS');
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
    if (Platform.OS !== 'android') {
      throw new WrongPlatformError('setNFCCaptureFlagOnAndroid', 'android');
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
//# sourceMappingURL=idCapture.js.map