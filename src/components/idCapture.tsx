import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  findNodeHandle,
  Platform,
  requireNativeComponent,
  View,
} from 'react-native';
import type { FC } from 'react';
import type { NativeSyntheticEvent, ViewProps } from 'react-native';

import {
  androidCreateFragment,
  MissingPropertyError,
  nativeComponentStyles,
} from '../utils';
import { IDSide, type IDSideType } from '../modules';
import type { ValueOf } from '../utils/types';

const REACT_CLASS = 'IDCaptureView';

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

type IDCaptureNativeProps = {
  settings: {
    type: string;
    side?: ValueOf<IDSideType>;
  };
  onCaptureComplete?: (
    event: NativeSyntheticEvent<{ imageBase64: string }>
  ) => void;
};

const IDCaptureNativeComponent =
  requireNativeComponent<IDCaptureNativeProps>(REACT_CLASS);

/**
 * IDCapture for capturing documents like passport,
 * national ID cards, and driver's licenses.
 */
export const IDCapture: FC<IDCaptureViewProps> = ({
  type,
  side,
  onCaptureComplete,
  ...props
}) => {
  if (!type) {
    throw new MissingPropertyError('type');
  }

  if (!onCaptureComplete) {
    throw new MissingPropertyError('onCaptureComplete');
  }
  // Set the default side.
  if (!side) {
    side = IDSide.front;
  }

  const ref = useRef(null);
  useEffect(() => {
    if (Platform.OS === 'android') {
      const viewId = findNodeHandle(ref.current);
      androidCreateFragment(REACT_CLASS, viewId!);
    }
  }, []);
  const [isCaptureCompleted, setCaptureCompleted] = useState(false);

  const onCaptureCompleteCallback = useCallback(
    (event: NativeSyntheticEvent<{ imageBase64: string }>) => {
      setCaptureCompleted(true);
      onCaptureComplete(event.nativeEvent.imageBase64);
    },
    [onCaptureComplete]
  );

  return (
    <View style={nativeComponentStyles.container} {...props}>
      {!isCaptureCompleted ? (
        <IDCaptureNativeComponent
          ref={ref}
          settings={{ side: side, type: type }}
          onCaptureComplete={onCaptureCompleteCallback}
          style={nativeComponentStyles.container}
          {...props}
        />
      ) : (
        <></>
      )}
    </View>
  );
};
