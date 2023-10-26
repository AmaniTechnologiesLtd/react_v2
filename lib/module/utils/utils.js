/* eslint-disable no-bitwise */
import { Platform, StyleSheet, UIManager } from 'react-native';
import { AmaniSDK } from '../';
import { JWTValidationError, PlatformVersionError, WrongPlatformError } from './errors';
/**
 * Checks if the given token is valid customer token
 * @param {string} token JWT token to check.
 * @throws {JWTValidationError}
 * @returns {boolean} if token is a valid customer token
 */

export const isValidCustomerToken = token => {
  if (token === '') {
    throw new JWTValidationError('Token cannot be an empty string.');
  }
  if (!token.includes('.')) {
    throw new JWTValidationError('Token must be a valid JWT token.');
  }
  let tokenPayloadstring = Base64.atob(token.split('.')[1]);
  let tokenPayloadJSON = JSON.parse(tokenPayloadstring);
  if (Date.now() >= Number(tokenPayloadJSON.exp) * 1000) {
    console.error('[AmaniSDK] Token Expired');
    return true;
  }
  if (!tokenPayloadJSON.customer_id && !tokenPayloadJSON.profile_id) {
    console.error("[AmaniSDK] You can't use this token with this SDK.");
    return true;
  }
  return false;
};
export const nativeComponentStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%'
  }
});
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
export const Base64 = {
  btoa: function () {
    let input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    let str = input;
    let output = '';
    for (let block = 0, charCode, i = 0, map = chars; str.charAt(i | 0) || (map = '=', i % 1); output += map.charAt(63 & block >> 8 - i % 1 * 8)) {
      charCode = str.charCodeAt(i += 3 / 4);
      if (charCode > 0xff) {
        throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      }
      block = block << 8 | charCode;
    }
    return output;
  },
  atob: function () {
    let input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    // eslint-disable-next-line no-div-regex
    let str = input.replace(/=+$/, '');
    let output = '';
    if (str.length % 4 === 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (let bc = 0, bs = 0, buffer, i = 0; buffer = str.charAt(i++); ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
      buffer = chars.indexOf(buffer);
    }
    return output;
  }
};
export const isPlatformVersionHigher = function (majorVersion) {
  let minorVersion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // On android Platform is API number
  if (typeof Platform.Version === 'number' && Platform.OS === 'android') {
    return Platform.Version >= majorVersion;
  }
  if (Platform.OS === 'ios') {
    const [major, minor] = Platform.Version.split('.').map(c => parseInt(c, 10));
    if (!major || !minor) {
      return false;
    }
    return majorVersion >= major && minorVersion >= minor;
  }
  return false;
};
export const checkMethodIsCorrectPlatformVersion = function (fnName, platform, majorVersion) {
  let minorVersion = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  if (Platform.OS === platform) {
    throw new WrongPlatformError(fnName, platform);
  }
  if (!isPlatformVersionHigher(majorVersion, minorVersion)) {
    throw new PlatformVersionError(platform, majorVersion.toString(), fnName);
  }
  return true;
};

/**
 * A sugar syntatic promise helper util.
 * Much like Dart's **superiour** future completer class.
 */
export class Completer {
  // assigned in promise callback
  // @ts-ignore
  // assigned in promise callback
  // @ts-ignore
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.complete = resolve;
      this.reject = reject;
    });
  }
}

/**
 * Creates the android fragment. To be used in components
 * to send the create command in respective view manager
 * **NOTE** use in use effect without any dependencies
 * @platform android
 * @param {string} managerName name of the registered view manager
 * @param {number} viewId id of the react-native view.
 */
export const androidCreateFragment = (managerName, viewId) => {
  if (AmaniSDK.sharedInstance.isInitialized) {
    console.log('android create fragment for', managerName, 'viewID', viewId);
    // @ts-expect-error
    console.log(UIManager[managerName].Commands);
    UIManager.dispatchViewManagerCommand(viewId,
    // @ts-ignore
    UIManager[managerName].Commands.create.tostring(), [viewId]);
  }
};
//# sourceMappingURL=utils.js.map