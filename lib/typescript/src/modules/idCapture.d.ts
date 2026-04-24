import type { NviModel, ValueOf } from '../utils/types';
export type IDSideType = {
    front: number;
    back: number;
};
/**
 * Enum variable to use with IDCaptureModule
 */
export declare const IDSide: IDSideType;
export declare class IDCaptureHelper {
    private platformModule;
    constructor(platfromModule: any);
    /**
     * Uploads the data captured from this module
     * @returns {Promise<boolean>} if validations are resulted success or not.
     *
     * **note:** depending on configuration this might return the status
     * of upload.
     */
    upload(): Promise<boolean>;
    /**
     * Captures the NFC data from the ID.
     *
     * **Note:** this function runs only on iOS 13.0 or later.
     * @platform iOS 13.0 later.
     * @throws {WrongPlatformError}
     * @returns {Promise<boolean>} if the capture is success or not.
     */
    startNFCCaptureOnIOS(nvi: NviModel): Promise<boolean>;
    /**
     * Starts the NFC capture process using raw data.
     * Internal MRZ check digits are calculated automatically.
     *
     * **Note:** this function runs only on iOS 13.0 or later.
     * @platform iOS 13.0 later.
     * @param docNo The ID's document number.
     * @param birthDate The ID holder's date of birth (YYMMDD).
     * @param expiryDate The ID's expiry date (YYMMDD).
     * @returns {Promise<boolean>} if the capture is success or not.
     */
    startNFCCaptureWithRawData(docNo: string, birthDate: string, expiryDate: string): Promise<boolean>;
    /**
     * Sets the idWithNFC flag on NFCCaptureModule
     *
     * **Note:** see the documentation for the full usage
     * @throws {WrongPlatformError}
     * @returns {Promise<void>}
     */
    setNFCCaptureFlagOnAndroid({ withNFC }: {
        withNFC: boolean;
    }): any;
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
     * You can use this function if you don't want to use the `IDCapture` component.
     * @param side side of the id to capture.
     * @returns {Promise<string>} base64 encoded image of the id.
     */
    start(side: ValueOf<IDSideType>): Promise<string>;
    /**
     * Gets the MRZ document ID from the backend.
     * This should be called after document upload.
     * @returns {Promise<string>} The document ID.
     */
    getMRZ(): Promise<string>;
}
//# sourceMappingURL=idCapture.d.ts.map