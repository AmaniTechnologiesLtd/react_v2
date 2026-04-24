"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PoseEstimation = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _utils = require("../utils");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const REACT_CLASS = 'PoseEstimationView';
const PoseEstimationNativeComponent = (0, _reactNative.requireNativeComponent)(REACT_CLASS);
const PoseEstimation = ({
  iOSSettings,
  onCaptureComplete,
  ...props
}) => {
  if (!iOSSettings && _reactNative.Platform.OS === 'ios') {
    throw new _utils.MissingPropertyError('iosSettings');
  }
  if (!onCaptureComplete) {
    throw new _utils.MissingPropertyError('onCaptureComplete');
  }
  if (_reactNative.Platform.OS === 'ios' && !(0, _utils.isPlatformVersionHigher)(12, 0)) {
    throw new _utils.PlatformVersionError('ios', '12.0', 'PoseEstimation');
  }
  const ref = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    if (_reactNative.Platform.OS === 'android' && ref.current) {
      const viewId = (0, _reactNative.findNodeHandle)(ref.current);
      (0, _utils.androidCreateFragment)(REACT_CLASS, viewId);
    }
  }, []);
  const [isCaptureComplete, setCaptureComplete] = (0, _react.useState)(false);
  // Extract the nativeEvent and hide the native component if capture is
  // completed

  const onCaptureCompleteCallback = (0, _react.useCallback)(event => {
    setCaptureComplete(true);
    onCaptureComplete(event.nativeEvent.imageBase64);
  }, [onCaptureComplete]);
  let settings = _reactNative.Platform.OS === 'ios' ? iOSSettings : iOSSettings;
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, _extends({
    style: _utils.nativeComponentStyles.container
  }, props), !isCaptureComplete ? /*#__PURE__*/_react.default.createElement(PoseEstimationNativeComponent, {
    ref: ref,
    style: _utils.nativeComponentStyles.container,
    settings: settings,
    onCaptureComplete: onCaptureCompleteCallback
  }) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null));
};
exports.PoseEstimation = PoseEstimation;
//# sourceMappingURL=poseEstimation.js.map