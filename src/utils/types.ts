import type { ViewProps } from 'react-native';

/**
 * Utilty type for grouping optional variables.
 */
type AllOrNothing<T> = T | Partial<Record<keyof T, undefined>>;

export type ValueOf<T> = T[keyof T];

/**
 * parameters for initializing the SDK.
 *
 * Each field contains in line documentation.
 * @interface InitAmaniParams
 * @property {string} server
 * @property {string} customerToken
 * @property {string} idCardNumber
 * @property {boolean?} useLocation
 * @property {string?} birthDate
 * @property {string?} expireDate
 * @property {string?} documentNo
 * @property {string?} email
 * @property {string?} phone
 * @property {string?} name
 * @property {UploadSource?} uploadSource
 * @property {APIVersion?} apiVersion
 */

export type InitAmaniParams = {
  /** API base URL supplied by Amani */
  server: string;
  /** Customer token that created with POST /customer/ endpoint
   *
   *  **Note** Please do not attempt to create customer from your mobile app
   *  as it will be a huge security issue.
   */
  customerToken: string;

  /** Customer id card number that used with customer creation
   *
   * **Note:** This field must match with create customer endpoint.
   */
  idCardNumber: string;

  /** Sets if SDK must send location information when uploading documents */
  useLocation?: boolean;

  /** Optional two letter language code that sets up the user interface language */
  lang?: string;

  /** Optional API version to specify v1 or v2 API for the SDK
   * @default 'v2'
   */
  apiVersion?: 'v1' | 'v2';

  /** Upload source
   * @default {"KYC"}
   */
  uploadSource?: UploadSource;
} & AllOrNothing<{
  /**
   * Used for NFC Scanning
   *
   * This field must be in YYMMDD format. */
  birthDate: string;

  /**
   * Used for NFC Scanning
   *
   * This field must be in YYMMDD format. */
  expireDate: string;

  /**
   * Used for NFC Scanning
   *
   * If the ID's document number contains alphanumeric characters,
   *  must be uppercase
   * */
  documentNo: string;
}> &
  AllOrNothing<{
    /**
     * Extra email field to show up on studio
     */
    email: string;
    /**
     * Extra phone field to show up on studio
     */
    phone: string;
    /**
     * Extra name field to show up on studio
     */
    name: string;
  }>;

export type UploadSource = 'Kyc' | 'Video' | 'Password';

export type NativeComponentViewProps = Omit<ViewProps, 'style'>;

export type DelegateEvents = {
  onError: (type: String, body: Record<string, any>) => void;
  onProfileStatus: (body: Record<string, any>) => void;
  onStepModel: (body: Record<string, any>) => void;
};
