import { NativeModules, Platform, NativeEventEmitter } from 'react-native';
import { isValidCustomerToken } from './utils';
import {
  IDCaptureHelper,
  SelfieHelper,
  AutoSelfieHelper,
  PoseEstimationHelper,
} from './modules';
import { AndroidNFC } from './modules/androidNfc';
import { IOSNFC } from './modules/iosNfc';
import { type DelegateEvents, type InitAmaniParams } from './utils/types';

const LINKING_ERROR =
  `The package 'react-native-amani-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const AmaniSdk = NativeModules.AmaniSdk
  ? NativeModules.AmaniSdk
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class AmaniSDK {
  private static _instance: AmaniSDK;
  private _isInitialized: boolean = false;
  private eventEmitter = new NativeEventEmitter(this.platformModule);

  // Locking constructor for singleton usage
  private constructor() {}

  /** Singleton instance of the SDK. */
  public static get sharedInstance() {
    return this._instance || (this._instance = new this());
  }

  private get platformModule() {
    return AmaniSdk;
  }

  /**
   * Module class for ID Capture to handle things like
   * uploading the captured document as well as starting the capture process
   */
  public get idCapture() {
    return new IDCaptureHelper(this.platformModule);
  }
  /**
   * Module class for Selfie to handle things like
   * uploading the captured document as well as starting the capture process
   */
  public get selfie() {
    return new SelfieHelper(this.platformModule);
  }

  /**
   * Module class for Auto Selfie to handle things like
   * uploading the captured document as well as starting the capture process
   */
  public get autoSelfie() {
    return new AutoSelfieHelper(this.platformModule);
  }
  /**
   * Module class for Pose Estimation Selfie to handle things like
   * uploading the captured document as well as starting the capture process
   */
  public get poseEstimationSelfie() {
    return new PoseEstimationHelper(this.platformModule);
  }

  /**
   * Utility class to capturing NFC data in the ID and uploading the NFC data
   * as NFC Document for iOS.
   */
  public get iOSNFCCapture() {
    return new IOSNFC(this.platformModule);
  }
  /**
   * Utility class to capturing NFC data in the ID and uploading the NFC data
   * as NFC Document for android.
   */
  public get androidNFCCapture() {
    return new AndroidNFC(this.platformModule);
  }

  /**
   * Property to check before using any native components.
   *
   * You can also use this property to check if sdk is intialized
   * on anywhere in your app.
   *
   * Logs a warning message if SDK is not initalized.
   */
  public get isInitialized() {
    if (this._isInitialized === false) {
      console.warn(
        "[AmaniSDK] The SDK isn't initialized." +
          'Use AmaniSDK.sharedInstance.initAmani before calling' +
          'any other function on your apps index.js file.'
      );
    }
    return this._isInitialized;
  }

  /**
   * **Important**: Call this function before using any other function or
   * component of this project. You don't need to call this multiple times,
   * if isInitialized property of this class returns `true`
   * @param {InitAmaniParams} params parameters to initalize the SDK.
   * @throws {JWTValidationError} if jwt customer token is invalid or expired.
   */
  public async initAmani(params: InitAmaniParams): Promise<boolean> {
    if (isValidCustomerToken(params.customerToken)) {
      return false;
    }

    let initSuccess = await this.platformModule.initAmani(params);
    this._isInitialized = initSuccess;
    return initSuccess;
  }

  /**
   * Call this function to hook up the event listeners with your provided
   * functions.
   * @param delegateEvents events to use
   * @returns a function that removes the subscriptions.
   */
  public setDelegate(delegateEvents: DelegateEvents) {
    let onErrorListener = this.eventEmitter.addListener(
      'onError',
      (params: { type: string; erorrs: Record<string, any> }) => {
        delegateEvents.onError(params.type, params.erorrs);
      }
    );

    let onProfileListener = this.eventEmitter.addListener(
      'profileStatus',
      (body) => {
        let parsedBody = JSON.parse(body);
        delegateEvents.onProfileStatus(parsedBody);
      }
    );

    let onStepResultListener = this.eventEmitter.addListener(
      'stepResult',
      (body) => {
        let parsedBody = JSON.parse(body);
        delegateEvents.onStepModel(parsedBody);
      }
    );

    return () => {
      this.eventEmitter.removeSubscription(onErrorListener);
      this.eventEmitter.removeSubscription(onProfileListener);
      this.eventEmitter.removeSubscription(onStepResultListener);
    };
  }
}

export * from './modules';
export * from './utils';
