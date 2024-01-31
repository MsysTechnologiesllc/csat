import React, { useState } from "react";
import Wizard from "./wizard";
import { WizardProgressBar } from "./wizard-progress-bar";
import { Radio, Rate, Input } from "antd";
import { step1Options, step4Options, step5Options } from "../../stub-data/data";
import { useNavigate } from "react-router";
import { LineOutlined } from "@ant-design/icons";
import { IoStarSharp } from "react-icons/io5";
import i18n from "../../locales/i18next";
import { plLibComponents } from "../../context-provider/component-provider";
import "./feedback-survey.scss";

export const FeedBackSurvey = () => {
  const { RadioWithEmoji, RadioWithSpeedometer } = plLibComponents.components;
  const { TextArea } = Input;
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [questionsData, setQuestionsData] = useState([]);
  const handleChange = (ques, value) => {
    setIsAnswerSelected(true);
    setQuestionsData((prevData) => ({
      ...prevData,
      [ques]: value,
    }));
  };
  console.log(questionsData, "entered data");
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
            {step1Options.question}
            <span className="required-star">*</span>
          </p>
          <Radio.Group name="radiogroup" className="radio-group-images ">
            {step1Options.options.map(({ value, label, imgSrc }) => (
              <RadioWithEmoji
                imageSrc={imgSrc}
                label={label}
                value={value}
                textColor={label}
                key={value}
                handleChange={(event) =>
                  handleChange(step1Options.question, event.target.value)
                }
              />
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
              onChange={(value) =>
                handleChange(
                  i18n.t("surveyQuestions.overallProjectGoal"),
                  value
                )
              }
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
            onChange={(value) =>
              handleChange(i18n.t("surveyQuestions.overallRatingOfTeam"), value)
            }
          />
        </>
      ),
    },
    {
      title: "Step 4",
      content: (
        <>
          <p className="question">
            {step4Options.question}
            <span className="required-star"> *</span>
          </p>
          <Radio.Group
            name="radiogroup"
            className="radio-group-images smiles-container"
          >
            {step4Options.options.map(
              ({ value, label, imgSrc, colorClassName }) => (
                <RadioWithEmoji
                  imageSrc={imgSrc}
                  label={label}
                  value={value}
                  textColor={colorClassName}
                  key={value}
                  handleChange={(event) =>
                    handleChange(step4Options.question, event.target.value)
                  }
                />
              )
            )}
          </Radio.Group>
        </>
      ),
    },
    {
      title: "Step 5",
      content: (
        <>
          <p className="question">
            {step5Options.question}
            <span className="required-star"> *</span>
          </p>
          <Radio.Group
            name="radiogroup"
            className="radio-group-images speedometer-group-images"
          >
            {step5Options.options.map(({ label, value }, index) => (
              <RadioWithSpeedometer
                key={index}
                speedometerImage="./images/gauge.svg"
                needleImage="./images/needle.svg"
                label={label}
                value={value}
                handleChange={(event) =>
                  handleChange(step5Options.question, event.target.value)
                }
              />
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
            onChange={(event) =>
              handleChange(
                i18n.t("surveyQuestions.likeToShareWithUs"),
                event.target.value
              )
            }
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
