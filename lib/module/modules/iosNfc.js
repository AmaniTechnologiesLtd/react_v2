import { checkMethodIsCorrectPlatformVersion } from '../utils/utils';
export class IOSNFC {
  // implicit any is required here as there's no wrapper for the platform module
  // itself

  constructor(platformModule) {
    this.platformModule = platformModule;
  }

  /**
   * Starts the NFC capture with image data of MRZ side.
   * @platform iOS 13.0 or later
   * @param imageData {string} base64 encoded image with MRZ
   */
  startWithImageData(imageData) {
    if (!checkMethodIsCorrectPlatformVersion('startWithImageData()', 'ios', 13)) return;else return this.platformModule.startIOSNFCCaptureWithBase64Image(imageData);
  }

  /**
   * Starts the NFC capture with fıelds that can be found on ID
   * @platform iOS 13.0 or later
   * @param nviData {NVIData}
   */
  startWithNVIData(nviData) {
    if (!checkMethodIsCorrectPlatformVersion('startWithImageData()', 'ios', 13)) return;else return this.platformModule.startIOSNFCCaptureWithNVIModel(nviData);
  }

  /**
   * Starts the NFC capture with MRZ Capture
   * @platform iOS 13.0 or later
   */
  startWithMRZCapture() {
    if (!checkMethodIsCorrectPlatformVersion('startWithMRZCapture()', 'ios', 13)) return;else return this.platformModule.startIOSNFCCaptureWithMRZCapture();
  }

  /**
   * Uploads the captured data
   * @returns {Promise<boolean>} when upload is success and
   * validations are passed
   */
  upload() {
    return this.platformModule.IOSNFCCaptureUpload();
  }

  /**
   * Sets the type of the document.
   * @param type {string} supplied by Amani
   */
  setType(type) {
    return this.platformModule.IOSNFCCaptureSetType(type);
  }
}
//# sourceMappingURL=iosNfc.js.map