import { Completer, WrongPlatformError } from '../utils';
import type { NVIData } from './iosNfc';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
export class AndroidNFC {
  private platformModule: any;

  constructor(platformModule: any) {
    this.platformModule = platformModule;
  }

  /**
   *
   * @param nviData optional NVI Data field if not starting from id capture flow
   * **NOTE** After capturing call `stopNFCListener()` to stop the NFC capture
   * @see stopNFCListener for details
   * @throws {WrongPlatformError}
   * @returns {Promise<boolean>} capture success or not
   */
  public async startNFC(nviData?: NVIData): Promise<boolean> {
    if (Platform.OS === 'ios') {
      throw new WrongPlatformError('AndroidNFC.startNFC()', 'android');
    }
    let completer = new Completer<boolean>();
    let nfcEvents = new NativeEventEmitter(NativeModules.AmaniSdk);
    await this.platformModule.androidStartNFC({ ...nviData });
    nfcEvents.addListener(
      'android#onNFCComplete',
      ({ status }: { status: boolean }) => {
        completer.complete(status);
      }
    );

    nfcEvents.addListener(
      'android#onNFCError',
      ({ error }: { error: String }) => {
        completer.reject(error);
      }
    );

    return completer.promise;
  }

  /**
   * This method stops the NFC listener that has recently started.
   * It is required to call this method after the capture process is
   * completed.
   * @returns
   */
  public stopNFCListener() {
    return this.platformModule.androidDisableNFC();
  }

  public uploadNFC() {
    return this.platformModule.androidUploadNFC();
  }
}
