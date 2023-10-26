/**
 * Checks if the given token is valid customer token
 * @param {string} token JWT token to check.
 * @throws {JWTValidationError}
 * @returns {boolean} if token is a valid customer token
 */
export declare const isValidCustomerToken: (token: string) => boolean;
export declare const nativeComponentStyles: {
    container: {
        flex: number;
        width: string;
        height: string;
    };
};
export declare const Base64: {
    btoa: (input?: string) => string;
    atob: (input?: string) => string;
};
export declare const isPlatformVersionHigher: (majorVersion: number, minorVersion?: number) => boolean;
export declare const checkMethodIsCorrectPlatformVersion: (fnName: string, platform: string, majorVersion: number, minorVersion?: number) => boolean;
/**
 * A sugar syntatic promise helper util.
 * Much like Dart's **superiour** future completer class.
 */
export declare class Completer<T> {
    readonly promise: Promise<T>;
    complete: (value: PromiseLike<T> | T) => void;
    reject: (reason?: any) => void;
    constructor();
}
/**
 * Creates the android fragment. To be used in components
 * to send the create command in respective view manager
 * **NOTE** use in use effect without any dependencies
 * @platform android
 * @param {string} managerName name of the registered view manager
 * @param {number} viewId id of the react-native view.
 */
export declare const androidCreateFragment: (managerName: string, viewId: number) => void;
//# sourceMappingURL=utils.d.ts.map