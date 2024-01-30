import React, { useState } from "react";
import { Button, Row, Col } from "antd";
import PropTypes from "prop-types";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { useNavigate } from "react-router";
import i18n from "../../locales/i18next";
import "./feedback-survey.scss";
import NotifyStatus from "../notify-status/notify-status";

const Wizard = ({
  currentStep,
  setCurrentStep,
  steps,
  handleTeamMemberFeedback,
  isAnswerSelected,
  setIsAnswerSelected,
}) => {
  const navigate = useNavigate();
  const [notify, setNotify] = useState("");
  const handleDraft = () => {
    setNotify("draft");
  };
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
    setIsAnswerSelected(false);
    setNotify("");
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setIsAnswerSelected(false);
  };
  const handleCancel = () => {
    navigate("/");
  };
  const handleSubmit = () => {
    navigate("/survey/submitted");
  };
  const renderButtons = () => {
    const isLastStep = currentStep === steps.length - 1;

    return (
      <Row className="btn-container">
        <Col className="prev-cancel-container">
          {currentStep > 0 ? (
            <Button onClick={prevStep} className="previous-button" type="text">
              <GoArrowLeft className="arrow-icon" />
              {i18n.t("button.previous")}
            </Button>
          ) : (
            <Button
              type="text"
              className="cancel-button"
              onClick={handleCancel}
            >
              {i18n.t("button.cancel")}
            </Button>
          )}
        </Col>
        {isLastStep ? (
          <div className="draft-submit-btns">
            <Button className="draft-button" onClick={() => handleDraft()}>
              {i18n.t("button.saveAsDraft")}
            </Button>
            <Button onClick={handleTeamMemberFeedback} className="draft-button">
              {i18n.t("button.yesProceed")}
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              className="active-button"
            >
              {i18n.t("button.noSubmit")}
            </Button>
          </div>
        ) : (
          <div className="draft-submit-btns">
            <Button
              className={
                isAnswerSelected
                  ? "draft-button"
                  : "draft-button disabled-button"
              }
              disabled={!isAnswerSelected}
              onClick={() => handleDraft()}
            >
              {i18n.t("button.saveAsDraft")}
            </Button>
            <Button
              type="primary"
              onClick={nextStep}
              className={
                isAnswerSelected
                  ? "active-button"
                  : "active-button disabled-button"
              }
              disabled={!isAnswerSelected}
            >
              <span> {i18n.t("button.next")}</span>
              <GoArrowRight className="arrow-icon" />
            </Button>
          </div>
        )}
        {notify && (
          <NotifyStatus status={notify} message="Draft saved successfully" />
        )}
      </Row>
    );
  };
  return (
    <div className="wizard-container">
      <div className="top-btn-container">
        {currentStep > 0 ? (
          <Button onClick={prevStep} className="previous-button" type="text">
            <GoArrowLeft className="arrow-icon" />
            {i18n.t("button.previous")}
          </Button>
        ) : (
          <Button type="text" className="cancel-button" onClick={handleCancel}>
            {i18n.t("button.cancel")}
          </Button>
        )}
      </div>
      <div className="steps-content">{steps[currentStep].content}</div>
      <div className="steps-action">{renderButtons()}</div>
    </div>
  );
};
Wizard.propTypes = {
  currentStep: PropTypes.number.isRequired,
  steps: PropTypes.array.isRequired,
  handleTeamMemberFeedback: PropTypes.func.isRequired,
  isAnswerSelected: PropTypes.bool.isRequired,
  setCurrentStep: PropTypes.func.isRequired,
  setIsAnswerSelected: PropTypes.func.isRequired,
};

export default Wizard;
