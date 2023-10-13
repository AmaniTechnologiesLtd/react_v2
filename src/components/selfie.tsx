import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  findNodeHandle,
  Platform,
  requireNativeComponent,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import type { FC } from 'react';
import type { NativeSyntheticEvent } from 'react-native';

import {
  androidCreateFragment,
  MissingPropertyError,
  nativeComponentStyles,
} from '../utils';

const REACT_CLASS = 'SelfieCaptureView';

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

type SelfieNativeViewProps = {
  type: string;
  onCaptureComplete: (
    event: NativeSyntheticEvent<{ imageBase64: string }>
  ) => void;
  style: ViewStyle;
};

const SelfieNativeComponent =
  requireNativeComponent<SelfieNativeViewProps>(REACT_CLASS);

/**
 * Selfie capture component for capturing selfies.
 *
 * You can get the base64 encoded image from the onCaptureComplete
 * callback.
 */
export const Selfie: FC<SelfieViewProps> = ({
  type,
  onCaptureComplete,
  ...props
}) => {
  if (!onCaptureComplete) {
    throw new MissingPropertyError('onCaptureComplete');
  }

  if (!type) {
    type = 'XXX_SE_0';
  }

  const [isCompleted, setCompleted] = useState<boolean>(false);
  const ref = useRef(null);
  const onCaptureCompleteCallback = useCallback(
    (event: NativeSyntheticEvent<{ imageBase64: string }>) => {
      setCompleted(true);
      onCaptureComplete(
        `data:image/jpeg;base64,${event.nativeEvent.imageBase64}`
      );
    },
    [onCaptureComplete]
  );

  useEffect(() => {
    if (Platform.OS === 'android' && ref.current) {
      const viewId = findNodeHandle(ref.current);
      androidCreateFragment(REACT_CLASS, viewId!);
    }
  }, []);

  return (
    <View style={nativeComponentStyles.container} {...props}>
      {!isCompleted ? (
        <SelfieNativeComponent
          ref={ref}
          type={type}
          onCaptureComplete={onCaptureCompleteCallback}
          style={nativeComponentStyles.container}
        />
      ) : (
        <></>
      )}
    </View>
  );
};
