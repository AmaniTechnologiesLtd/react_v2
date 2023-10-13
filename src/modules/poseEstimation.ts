import { Platform, NativeEventEmitter, NativeModules } from 'react-native';
import { Completer } from '../utils';

export interface IOSPoseEstimationSettings {
  // info messages
  faceIsOk: string;
  notInArea: string;
  faceTooSmall: string;
  faceTooBig: string;
  completed: string;
  turnRight: string;
  turnLeft: string;
  turnUp: string;
  turnDown: string;
  lookStraight: string;
  errorMessage: string;
  tryAgain: string;
  errorTitle: string;
  confirm: string;
  next: string;
  phonePitch: string;
  informationScreenDesc1: string;
  informationScreenDesc2: string;
  informationScreenTitle: string;
  wrongPose: string;
  descriptionHeader: string;
  // screen config
  appBackgroundColor: string;
  appFontColor: string;
  primaryButtonBackgroundColor: string;
  primaryButtonTextColor: string;
  ovalBorderColor: string;
  ovalBorderSuccessColor: string;
  poseCount: string;
  showOnlyArrow: string;
  buttonRadious: string;

  manualCropTimeout: number;
}

export interface AndroidPoseEstimationSettings {
  poseCount: number;
  animationDuration: number;
  faceNotInside: string;
  faceNotStraight: string;
  faceIsTooFar: string;
  keepStraight: string;
  alertTitle: string;
  alertDescription: string;
  alertTryAgain: string;
}

export class PoseEstimationHelper {
  // implicit and is required here as there's no wrapper for the platform module
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
  public setType(type: string): Promise<void> {
    return this.platformModule.poseEstimationSetType({ type });
  }

  /**
   * You can use this function if you don't want to use the `AutoSelfie` component.
   * @param {IOSPoseEstimationSettings} iosSettings
   * @param {AndroidPoseEstimationSettings} androidSettings
   * @param {(params: {reason: string, currentAttempt: number}) => void} androidOnFailure
   * @returns {Promise<string>} base64 encoded image of selfie.
   */
  public async start(
    iosSettings: IOSPoseEstimationSettings,
    androidSettings: AndroidPoseEstimationSettings,
    androidOnFailure?: ({
      reason,
      currentAttempt,
    }: {
      reason: string;
      currentAttempt: number;
    }) => void
  ): Promise<string> {
    if (Platform.OS === 'ios') {
      return this.platformModule.poseEstimationStart(iosSettings);
    } else {
      let completer = new Completer<string>();
      let autoselfieEvents = new NativeEventEmitter(NativeModules.AmaniSdkV2);
      await this.platformModule.androidPoseEstimationStart(androidSettings);
      autoselfieEvents.addListener(
        'androidPoseEstimation#onSuccess',
        ({ base64image }: { base64image: string }) => {
          completer.complete(base64image);
        }
      );

      autoselfieEvents.addListener(
        'androidPoseEstimation#onFailure',
        (params: { reason: string; currentAttempt: number }) => {
          if (androidOnFailure) {
            androidOnFailure(params);
          }
        }
      );

      autoselfieEvents.addListener(
        'androidPoseEstimation#onError',
        ({ message }: { message: string }) => {
          completer.reject(message);
        }
      );

      return completer.promise;
    }
  }
}
