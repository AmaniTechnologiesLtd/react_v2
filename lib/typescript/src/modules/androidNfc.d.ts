import type { NVIData } from './iosNfc';
export declare class AndroidNFC {
    private platformModule;
    constructor(platformModule: any);
    /**
     *
     * @param nviData optional NVI Data field if not starting from id capture flow
     * **NOTE** After capturing call `stopNFCListener()` to stop the NFC capture
     * @see stopNFCListener for details
     * @throws {WrongPlatformError}
     * @returns {Promise<boolean>} capture success or not
     */
    startNFC(nviData?: NVIData): Promise<boolean>;
    /**
     * This method stops the NFC listener that has recently started.
     * It is required to call this method after the capture process is
     * completed.
     * @returns
     */
    stopNFCListener(): any;
    uploadNFC(): any;
}
//# sourceMappingURL=androidNfc.d.ts.map