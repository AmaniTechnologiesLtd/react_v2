export class DocumentCaptureHelper {
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
      return this.platformModule.documentCaptureUpload();
    }
  
    /**
     * Sets the type of the Document Capture
     *
     * If you don't call this function before the start function,
     * it might cause crashes.
     * @param type should be supplied by Amani.
     * @returns {Promise<void>}
     */
    public setType(type: string): Promise<void> {
      return this.platformModule.documentCaptureSetType({ type });
    }

  /**
   * You can use this function if you don't want to use the `IDCapture` component.
   * @param side side of the id to capture.
   * @returns {Promise<string>} base64 encoded image of the id.
   */
  public async start(): Promise<string> {
    let imageData = await this.platformModule.documentCaptureStart({ documentCount: 1 });
    return `data:image/jpeg;base64,${imageData}`;
  }  
}