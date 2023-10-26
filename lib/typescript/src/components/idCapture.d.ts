import type { FC } from 'react';
import type { ViewProps } from 'react-native';
import { type IDSideType } from '../modules';
import type { ValueOf } from '../utils/types';
export type IDCaptureViewProps = {
    /** Document type supplied from Amani */
    type: string;
    /**
     * @defaults {IDSide.front}
     *
     * **note:** if you want to scan passports with this it should remain as front.
     */
    side?: ValueOf<IDSideType>;
    /** imageBase64 is the base64 encoded image data */
    onCaptureComplete: (imageBase64: string) => void;
} & ViewProps;
/**
 * IDCapture for capturing documents like passport,
 * national ID cards, and driver's licenses.
 */
export declare const IDCapture: FC<IDCaptureViewProps>;
//# sourceMappingURL=idCapture.d.ts.map