"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regExRules = require("./regExRules");

var validationRules = {
  required: {
    test: function test(val) {
      return val.length > 0;
    },
    message: function message(name) {
      return name + " is required.";
    }
  },
  email: {
    test: function test(val) {
      return _regExRules.emailRegEx.test(val);
    },
    message: function message(name) {
      return name + " must be a valid email.";
    }
  },
  min: {
    test: function test(arg) {
      return function (val) {
        return val.length >= arg;
      };
    },
    message: function message(arg) {
      return function (name) {
        return name + " must be at least " + arg + " characters.";
      };
    }
  },
  max: {
    test: function test(arg) {
      return function (val) {
        return val.length <= arg;
      };
    },
    message: function message(arg) {
      return function (name) {
        return name + " must be less than " + arg + " characters.";
      };
    }
  }
};

exports.default = validationRules;