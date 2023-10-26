export class SelfieHelper {
  // implicit any is required here as there's no wrapper for the platform module
  // itself.

  constructor(platformModule) {
    this.platformModule = platformModule;
  }

  /**
   * Uploads the data captured from this module
   * @returns {Promise<boolean>} if validations are resulted success or not.
   *
   * **note:** depending on configuration this might return the status
   * of upload.
   */
  upload() {
    return this.platformModule.selfieUpload();
  }

  /**
   * Sets the type of the ID to capture.
   *
   * If you don't call this function before the start function,
   * it might cause crashes.
   * @param type should be supplied by Amani.
   * @returns {Promise<void>}
   */
  setType(type) {
    return this.platformModule.selfieSetType({
      type
    });
  }

  /**
   * You can use this function if you don't want to use the `Selfie` component.
   * @param side side of the id to capture.
   * @returns {Promise<string>} base64 encoded image of the id.
   */
  async start() {
    let imageData = await this.platformModule.selfieStart();
    return `data:image/jpeg;base64,${imageData}`;
  }
}
//# sourceMappingURL=selfie.js.map