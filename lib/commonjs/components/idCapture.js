"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IDCapture = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _utils = require("../utils");
var _modules = require("../modules");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const REACT_CLASS = 'IDCaptureView';
const IDCaptureNativeComponent = (0, _reactNative.requireNativeComponent)(REACT_CLASS);

/**
 * IDCapture for capturing documents like passport,
 * national ID cards, and driver's licenses.
 */
const IDCapture = ({
  type,
  side,
  onCaptureComplete,
  ...props
}) => {
  if (!type) {
    throw new _utils.MissingPropertyError('type');
  }
  if (!onCaptureComplete) {
    throw new _utils.MissingPropertyError('onCaptureComplete');
  }
  // Set the default side.
  if (!side) {
    side = _modules.IDSide.front;
  }
  const ref = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    if (_reactNative.Platform.OS === 'android') {
      const viewId = (0, _reactNative.findNodeHandle)(ref.current);
      (0, _utils.androidCreateFragment)(REACT_CLASS, viewId);
    }
  }, []);
  const [isCaptureCompleted, setCaptureCompleted] = (0, _react.useState)(false);
  const onCaptureCompleteCallback = (0, _react.useCallback)(event => {
    setCaptureCompleted(true);
    onCaptureComplete(event.nativeEvent.imageBase64);
  }, [onCaptureComplete]);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, _extends({
    style: _utils.nativeComponentStyles.container
  }, props), !isCaptureCompleted ? /*#__PURE__*/_react.default.createElement(IDCaptureNativeComponent, _extends({
    ref: ref,
    settings: {
      side: side,
      type: type
    },
    onCaptureComplete: onCaptureCompleteCallback,
    style: _utils.nativeComponentStyles.container
  }, props)) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null));
};
exports.IDCapture = IDCapture;
//# sourceMappingURL=idCapture.js.map