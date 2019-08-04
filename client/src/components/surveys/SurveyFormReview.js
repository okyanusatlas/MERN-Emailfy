import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import stuffTobeRendered from './formFields';
import * as actions from '../../actions';

const SurveyFormReview = ({onCancel, formValues, submitSurvey, history}) => {

    const reviewField = stuffTobeRendered.map(({name, label}) => {
        return (
          <div key={label}>
              <label> {label}</label>
              <div>
                  {formValues[name]}
              </div>
          </div>

        );
    });

    return (
      <div>
          <h5> Review please</h5>
          {reviewField}
          <button className="yellow darken-3 btn-flat" onClick={onCancel}>
              Back
          </button>
          <button className="green btn-flat right white-text" onClick={() => submitSurvey(formValues, history)}>
              Send Survey
              <i className="material-icons right">email</i>
          </button>
      </div>
    )
};

function mapStateToProps(state) {
    return {
        formValues: state.form.surveyForm.values
    };
}

export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));