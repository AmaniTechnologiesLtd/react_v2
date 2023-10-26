function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { findNodeHandle, Platform, requireNativeComponent, View } from 'react-native';
import { androidCreateFragment, MissingPropertyError, nativeComponentStyles } from '../utils';
import { IDSide } from '../modules';
const REACT_CLASS = 'IDCaptureView';
const IDCaptureNativeComponent = requireNativeComponent(REACT_CLASS);

/**
 * IDCapture for capturing documents like passport,
 * national ID cards, and driver's licenses.
 */
export const IDCapture = _ref => {
  let {
    type,
    side,
    onCaptureComplete,
    ...props
  } = _ref;
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
      androidCreateFragment(REACT_CLASS, viewId);
    }
  }, []);
  const [isCaptureCompleted, setCaptureCompleted] = useState(false);
  const onCaptureCompleteCallback = useCallback(event => {
    setCaptureCompleted(true);
    onCaptureComplete(event.nativeEvent.imageBase64);
  }, [onCaptureComplete]);
  return /*#__PURE__*/React.createElement(View, _extends({
    style: nativeComponentStyles.container
  }, props), !isCaptureCompleted ? /*#__PURE__*/React.createElement(IDCaptureNativeComponent, _extends({
    ref: ref,
    settings: {
      side: side,
      type: type
    },
    onCaptureComplete: onCaptureCompleteCallback,
    style: nativeComponentStyles.container
  }, props)) : /*#__PURE__*/React.createElement(React.Fragment, null));
};
//# sourceMappingURL=idCapture.js.map