/**
 * Utility for calculating MRZ (Machine Readable Zone) check digits.
 * Based on ICAO 9303 standard.
 */

/**
 * Calculates a check digit for a given string using the 7-3-1 weighting system.
 * @param input The string to calculate the check digit for (only A-Z, 0-9, and < are allowed)
 * @returns The calculated check digit as a string (0-9).
 */
export const calculateCheckDigit = (input: string): string => {
    const weights = [7, 3, 1];
    let sum = 0;
    const upperInput = input.toUpperCase();

    for (let i = 0; i < upperInput.length; i++) {
        const char = upperInput[i];
        let value = 0;

        if (char >= '0' && char <= '9') {
            value = char.charCodeAt(0) - '0'.charCodeAt(0);
        } else if (char >= 'A' && char <= 'Z') {
            value = char.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
        } else if (char === '<') {
            value = 0;
        }

        sum += value * weights[i % 3];
    }

    return (sum % 10).toString();
};

/**
 * Generates NVI (Network Verification Interface) data structure required by the SDK.
 * This includes internal MRZ check digits.
 */
export const generateNviData = (docNo: string, birthDate: string, expiryDate: string) => {
    // 1. Format Document Number (9 chars, upper, padded with <)
    let formattedDocNo = docNo.toUpperCase().replace(/\s/g, '');
    while (formattedDocNo.length < 9) {
        formattedDocNo += '<';
    }
    formattedDocNo = formattedDocNo.substring(0, 9);

    // 2. Calculate Check Digits
    const docNoCD = calculateCheckDigit(formattedDocNo);
    const birthCD = calculateCheckDigit(birthDate);
    const expiryCD = calculateCheckDigit(expiryDate);

    // 3. Construct NviModel compatible object
    return {
        documentNo: formattedDocNo.replace(/</g, ''),
        birthDate: birthDate,
        expireDate: expiryDate,
        dateOfBirth: birthDate,
        dateOfExpire: expiryDate,

        // Check Digits (CD) are required by native iOS modules
        documentNoCD: docNoCD,
        birthDateCD: birthCD,
        expireDateCD: expiryCD,
        dateOfBirthCD: birthCD,
        dateOfExpireCD: expiryCD,
    };
};
