import React from "react";
import PropTypes from "prop-types";
import { Progress } from "antd";
import "./feedback-survey.scss";

export const WizardProgressBar = ({ currentStep, steps }) => {
  return (
    <div className="progress-bar-container">
      <span className="current-step">0{currentStep + 1}</span>
      <Progress
        percent={(currentStep + 1) * (100 / steps.length)}
        status="normal"
        format={() => ` 0${steps.length}`}
        className="progress-bar"
      />
    </div>
  );
};
WizardProgressBar.propTypes = {
  currentStep: PropTypes.number.isRequired,
  steps: PropTypes.array.isRequired,
};
