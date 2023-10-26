"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Selfie = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _utils = require("../utils");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const REACT_CLASS = 'SelfieCaptureView';
const SelfieNativeComponent = (0, _reactNative.requireNativeComponent)(REACT_CLASS);

/**
 * Selfie capture component for capturing selfies.
 *
 * You can get the base64 encoded image from the onCaptureComplete
 * callback.
 */
const Selfie = _ref => {
  let {
    type,
    onCaptureComplete,
    ...props
  } = _ref;
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