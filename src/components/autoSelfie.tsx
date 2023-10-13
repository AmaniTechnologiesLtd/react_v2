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

import {
  androidCreateFragment,
  MissingPropertyError,
  nativeComponentStyles,
} from '../utils';
import type { NativeComponentViewProps } from '../utils/types';

import type {
  AndroidAutoSelfieSettings,
  IOSAutoSelfieSettings,
} from '../modules';

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

type AutoSelfieNativeProps = {
  settings: IOSAutoSelfieComponentSettings | AndroidAutoSelfieComponentSettings;
  onCaptureComplete: (
    event: NativeSyntheticEvent<{ imageBase64: string }>
  ) => void;
  style: ViewStyle;
};

const REACT_CLASS = 'AutoSelfieView';

const AutoSelfieNativeComponent =
  requireNativeComponent<AutoSelfieNativeProps>(REACT_CLASS);

/**
 * AutoSelfie for capturing a selfie of the user.
 */
export const AutoSelfie: FC<AutoSelfieViewProps> = ({
  iOSSettings,
  androidSettings,
  onCaptureComplete,
  ...props
}) => {
  if (!iOSSettings && Platform.OS === 'ios') {
    throw new MissingPropertyError('iOSSettings');
  }

  if (!onCaptureComplete) {
    throw new MissingPropertyError('onCaptureComplete');
  }

  const ref = useRef(null);
  useEffect(() => {
    if (Platform.OS === 'android' && ref.current) {
      const viewId = findNodeHandle(ref.current);
      androidCreateFragment(REACT_CLASS, viewId!);
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

  let settings = Platform.OS === 'ios' ? iOSSettings : androidSettings;

  return (
    <View style={nativeComponentStyles.container} {...props}>
      {!isCaptureComplete ? (
        <AutoSelfieNativeComponent
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
