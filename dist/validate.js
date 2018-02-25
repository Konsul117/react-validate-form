"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _merge = require("lodash/merge");

var _merge2 = _interopRequireDefault(_merge);

var _union = require("lodash/union");

var _union2 = _interopRequireDefault(_union);

var _validationRules = require("./validationRules");

var _validationRules2 = _interopRequireDefault(_validationRules);

var _createValidationRulesFromInput = require("./createValidationRulesFromInput");

var _createValidationRulesFromInput2 = _interopRequireDefault(_createValidationRulesFromInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = { merge: _merge2.default, union: _union2.default };

var Validate = function (_Component) {
  _inherits(Validate, _Component);

  _createClass(Validate, null, [{
    key: "checkErrorCount",
    value: function checkErrorCount(errorObject) {
      return Object.keys(errorObject).length && Object.keys(errorObject).reduce(function (acc, curr) {
        var total = acc += Object.keys(errorObject[curr]).length;
        return total;
      }, 0);
    }
  }]);

  function Validate(props) {
    _classCallCheck(this, Validate);

    var _this = _possibleConstructorReturn(this, (Validate.__proto__ || Object.getPrototypeOf(Validate)).call(this, props));

    _this.state = {
      errorMessages: {},
      argumentSeperator: ":",
      allValid: false,
      errorCount: 0
    };

    _this.handleValidate = _this.handleValidate.bind(_this);
    _this.testForValidation = _this.testForValidation.bind(_this);
    return _this;
  }

  _createClass(Validate, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var validations = _.merge({}, (0, _createValidationRulesFromInput2.default)(this.renderChildren()), this.props.validations);

      this.setState({
        validations: validations
      });
    }
  }, {
    key: "validateAllFields",
    value: function validateAllFields(data) {
      var _this2 = this;

      var allErrors = {};
      Object.keys(this.state.validations).forEach(function (field) {
        if (data[field] !== undefined) {
          var fieldErrorMessages = _this2.testForValidation(field, data[field]);
          allErrors = Object.assign({}, _this2.state.errorMessages, _defineProperty({}, field, fieldErrorMessages));
        }
      });

      errorCount = Validate.checkErrorCount(allErrors);

      var allValid = errorCount === 0;

      this.setState({
        errorMessages: allErrors,
        errorCount: errorCount,
        allValid: allValid
      });

      return allValid;
    }
  }, {
    key: "handleValidate",
    value: function handleValidate(e) {
      var fieldName = "";
      var fieldValue = "";

      if (e.target) {
        fieldName = e.target.name;
        fieldValue = e.target.value;
      } else {
        fieldName = e.name;
        fieldValue = e.value;
      }

      var fieldErrorMessages = this.testForValidation(fieldName, fieldValue);
      var allErrors = Object.assign({}, this.state.errorMessages, _defineProperty({}, fieldName, fieldErrorMessages));

      var errorCount = Validate.checkErrorCount(allErrors);

      this.setState({
        errorMessages: allErrors,
        errorCount: errorCount,
        allValid: errorCount === 0
      });
    }
  }, {
    key: "ruleHasArgument",
    value: function ruleHasArgument(rule) {
      return rule.indexOf(this.state.argumentSeperator) >= 0;
    }
  }, {
    key: "testForValidation",
    value: function testForValidation(field, value) {
      var _this3 = this;

      var fieldRequirements = this.state.validations[field];

      // combine both the built in rules and custom rules
      var combinedValidationRules = _.merge({}, _validationRules2.default, this.props.rules);

      return fieldRequirements && fieldRequirements.map(function (rule) {
        if (_this3.ruleHasArgument(rule)) {
          var _rule$split = rule.split(_this3.state.argumentSeperator),
              _rule$split2 = _slicedToArray(_rule$split, 2),
              funcName = _rule$split2[0],
              arg = _rule$split2[1];

          return combinedValidationRules[funcName] && !combinedValidationRules[funcName].test(arg)(value) && combinedValidationRules[funcName].message(arg)(field, value);
        }
        return combinedValidationRules[rule] && !combinedValidationRules[rule].test(value) && combinedValidationRules[rule].message(field, value);
      }).filter(function (val) {
        return val;
      });
    }
  }, {
    key: "renderChildren",
    value: function renderChildren() {
      return this.props.children({
        validate: this.handleValidate,
        errorMessages: this.state.errorMessages,
        allValid: this.state.allValid,
        errorCount: this.state.errorCount
      });
    }
  }, {
    key: "render",
    value: function render() {
      return this.renderChildren();
    }
  }]);

  return Validate;
}(_react.Component);

Validate.propTypes = {
  children: _propTypes2.default.func.isRequired,
  validations: _propTypes2.default.objectOf(_propTypes2.default.array),
  rules: _propTypes2.default.shape({
    test: _propTypes2.default.func,
    message: _propTypes2.default.func
  })
};

Validate.defaultProps = {
  validations: {},
  rules: {}
};

exports.default = Validate;