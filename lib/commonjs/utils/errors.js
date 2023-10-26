"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WrongPlatformError = exports.PlatformVersionError = exports.MissingPropertyError = exports.JWTValidationError = void 0;
/**
 * Error class if given token isn't valid or expired.
 */
class JWTValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'JWTError';
  }
}

/**
 * Error class if the required property null or undefined.
 */
exports.JWTValidationError = JWTValidationError;
class MissingPropertyError extends Error {
  constructor(propertyName) {
    super(`Property: ${propertyName} shouldn't be null or undefined`);
    this.name = 'MissingPropertyError';
  }
}

/**
 * Error class if a method called on a platform that doesn't support.
 */
exports.MissingPropertyError = MissingPropertyError;
class WrongPlatformError extends Error {
  constructor(fnName, platformName) {
    super(`${fnName} is for use in ${platformName} platform`);
    this.name = 'WrongPlatformError';
  }
}

/**
 *  Error class if method needs to be called on newer version of the platform
 */
exports.WrongPlatformError = WrongPlatformError;
class PlatformVersionError extends Error {
  constructor(platform, version, fnName) {
    super(`${fnName} is only available on ${platform} ${version} or newer`);
  }
}
exports.PlatformVersionError = PlatformVersionError;
//# sourceMappingURL=errors.js.map