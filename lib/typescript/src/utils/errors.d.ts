/**
 * Error class if given token isn't valid or expired.
 */
export declare class JWTValidationError extends Error {
    constructor(message: string);
}
/**
 * Error class if the required property null or undefined.
 */
export declare class MissingPropertyError extends Error {
    constructor(propertyName: string);
}
/**
 * Error class if a method called on a platform that doesn't support.
 */
export declare class WrongPlatformError extends Error {
    constructor(fnName: string, platformName: string);
}
/**
 *  Error class if method needs to be called on newer version of the platform
 */
export declare class PlatformVersionError extends Error {
    constructor(platform: string, version: string, fnName: string);
}
//# sourceMappingURL=errors.d.ts.map