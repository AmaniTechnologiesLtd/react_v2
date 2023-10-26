import { type ViewProps } from 'react-native';
import type { FC } from 'react';
export type SelfieViewProps = {
    /**
     * Optional document type that supplied by Amani.
     * @default "XXX_SE_0"
     */
    type?: string;
    /**
     * Callback type that called when the capture completes.
     */
    onCaptureComplete: (imageBase64: string) => void;
} & ViewProps;
/**
 * Selfie capture component for capturing selfies.
 *
 * You can get the base64 encoded image from the onCaptureComplete
 * callback.
 */
export declare const Selfie: FC<SelfieViewProps>;
//# sourceMappingURL=selfie.d.ts.map