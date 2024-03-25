import React from "react";
import { Button } from "antd";
import PropTypes from "prop-types";
import { GoArrowLeft } from "react-icons/go";
import i18n from "../../locales/i18next";
import NotifyStatus from "../notify-status/notify-status";
import "./feedback-survey.scss";

const Wizard = ({
  currentStep,
  steps,
  prevStep,
  handleCancel,
  message,
  notify,
}) => {
  return (
    <div className="wizard-container">
      <div className="top-btn-container">
        {currentStep > 0 ? (
          <>
            <Button onClick={prevStep} className="previous-button" type="text">
              <GoArrowLeft className="arrow-icon" />
              {i18n.t("button.previous")}
            </Button>
            {currentStep === 6 && (
              <Button
                className="draft-button"
                type="text"
                onClick={() => handleDraft()}
              >
                {i18n.t("button.saveAsDraft")}
              </Button>
            )}
          </>
        ) : (
          <Button type="text" className="cancel-button" onClick={handleCancel}>
            {i18n.t("button.cancel")}
          </Button>
        )}
      </div>
      <div className="steps-content">{steps[currentStep].content}</div>
      {notify && <NotifyStatus status={notify} message={message} />}
    </div>
  );
};
Wizard.propTypes = {
  currentStep: PropTypes.number.isRequired,
  steps: PropTypes.array.isRequired,
  notify: PropTypes.string.isRequired,
  prevStep: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default Wizard;
