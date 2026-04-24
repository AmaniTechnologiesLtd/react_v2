function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { findNodeHandle, Platform, requireNativeComponent, View } from 'react-native';
import { androidCreateFragment, MissingPropertyError, nativeComponentStyles } from '../utils';
const REACT_CLASS = 'SelfieCaptureView';
const SelfieNativeComponent = requireNativeComponent(REACT_CLASS);

/**
 * Selfie capture component for capturing selfies.
 *
 * You can get the base64 encoded image from the onCaptureComplete
 * callback.
 */
export const Selfie = ({
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
  const [isCompleted, setCompleted] = useState(false);
  const ref = useRef(null);
  const onCaptureCompleteCallback = useCallback(event => {
    setCompleted(true);
    onCaptureComplete(`data:image/jpeg;base64,${event.nativeEvent.imageBase64}`);
  }, [onCaptureComplete]);
  useEffect(() => {
    if (Platform.OS === 'android' && ref.current) {
      const viewId = findNodeHandle(ref.current);
      androidCreateFragment(REACT_CLASS, viewId);
    }
  }, []);
  return /*#__PURE__*/React.createElement(View, _extends({
    style: nativeComponentStyles.container
  }, props), !isCompleted ? /*#__PURE__*/React.createElement(SelfieNativeComponent, {
    ref: ref,
    type: type,
    onCaptureComplete: onCaptureCompleteCallback,
    style: nativeComponentStyles.container
  }) : /*#__PURE__*/React.createElement(React.Fragment, null));
};
//# sourceMappingURL=selfie.js.map