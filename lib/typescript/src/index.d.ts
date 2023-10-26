import { IDCaptureHelper, SelfieHelper, AutoSelfieHelper, PoseEstimationHelper } from './modules';
import { AndroidNFC } from './modules/androidNfc';
import { IOSNFC } from './modules/iosNfc';
import { type DelegateEvents, type InitAmaniParams } from './utils/types';
export declare class AmaniSDK {
    private static _instance;
    private _isInitialized;
    private eventEmitter;
    private constructor();
    /** Singleton instance of the SDK. */
    static get sharedInstance(): AmaniSDK;
    private get platformModule();
    /**
     * Module class for ID Capture to handle things like
     * uploading the captured document as well as starting the capture process
     */
    get idCapture(): IDCaptureHelper;
    /**
     * Module class for Selfie to handle things like
     * uploading the captured document as well as starting the capture process
     */
    get selfie(): SelfieHelper;
    /**
     * Module class for Auto Selfie to handle things like
     * uploading the captured document as well as starting the capture process
     */
    get autoSelfie(): AutoSelfieHelper;
    /**
     * Module class for Pose Estimation Selfie to handle things like
     * uploading the captured document as well as starting the capture process
     */
    get poseEstimationSelfie(): PoseEstimationHelper;
    /**
     * Utility class to capturing NFC data in the ID and uploading the NFC data
     * as NFC Document for iOS.
     */
    get iOSNFCCapture(): IOSNFC;
    /**
     * Utility class to capturing NFC data in the ID and uploading the NFC data
     * as NFC Document for android.
     */
    get androidNFCCapture(): AndroidNFC;
    /**
     * Property to check before using any native components.
     *
     * You can also use this property to check if sdk is intialized
     * on anywhere in your app.
     *
     * Logs a warning message if SDK is not initalized.
     */
    get isInitialized(): boolean;
    /**
     * **Important**: Call this function before using any other function or
     * component of this project. You don't need to call this multiple times,
     * if isInitialized property of this class returns `true`
     * @param {InitAmaniParams} params parameters to initalize the SDK.
     * @throws {JWTValidationError} if jwt customer token is invalid or expired.
     */
    initAmani(params: InitAmaniParams): Promise<boolean>;
    /**
     * Call this function to hook up the event listeners with your provided
     * functions.
     * @param delegateEvents events to use
     * @returns a function that removes the subscriptions.
     */
    setDelegate(delegateEvents: DelegateEvents): () => void;
}
export * from './modules';
export * from './utils';
//# sourceMappingURL=index.d.ts.map