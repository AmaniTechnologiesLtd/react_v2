export interface IOSAutoSelfieSettings {
    faceIsOk: string;
    notInArea: string;
    faceTooSmall: string;
    faceTooBig: string;
    completed: string;
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
export declare class AutoSelfieHelper {
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
     * every selfie capture type does have a single type.
     *
     * @param type should be supplied by Amani.
     * @returns {Promise<void>}
     */
    setType(type: string): Promise<void>;
    /**
     * You can use this function if you don't want to use the `AutoSelfie` component.
     * @param {IOSAutoSelfieSettings} iosSettings
     * @param {AndroidAutoSelfieSettings} iosSettings
     * @returns {Promise<string>} base64 encoded image of the id.
     */
    start(iosSettings: IOSAutoSelfieSettings, androidSettings: AndroidAutoSelfieSettings): Promise<string>;
}
//# sourceMappingURL=autoSelfie.d.ts.map