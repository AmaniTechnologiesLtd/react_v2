import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  findNodeHandle,
  Platform,
  requireNativeComponent,
  View,
  type ViewStyle,
} from 'react-native';

import type { FC } from 'react';
import type { NativeSyntheticEvent } from 'react-native';
import type { NativeComponentViewProps } from '../utils/types';
import {
  androidCreateFragment,
  isPlatformVersionHigher,
  MissingPropertyError,
  nativeComponentStyles,
  PlatformVersionError,
} from '../utils';
import type {
  AndroidPoseEstimationSettings,
  IOSPoseEstimationSettings,
} from '../modules';

export type PoseEstimationViewProps = {
  iOSSettings: IOSPoseEstimationSettings;
  // androidSettings: AndroidPoseEstimationSettings;
  onCaptureComplete: (imageData: string) => void;
} & NativeComponentViewProps;

export type IOSPoseEstimationComponentSettings = {
  type?: string;
} & IOSPoseEstimationSettings;

export type AndroidPoseEstimationComponentSettings = {
  type?: string;
} & AndroidPoseEstimationSettings;

type PoseEstimationNativeProps = {
  settings:
    | IOSPoseEstimationComponentSettings
    | AndroidPoseEstimationComponentSettings;
  onCaptureComplete: (
    event: NativeSyntheticEvent<{ imageBase64: string }>
  ) => void;
  style: ViewStyle;
};
const REACT_CLASS = 'PoseEstimationView';
const PoseEstimationNativeComponent =
  requireNativeComponent<PoseEstimationNativeProps>(REACT_CLASS);

export const PoseEstimation: FC<PoseEstimationViewProps> = ({
  iOSSettings,
  onCaptureComplete,
  ...props
}) => {
  if (!iOSSettings && Platform.OS === 'ios') {
    throw new MissingPropertyError('iosSettings');
  }

  if (!onCaptureComplete) {
    throw new MissingPropertyError('onCaptureComplete');
  }

  if (Platform.OS === 'ios' && !isPlatformVersionHigher(12, 0)) {
    throw new PlatformVersionError('ios', '12.0', 'PoseEstimation');
  }

  const ref = useRef(null);
  useEffect(() => {
    if (Platform.OS === 'android' && ref.current) {
      const viewId = findNodeHandle(ref.current);
      androidCreateFragment(REACT_CLASS, viewId!!);
    }
  }, []);

  const [isCaptureComplete, setCaptureComplete] = useState<boolean>(false);
  // Extract the nativeEvent and hide the native component if capture is
  // completed

  const onCaptureCompleteCallback = useCallback(
    (event: NativeSyntheticEvent<{ imageBase64: string }>) => {
      setCaptureComplete(true);
      onCaptureComplete(event.nativeEvent.imageBase64);
    },
    [onCaptureComplete]
  );

  let settings = Platform.OS === 'ios' ? iOSSettings : iOSSettings;

  return (
    <View style={nativeComponentStyles.container} {...props}>
      {!isCaptureComplete ? (
        <PoseEstimationNativeComponent
          ref={ref}
          style={nativeComponentStyles.container}
          settings={settings}
          onCaptureComplete={onCaptureCompleteCallback}
        />
      ) : (
        <></>
      )}
    </View>
  );
};
