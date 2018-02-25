"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _validationRules = require("./validationRules");

var _validationRules2 = _interopRequireDefault(_validationRules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createValidationRulesFromInput = function createValidationRulesFromInput(Element) {
  var newValidationRules = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (Element && Element.props && !Element.props.children) {
    Object.keys(_validationRules2.default).forEach(function (rule) {
      var value = Element.props[rule] || Element.props.type === rule;
      if (value) {
        newValidationRules[Element.props.name] = newValidationRules[Element.props.name] || [];
        newValidationRules[Element.props.name].push("" + rule + (typeof value !== "boolean" ? ":" + value : ""));
      }
    });

    return newValidationRules;
  }

  if (!Element || !Element.props) {
    return newValidationRules;
  }

  _react2.default.Children.forEach(Element.props.children, function (c) {
    return createValidationRulesFromInput(c, newValidationRules);
  });

  return newValidationRules;
};

exports.default = createValidationRulesFromInput;