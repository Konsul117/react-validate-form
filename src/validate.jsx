import React, { Component } from "react";
import PropTypes from "prop-types";
import merge from "lodash/merge";
import union from "lodash/union";
import validationRules from "./validationRules";
import createValidationRulesFromInput from "./createValidationRulesFromInput";

const _ = { merge, union };


class Validate extends Component {
  static checkErrorCount(errorObject) {
    return Object.keys(errorObject).length &&
      Object.keys(errorObject).reduce((acc, curr) => {
        const total = acc += Object.keys(errorObject[curr]).length;
        return total;
      }, 0);
  }

  constructor(props) {
    super(props);

    this.state = {
      errorMessages: {},
      argumentSeperator: ":",
      allValid: false,
      errorCount: 0,
    };

    this.handleValidate = this.handleValidate.bind(this);
    this.testForValidation = this.testForValidation.bind(this);
  }

	componentDidUpdate(prevProps, prevState) {
  	    if (this.props.sessionId !== prevProps.sessionId) {
  	    	this.setState({
		        errorMessages: {},
		        allValid: false,
		        errorCount: 0,
	        });
        }
	}

	// componentWillReceiveProps(nextProps) {
  	//     if (this.props.validations !== nextProps.validations) {
	//         const validations = _.merge(
	// 	        {},
	// 	        createValidationRulesFromInput(this.renderChildren()),
	// 	        nextProps.validations,
	//         );
	//
	//         this.setState({
	// 	        validations,
	//         });
    //     }
	// }

  // componentWillMount() {
  //   const validations = _.merge(
  //     {},
  //     createValidationRulesFromInput(this.renderChildren()),
  //     this.props.validations,
  //   );
  //
  //   this.setState({
  //     validations,
  //   });
  // }

  validateAllFields(data, showErrors = true) {
  	  let allErrors = {};
	  Object.keys(this.props.validations).forEach((field) => {
	  	if (data[field] !== undefined) {
		    let fieldErrorMessages = this.testForValidation(field, data[field]);
		    allErrors = Object.assign(
			    {},
			    allErrors,
			    { [field]: fieldErrorMessages },
		    );
	    }
	  });

	  let errorCount = Validate.checkErrorCount(allErrors);

	  let allValid = (errorCount === 0);

	  if (showErrors === true) {
		  this.setState({
			  errorMessages: allErrors,
			  errorCount,
			  allValid: allValid,
		  });
	  }

	  return allValid;
  }

  getErrorsByFields(data) {
	  let allErrors = {};
	  Object.keys(this.props.validations).forEach((field) => {
		  if (data[field] !== undefined) {
			  let fieldErrorMessages = this.testForValidation(field, data[field]);
			  if (fieldErrorMessages.length > 0) {
				  allErrors = Object.assign(
					  {},
					  allErrors,
					  {[field]: fieldErrorMessages},
				  );
			  }
		  }
	  });

	  return allErrors;
  }

  handleValidate(e) {
    let fieldName = "";
    let fieldValue = "";

    if (e.target) {
      fieldName = e.target.name;
      fieldValue = e.target.value;
    } else {
      fieldName = e.name;
      fieldValue = e.value;
    }

    const fieldErrorMessages = this.testForValidation(fieldName, fieldValue);
    const allErrors = Object.assign(
        {},
        this.state.errorMessages,
        { [fieldName]: fieldErrorMessages },
      );

    const errorCount = Validate.checkErrorCount(allErrors);

    this.setState({
      errorMessages: allErrors,
      errorCount,
      allValid: errorCount === 0,
    });
  }

  ruleHasArgument(rule) {
    return rule.indexOf(this.state.argumentSeperator) >= 0;
  }

  testForValidation(field, value) {
    const fieldRequirements = this.props.validations[field];

    // combine both the built in rules and custom rules
    const combinedValidationRules = _.merge({}, validationRules, this.props.rules);

    return fieldRequirements && fieldRequirements.map(rule => {
      if (this.ruleHasArgument(rule)) {
        const [funcName, arg] = rule.split(this.state.argumentSeperator);
        return (
          combinedValidationRules[funcName] &&
          !combinedValidationRules[funcName].test(arg)(value) &&
          combinedValidationRules[funcName].message(arg)(field, value)
        );
      }
      return (
        combinedValidationRules[rule] &&
        !combinedValidationRules[rule].test(value) &&
        combinedValidationRules[rule].message(field, value)
      );
    }).filter(val => val);
  }

  renderChildren() {
    return this.props.children({
      validate: this.handleValidate,
      errorMessages: this.state.errorMessages,
      allValid: this.state.allValid,
      errorCount: this.state.errorCount,
    });
  }

  render() {
    return this.renderChildren();
  }
}

Validate.propTypes = {
  children: PropTypes.func.isRequired,
  validations: PropTypes.objectOf(PropTypes.array),
  rules: PropTypes.shape({
    test: PropTypes.func,
    message: PropTypes.func,
  }),
};

Validate.defaultProps = {
  validations: {},
  rules: {},
};

export default Validate;
