"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Selfie = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _utils = require("../utils");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const REACT_CLASS = 'SelfieCaptureView';
const SelfieNativeComponent = (0, _reactNative.requireNativeComponent)(REACT_CLASS);

/**
 * Selfie capture component for capturing selfies.
 *
 * You can get the base64 encoded image from the onCaptureComplete
 * callback.
 */
const Selfie = ({
  type,
  onCaptureComplete,
  ...props
}) => {
  if (!onCaptureComplete) {
    throw new _utils.MissingPropertyError('onCaptureComplete');
  }
  if (!type) {
    type = 'XXX_SE_0';
  }
  const [isCompleted, setCompleted] = (0, _react.useState)(false);
  const ref = (0, _react.useRef)(null);
  const onCaptureCompleteCallback = (0, _react.useCallback)(event => {
    setCompleted(true);
    onCaptureComplete(`data:image/jpeg;base64,${event.nativeEvent.imageBase64}`);
  }, [onCaptureComplete]);
  (0, _react.useEffect)(() => {
    if (_reactNative.Platform.OS === 'android' && ref.current) {
      const viewId = (0, _reactNative.findNodeHandle)(ref.current);
      (0, _utils.androidCreateFragment)(REACT_CLASS, viewId);
    }
  }, []);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, _extends({
    style: _utils.nativeComponentStyles.container
  }, props), !isCompleted ? /*#__PURE__*/_react.default.createElement(SelfieNativeComponent, {
    ref: ref,
    type: type,
    onCaptureComplete: onCaptureCompleteCallback,
    style: _utils.nativeComponentStyles.container
  }) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null));
};
exports.Selfie = Selfie;
//# sourceMappingURL=selfie.js.map