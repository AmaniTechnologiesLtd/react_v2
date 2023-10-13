/**
 * Error class if given token isn't valid or expired.
 */
export class JWTValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JWTError';
  }
}

/**
 * Error class if the required property null or undefined.
 */
export class MissingPropertyError extends Error {
  constructor(propertyName: string) {
    super(`Property: ${propertyName} shouldn't be null or undefined`);
    this.name = 'MissingPropertyError';
  }
}

/**
 * Error class if a method called on a platform that doesn't support.
 */
export class WrongPlatformError extends Error {
  constructor(fnName: string, platformName: string) {
    super(`${fnName} is for use in ${platformName} platform`);
    this.name = 'WrongPlatformError';
  }
}

/**
 *  Error class if method needs to be called on newer version of the platform
 */
export class PlatformVersionError extends Error {
  constructor(platform: string, version: string, fnName: string) {
    super(`${fnName} is only available on ${platform} ${version} or newer`);
  }
}
