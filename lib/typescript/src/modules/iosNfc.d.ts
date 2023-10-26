export interface NVIData {
    documentNo: string;
    dateOfBirth: string;
    dateOfExpire: string;
}
export declare class IOSNFC {
    private platformModule;
    constructor(platformModule: any);
    /**
     * Starts the NFC capture with image data of MRZ side.
     * @platform iOS 13.0 or later
     * @param imageData {string} base64 encoded image with MRZ
     */
    startWithImageData(imageData: string): any;
    /**
     * Starts the NFC capture with fıelds that can be found on ID
     * @platform iOS 13.0 or later
     * @param nviData {NVIData}
     */
    startWithNVIData(nviData: NVIData): any;
    /**
     * Starts the NFC capture with MRZ Capture
     * @platform iOS 13.0 or later
     */
    startWithMRZCapture(): any;
    /**
     * Uploads the captured data
     * @returns {Promise<boolean>} when upload is success and
     * validations are passed
     */
    upload(): Promise<boolean>;
    /**
     * Sets the type of the document.
     * @param type {string} supplied by Amani
     */
    setType(type: string): any;
}
//# sourceMappingURL=iosNfc.d.ts.map