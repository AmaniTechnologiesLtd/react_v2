import type { FC } from 'react';
import type { NativeComponentViewProps } from '../utils/types';
import type { AndroidAutoSelfieSettings, IOSAutoSelfieSettings } from '../modules';
export type AutoSelfieViewProps = {
    iOSSettings: IOSAutoSelfieComponentSettings;
    androidSettings: AndroidAutoSelfieComponentSettings;
    onCaptureComplete: (imageData: string) => void;
} & NativeComponentViewProps;
export type IOSAutoSelfieComponentSettings = {
    type?: string;
} & IOSAutoSelfieSettings;
export type AndroidAutoSelfieComponentSettings = {
    type?: string;
} & AndroidAutoSelfieSettings;
/**
 * AutoSelfie for capturing a selfie of the user.
 */
export declare const AutoSelfie: FC<AutoSelfieViewProps>;
//# sourceMappingURL=autoSelfie.d.ts.map