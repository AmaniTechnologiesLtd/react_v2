import { checkMethodIsCorrectPlatformVersion } from '../utils/utils';

export interface NVIData {
  /* If contains numbers must be in ALL CAPS */
  documentNo: string;
  /* Date of birth in YYMMDD format */
  dateOfBirth: string;
  /* Date of expire in YYMMDD format */
  dateOfExpire: string;
}

export class IOSNFC {
  // implicit any is required here as there's no wrapper for the platform module
  // itself
  private platformModule: any;

  constructor(platformModule: any) {
    this.platformModule = platformModule;
  }

  /**
   * Starts the NFC capture with image data of MRZ side.
   * @platform iOS 13.0 or later
   * @param imageData {string} base64 encoded image with MRZ
   */
  public startWithImageData(imageData: string) {
    if (!checkMethodIsCorrectPlatformVersion('startWithImageData()', 'ios', 13))
      return;
    else
      return this.platformModule.startIOSNFCCaptureWithBase64Image(imageData);
  }

  /**
   * Starts the NFC capture with fıelds that can be found on ID
   * @platform iOS 13.0 or later
   * @param nviData {NVIData}
   */
  public startWithNVIData(nviData: NVIData) {
    if (!checkMethodIsCorrectPlatformVersion('startWithImageData()', 'ios', 13))
      return;
    else return this.platformModule.startIOSNFCCaptureWithNVIModel(nviData);
  }

  /**
   * Starts the NFC capture with MRZ Capture
   * @platform iOS 13.0 or later
   */
  public startWithMRZCapture() {
    if (
      !checkMethodIsCorrectPlatformVersion('startWithMRZCapture()', 'ios', 13)
    )
      return;
    else return this.platformModule.startIOSNFCCaptureWithMRZCapture();
  }

  /**
   * Uploads the captured data
   * @returns {Promise<boolean>} when upload is success and
   * validations are passed
   */
  public upload(): Promise<boolean> {
    return this.platformModule.IOSNFCCaptureUpload();
  }

  /**
   * Sets the type of the document.
   * @param type {string} supplied by Amani
   */
  public setType(type: string) {
    return this.platformModule.IOSNFCCaptureSetType(type);
  }
}
