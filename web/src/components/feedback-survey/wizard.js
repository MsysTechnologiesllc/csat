import React from "react";
import { Button, Row, Col } from "antd";
import PropTypes from "prop-types";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router";
import "./feedback-survey.scss";

const Wizard = ({
  currentStep,
  setCurrentStep,
  steps,
  handleTeamMemberFeedback,
}) => {
  const navigate = useNavigate();
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
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
        <Col span={6}>
          {currentStep > 0 ? (
            <Button onClick={prevStep} className="previous-button" type="text">
              <GoArrowLeft className="arrow-icon" /> <span> PREVIOUS</span>
            </Button>
          ) : (
            <Button
              type="text"
              className="cancel-button"
              onClick={handleCancel}
            >
              CANCEL
            </Button>
          )}
        </Col>
        {isLastStep ? (
          <Col span={13}>
            <div className="draft-submit-btns">
              <Button className="draft-button">SAVE AS DRAFT</Button>
              <Button
                type="text"
                onClick={handleTeamMemberFeedback}
                className="draft-button"
              >
                YES, PROCEED
              </Button>
              <Button
                type="primary"
                onClick={handleSubmit}
                className="active-button"
              >
                NO, SUBMIT
              </Button>
            </div>
          </Col>
        ) : (
          <Col span={8}>
            <div className="draft-submit-btns">
              <Button className="draft-button">SAVE AS DRAFT</Button>
              <Button
                type="primary"
                onClick={nextStep}
                className="active-button"
              >
                NEXT
              </Button>
            </div>
          </Col>
        )}
      </Row>
    );
  };
  return (
    <div className="wizard-container">
      <div className="steps-content">{steps[currentStep].content}</div>
      <div className="steps-action">{renderButtons()}</div>
    </div>
  );
};
Wizard.propTypes = {
  currentStep: PropTypes.number.isRequired,
  steps: PropTypes.array.isRequired,
  handleTeamMemberFeedback: PropTypes.func.isRequired,
  setCurrentStep: PropTypes.bool.isRequired,
};
export default Wizard;
