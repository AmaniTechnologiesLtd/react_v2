function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { findNodeHandle, Platform, requireNativeComponent, View } from 'react-native';
import { androidCreateFragment, isPlatformVersionHigher, MissingPropertyError, nativeComponentStyles, PlatformVersionError } from '../utils';
const REACT_CLASS = 'PoseEstimationView';
const PoseEstimationNativeComponent = requireNativeComponent(REACT_CLASS);
export const PoseEstimation = _ref => {
  let {
    iOSSettings,
    onCaptureComplete,
    ...props
  } = _ref;
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
  let settings = Platform.OS === 'ios' ? iOSSettings : iOSSettings;
  return /*#__PURE__*/React.createElement(View, _extends({
    style: nativeComponentStyles.container
  }, props), !isCaptureComplete ? /*#__PURE__*/React.createElement(PoseEstimationNativeComponent, {
    ref: ref,
    style: nativeComponentStyles.container,
    settings: settings,
    onCaptureComplete: onCaptureCompleteCallback
  }) : /*#__PURE__*/React.createElement(React.Fragment, null));
};
//# sourceMappingURL=poseEstimation.js.map