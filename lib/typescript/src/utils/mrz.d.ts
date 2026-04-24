/**
 * Utility for calculating MRZ (Machine Readable Zone) check digits.
 * Based on ICAO 9303 standard.
 */
/**
 * Calculates a check digit for a given string using the 7-3-1 weighting system.
 * @param input The string to calculate the check digit for (only A-Z, 0-9, and < are allowed)
 * @returns The calculated check digit as a string (0-9).
 */
export declare const calculateCheckDigit: (input: string) => string;
/**
 * Generates NVI (Network Verification Interface) data structure required by the SDK.
 * This includes internal MRZ check digits.
 */
export declare const generateNviData: (docNo: string, birthDate: string, expiryDate: string) => {
    documentNo: string;
    birthDate: string;
    expireDate: string;
    dateOfBirth: string;
    dateOfExpire: string;
    documentNoCD: string;
    birthDateCD: string;
    expireDateCD: string;
    dateOfBirthCD: string;
    dateOfExpireCD: string;
};
//# sourceMappingURL=mrz.d.ts.map