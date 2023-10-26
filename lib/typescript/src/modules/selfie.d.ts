export declare class SelfieHelper {
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
     * Sets the type of the ID to capture.
     *
     * If you don't call this function before the start function,
     * it might cause crashes.
     * @param type should be supplied by Amani.
     * @returns {Promise<void>}
     */
    setType(type: string): Promise<void>;
    /**
     * You can use this function if you don't want to use the `Selfie` component.
     * @param side side of the id to capture.
     * @returns {Promise<string>} base64 encoded image of the id.
     */
    start(): Promise<string>;
}
//# sourceMappingURL=selfie.d.ts.map