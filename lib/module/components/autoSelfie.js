function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { findNodeHandle, Platform, requireNativeComponent, View } from 'react-native';
import { androidCreateFragment, MissingPropertyError, nativeComponentStyles } from '../utils';
const REACT_CLASS = 'AutoSelfieView';
const AutoSelfieNativeComponent = requireNativeComponent(REACT_CLASS);

/**
 * AutoSelfie for capturing a selfie of the user.
 */
export const AutoSelfie = _ref => {
  let {
    iOSSettings,
    androidSettings,
    onCaptureComplete,
    ...props
  } = _ref;
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
      androidCreateFragment(REACT_CLASS, viewId);
    }
  }, []);
  const [isCaptureComplete, setCaptureComplete] = useState(false);
  // Extract the nativeEvent and hide the native component if capture is
  // completed
  const onCaptureCompleteCallback = useCallback(event => {
    setCaptureComplete(true);
    onCaptureComplete(event.nativeEvent.imageBase64);
  }, [onCaptureComplete]);
  let settings = Platform.OS === 'ios' ? iOSSettings : androidSettings;
  return /*#__PURE__*/React.createElement(View, _extends({
    style: nativeComponentStyles.container
  }, props), !isCaptureComplete ? /*#__PURE__*/React.createElement(AutoSelfieNativeComponent, {
    style: nativeComponentStyles.container,
    settings: settings,
    onCaptureComplete: onCaptureCompleteCallback
  }) : /*#__PURE__*/React.createElement(React.Fragment, null));
};
//# sourceMappingURL=autoSelfie.js.map