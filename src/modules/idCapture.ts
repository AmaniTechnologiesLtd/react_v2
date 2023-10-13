import { Platform } from 'react-native';
import type { ValueOf } from '../utils/types';
import { WrongPlatformError } from '../utils';

export type IDSideType = {
  front: number;
  back: number;
};

/**
 * Enum variable to use with IDCaptureModule
 */
export const IDSide: IDSideType = {
  front: 0,
  back: 1,
};

export class IDCaptureHelper {
  // implicit any is required here as there's no wrapper for the platform module
  // itself.
  private platformModule: any;

  constructor(platfromModule: any) {
    this.platformModule = platfromModule;
  }

  /**
   * Uploads the data captured from this module
   * @returns {Promise<boolean>} if validations are resulted success or not.
   *
   * **note:** depending on configuration this might return the status
   * of upload.
   */
  public upload(): Promise<boolean> {
    return this.platformModule.idCaptureUpload();
  }

  /**
   * Captures the NFC data from the ID.
   *
   * **Note:** this function runs only on iOS 13.0 or later.
   * @platform iOS 13.0 later.
   * @throws {WrongPlatformError}
   * @returns {Promise<boolean>} if the capture is success or not.
   */
  public startNFCCaptureOnIOS(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      throw new WrongPlatformError('startNFCCaptureOnIOS()', 'iOS');
    }

    return this.platformModule.startNFCCaptureOnIOS();
  }

  /**
   * Sets the type of the ID to capture.
   *
   * If you don't call this function before the start function,
   * it might cause crashes.
   * @param type should be supplied by Amani.
   * @returns {Promise<void>}
   */
  public setType(type: string): Promise<void> {
    return this.platformModule.idCaptureSetType({ type });
  }

  /**
   * You can use this function if you don't want to use the `IDCapture` component.
   * @param side side of the id to capture.
   * @returns {Promise<string>} base64 encoded image of the id.
   */
  public async start(side: ValueOf<IDSideType>): Promise<string> {
    console.log(side);
    let imageData = await this.platformModule.idCaptureStart({ side });
    return `data:image/jpeg;base64,${imageData}`;
  }
}
