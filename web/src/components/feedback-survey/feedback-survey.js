import React, { useState } from "react";
import Wizard from "./wizard";
import { WizardProgressBar } from "./wizard-progress-bar";
import { Radio, Rate } from "antd";
import "./feedback-survey.scss";
import { step1Options, step4Options, step5Options } from "../../stub-data/data";
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router";
import { LineOutlined } from "@ant-design/icons";
import { IoStarSharp } from "react-icons/io5";
import i18n from "../../locales/i18next";

export const FeedBackSurvey = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const handleChange = () => {
    setIsAnswerSelected(true);
  };
  const customIcons = Array.from({ length: 5 }, (_, index) => (
    <LineOutlined key={index} className="rating-icon" />
  ));
  const customStarIcons = Array.from({ length: 5 }, (_, index) => (
    <IoStarSharp key={index} className="rating-icon" />
  ));
  const steps = [
    {
      title: "Step 1",
      content: (
        <>
          <p className="question">
            {i18n.t("surveyQuestions.sprintOnTrack")}
            <span className="required-star">*</span>
          </p>
          <Radio.Group name="radiogroup" className="radio-group-images ">
            {step1Options.map((option) => (
              <label key={option.value} className="radio-img-container ">
                <div className={`emoji-container ${option.value} `}>
                  <img src={option.imgSrc} alt={option.label} />
                  <p className="label">{option.label}</p>
                </div>
                <Radio value={option.value} onChange={handleChange} />
              </label>
            ))}
          </Radio.Group>
        </>
      ),
    },
    {
      title: "Step 2",
      content: (
        <>
          <p className="question">
            {i18n.t("surveyQuestions.overallProjectGoal")}
            <span className="required-star"> *</span>
          </p>
          <div className="rating-scale-container">
            <Rate
              character={({ index = 0 }) => customIcons[index]}
              onChange={handleChange}
            />
            <div className="rating-desc-container">
              <span className="unsatisfy-text">
                {i18n.t("surveyQuestions.unSatisfied")}
              </span>
              <span className="satisy-text">
                {i18n.t("surveyQuestions.satisfied")}
              </span>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Step 3",
      content: (
        <>
          <p className="question">
            {i18n.t("surveyQuestions.overallRatingOfTeam")}
          </p>
          <Rate
            character={({ index = 0 }) => customStarIcons[index]}
            allowHalf
            className="rate"
            onChange={handleChange}
          />
        </>
      ),
    },
    {
      title: "Step 4",
      content: (
        <>
          <p className="question">
            {i18n.t("surveyQuestions.teamMeetExpectations")}
            <span className="required-star"> *</span>
          </p>
          <Radio.Group
            name="radiogroup"
            className="radio-group-images smiles-container"
          >
            {step4Options.map((option) => (
              <label key={option.value} className="radio-img-container ">
                <div className={`emoji-container ${option.value}`}>
                  <img src={option.imgSrc} alt={option.label} />
                  <p className={`label ${option.colorClassName}`}>
                    {option.label}
                  </p>
                </div>
                <Radio value={option.value} onChange={handleChange} />
              </label>
            ))}
          </Radio.Group>
        </>
      ),
    },
    {
      title: "Step 5",
      content: (
        <>
          <p className="question">
            {i18n.t("surveyQuestions.overallProductivity")}
            <span className="required-star"> *</span>
          </p>
          <Radio.Group
            name="radiogroup"
            className="radio-group-images speedometer-group-images"
          >
            {step5Options.map((option, index) => (
              <label key={index} className="speedometer radio-img-container">
                <img
                  src="./images/gauge.svg"
                  alt={i18n.t("imageAlt.gauge")}
                  className="speedometer-image"
                />
                <img
                  src="./images/needle.svg"
                  alt={i18n.t("imageAlt.needle")}
                  className={option.className}
                />
                <label className="label">{option.label}</label>
                <Radio value={option.value} onChange={handleChange} />
              </label>
            ))}
          </Radio.Group>
        </>
      ),
    },
    {
      title: "Step 6",
      content: (
        <>
          <p className="question">
            {i18n.t("surveyQuestions.likeToShareWithUs")}
          </p>
          <TextArea
            rows={5}
            placeholder={i18n.t("placeholder.message")}
            onChange={handleChange}
            className="text-area"
          />
        </>
      ),
    },
    {
      title: "Step 7",
      content: (
        <>
          <img src="./images/mdi_ticket.svg" alt={i18n.t("imageAlt.ticket")} />
          <p className="question">
            {i18n.t("surveyQuestions.feedbackForTeamMember")}
          </p>
        </>
      ),
    },
  ];
  const handleTeamMemberFeedback = () => {
    navigate("/teamFeedback");
  };
  return (
    <div className="wizard-wrapper">
      <Wizard
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        steps={steps}
        handleTeamMemberFeedback={handleTeamMemberFeedback}
        isAnswerSelected={isAnswerSelected}
        setIsAnswerSelected={setIsAnswerSelected}
      />
      <WizardProgressBar currentStep={currentStep} steps={steps} />
    </div>
  );
};
