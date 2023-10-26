function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
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
export const Selfie = _ref => {
  let {
    type,
    onCaptureComplete,
    ...props
  } = _ref;
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