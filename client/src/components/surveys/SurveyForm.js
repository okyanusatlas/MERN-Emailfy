import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {Link} from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';
import stuffTobeRendered from './formFields';


class SurveyForm extends Component {

    renderFields() {
        return (
          <div>
              {stuffTobeRendered.map(stuff => {
                  return <Field type="text" name={stuff.name}
                                component={SurveyField} label={stuff.label}
                                key={stuff.name}
                  />
              })}

          </div>
        )
    }

    render() {
        return <div>
            <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
                {this.renderFields()}
                <Link to="/surveys" className="red btn-flat white-text">
                    <i className="material-icons left">cancel</i>
                    Cancel
                </Link>
                <button className="teal btn-flat right white-text" type="submit">
                    Next
                    <i className="material-icons right">done</i>
                </button>
            </form>

        </div>
    }
}

function validate(values) {
    const errors = {};
    errors.recipients = validateEmails(values.recipients);
    stuffTobeRendered.forEach(({name}) => {
        if (!values[name]) {
            errors[name] = `You must provide a value for ${name}`
        }
    });

    return errors
}

export default reduxForm({
    validate,
    destroyOnUnmount:false,
    form: 'surveyForm'
})(SurveyForm);