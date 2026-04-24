import { Platform } from 'react-native';
import { WrongPlatformError } from '../utils';
import { generateNviData } from '../utils/mrz';
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
  startNFCCaptureOnIOS(nvi) {
    if (Platform.OS !== 'ios') {
      throw new WrongPlatformError('startNFCCaptureOnIOS()', 'iOS');
    }
    console.log("startNFCCaptureOnIOS (SRC TS) called with:", nvi);
    return this.platformModule.idCaptureIOSStartNFC(nvi);
  }

  /**
   * Starts the NFC capture process using raw data.
   * Internal MRZ check digits are calculated automatically.
   *
   * **Note:** this function runs only on iOS 13.0 or later.
   * @platform iOS 13.0 later.
   * @param docNo The ID's document number.
   * @param birthDate The ID holder's date of birth (YYMMDD).
   * @param expiryDate The ID's expiry date (YYMMDD).
   * @returns {Promise<boolean>} if the capture is success or not.
   */
  startNFCCaptureWithRawData(docNo, birthDate, expiryDate) {
    const nvi = generateNviData(docNo, birthDate, expiryDate);
    return this.startNFCCaptureOnIOS(nvi);
  }

  /**
   * Sets the idWithNFC flag on NFCCaptureModule
   *
   * **Note:** see the documentation for the full usage
   * @throws {WrongPlatformError}
   * @returns {Promise<void>}
   */
  setNFCCaptureFlagOnAndroid({
    withNFC
  }) {
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
    // Fixed: Native module expects 'side' key, not 'stepId'
    let imageData = await this.platformModule.idCaptureStart({
      side: side
    });
    return `data:image/jpeg;base64,${imageData}`;
  }

  /**
   * Gets the MRZ document ID from the backend.
   * This should be called after document upload.
   * @returns {Promise<string>} The document ID.
   */
  getMRZ() {
    return this.platformModule.idCaptureGetMRZ();
  }
}
//# sourceMappingURL=idCapture.js.map