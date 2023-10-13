import type { NVIData } from './iosNfc';

export class AndroidNFC {
  private platformModule: any;

  constructor(platformModule: any) {
    this.platformModule = platformModule;
  }

  public startNFC(nviData: NVIData): Promise<boolean> {
    return this.platformModule.androidStartNFC({ ...nviData });
  }

  public stopNFCListener() {
    return this.platformModule.androidStopNFCListener();
  }

  public uploadNFC() {
    return this.platformModule.androidUploadNFC();
  }
}
