"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IDCapture = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _utils = require("../utils");
var _modules = require("../modules");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const REACT_CLASS = 'IDCaptureView';
const IDCaptureNativeComponent = (0, _reactNative.requireNativeComponent)(REACT_CLASS);

/**
 * IDCapture for capturing documents like passport,
 * national ID cards, and driver's licenses.
 */
const IDCapture = _ref => {
  let {
    type,
    side,
    onCaptureComplete,
    ...props
  } = _ref;
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