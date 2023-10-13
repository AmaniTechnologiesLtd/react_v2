import { Platform } from 'react-native';
export interface IOSAutoSelfieSettings {
  // info messages
  faceIsOk: string;
  notInArea: string;
  faceTooSmall: string;
  faceTooBig: string;
  completed: string;
  // screen config
  appBackgroundColor: string;
  appFontColor: string;
  primaryButtonBackgroundColor: string;
  ovalBorderSuccessColor: string;
  ovalBorderColor: string;
  countTimer: string;
  manualCropTimeout: number;
}

export interface AndroidAutoSelfieSettings {
  textSize: number;
  counterVisible: boolean;
  counterTextSize: number;
  manualCaptureTimeout: number;
  distanceText: string;
  faceNotFoundText: string;
  stableText: string;
  restartText: string;
}

export class AutoSelfieHelper {
  // implicit any is required here as there's no wrapper for the platform module
  // itself.
  private platformModule: any;

  constructor(platformModule: any) {
    this.platformModule = platformModule;
  }

  /**
   * Uploads the data captured from this module
   * @returns {Promise<boolean>} if validations are resulted success or not.
   *
   * **note:** depending on configuration this might return the status
   * of upload.
   */
  public upload(): Promise<boolean> {
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
  public setType(type: string): Promise<void> {
    return this.platformModule.autoSelfieSetType({ type });
  }

  /**
   * You can use this function if you don't want to use the `AutoSelfie` component.
   * @param {IOSAutoSelfieSettings} iosSettings
   * @param {AndroidAutoSelfieSettings} iosSettings
   * @returns {Promise<string>} base64 encoded image of the id.
   */
  public start(
    iosSettings: IOSAutoSelfieSettings,
    androidSettings: AndroidAutoSelfieSettings
  ): Promise<string> {
    let settings = Platform.OS === 'ios' ? iosSettings : androidSettings;
    return this.platformModule.autoSelfieStart(settings);
  }
}
