function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { findNodeHandle, Platform, requireNativeComponent, View } from 'react-native';
import { androidCreateFragment, isPlatformVersionHigher, MissingPropertyError, nativeComponentStyles, PlatformVersionError } from '../utils';
const REACT_CLASS = 'PoseEstimationView';
const PoseEstimationNativeComponent = requireNativeComponent(REACT_CLASS);
export const PoseEstimation = ({
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