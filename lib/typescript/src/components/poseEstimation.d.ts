import type { FC } from 'react';
import type { NativeComponentViewProps } from '../utils/types';
import type { AndroidPoseEstimationSettings, IOSPoseEstimationSettings } from '../modules';
export type PoseEstimationViewProps = {
    iOSSettings: IOSPoseEstimationSettings;
    onCaptureComplete: (imageData: string) => void;
} & NativeComponentViewProps;
export type IOSPoseEstimationComponentSettings = {
    type?: string;
} & IOSPoseEstimationSettings;
export type AndroidPoseEstimationComponentSettings = {
    type?: string;
} & AndroidPoseEstimationSettings;
export declare const PoseEstimation: FC<PoseEstimationViewProps>;
//# sourceMappingURL=poseEstimation.d.ts.map