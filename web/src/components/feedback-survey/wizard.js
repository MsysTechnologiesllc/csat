import React from "react";
import { Button, Row, Col } from "antd";
import PropTypes from "prop-types";
import { GoArrowLeft } from "react-icons/go";
import "./feedback-survey.scss";

const Wizard = ({
  currentStep,
  setCurrentStep,
  steps,
  handleTeamMemberFeedback,
}) => {
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderButtons = () => {
    const isLastStep = currentStep === steps.length - 1;

    return (
      <Row className="btn-container">
        <Col span={6}>
          {currentStep > 0 ? (
            <Button onClick={prevStep}>
              <GoArrowLeft /> Previous
            </Button>
          ) : (
            <Button>CANCEL</Button>
          )}
        </Col>
        <Col span={18}>
          {isLastStep ? (
            <>
              <Button
                type="primary"
                onClick={handleTeamMemberFeedback}
                className="draft-button"
              >
                YES, PROCEED
              </Button>
              <Button
                type="primary"
                onClick={() => setCurrentStep(0)}
                className="active-button"
              >
                NO, SUBMIT
              </Button>
            </>
          ) : (
            <>
              <Button type="primary">SAVE AS DRAFT</Button>
              <Button
                type="primary"
                onClick={nextStep}
                className="active-button"
              >
                NEXT
              </Button>
            </>
          )}
        </Col>
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
