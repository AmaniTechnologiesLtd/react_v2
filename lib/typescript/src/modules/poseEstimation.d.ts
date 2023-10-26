export interface IOSPoseEstimationSettings {
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
export declare class PoseEstimationHelper {
    private platformModule;
    constructor(platformModule: any);
    /**
     * Uploads the data captured from this module
     * @returns {Promise<boolean>} if validations are resulted success or not.
     *
     * **note:** depending on configuration this might return the status
     * of upload.
     */
    upload(): Promise<boolean>;
    /**
     * Sets the type of the selfie.
     *
     * You don't need to call this function unless you're told by Amani since
     * every pose estimation capture type does have a single type for now.
     *
     * @param type should be supplied by Amani.
     * @returns {Promise<void>}
     */
    setType(type: string): Promise<void>;
    /**
     * You can use this function if you don't want to use the `AutoSelfie` component.
     * @param {IOSPoseEstimationSettings} iosSettings
     * @param {AndroidPoseEstimationSettings} androidSettings
     * @param {(params: {reason: string, currentAttempt: number}) => void} androidOnFailure
     * @returns {Promise<string>} base64 encoded image of selfie.
     */
    start(iosSettings: IOSPoseEstimationSettings, androidSettings: AndroidPoseEstimationSettings, androidOnFailure?: ({ reason, currentAttempt, }: {
        reason: string;
        currentAttempt: number;
    }) => void): Promise<string>;
}
//# sourceMappingURL=poseEstimation.d.ts.map