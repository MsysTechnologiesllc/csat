import React, { useState } from "react";
import Wizard from "./wizard";
import { WizardProgressBar } from "./wizard-progress-bar";
import { Input, Radio, Rate } from "antd";
// import { step1Options } from "../../stub-data/data";
import { useNavigate } from "react-router";
import { LineOutlined } from "@ant-design/icons";
import { IoStarSharp } from "react-icons/io5";
import i18n from "../../locales/i18next";
import { plLibComponents } from "../../context-provider/component-provider";
import "./feedback-survey.scss";
import { surveyDetails } from "../../stub-data/survey-details";

export const FeedBackSurvey = () => {
  const { RadioWithEmoji, RadioWithSpeedometer } = plLibComponents.components;
  const { TextArea } = Input;
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [questionsData, setQuestionsData] = useState([]);
  const [text, setText] = useState("");
  // const [scaleRate, setScaleRate] = useState([]);
  // const [starRate, setStarRate] = useState([]);
  const handleChange = (ques, value) => {
    const scaleRes = [];
    setIsAnswerSelected(true);
    if (ques.question.type === "scale-rating") {
      console.log("done");
      for (let i = 1; i <= value; i++) {
        const key = String.fromCharCode(96 + i); // Random lowercase letter (a-z)
        scaleRes.push({ [key]: i });
      }
      ques.answer = scaleRes;
      setQuestionsData((prevData) => [...prevData, ques]);
      // setScaleRate(scaleRes);
    } else if (ques.question.type === "star-rating") {
      console.log("done");
      let length = value * 2;
      for (let i = 1; i <= length; i++) {
        const key = String.fromCharCode(96 + i); // Random lowercase letter (a-z)
        scaleRes.push({ [key]: i / 2 });
      }
      ques.answer = scaleRes;
      // setStarRate(scaleRes);
      setQuestionsData((prevData) => [...prevData, ques]);
    } else {
      ques.answer = value;
      setQuestionsData((prevData) => [...prevData, ques]);
    }

    // console.log(starRate, scaleRate);

    // ques.answer = value;
    // setQuestionsData((prevData) => [...prevData, ques]);
  };
  const customIcons = Array.from({ length: 5 }, (_, index) => (
    <LineOutlined key={index} className="rating-icon" />
  ));
  const customStarIcons = Array.from({ length: 5 }, (_, index) => (
    <IoStarSharp key={index} className="rating-icon" />
  ));

  const dynamicSteps = (dynamicStepsData) => {
    return dynamicStepsData.map((each, index) => {
      return {
        title: `Step ${index}`,
        content: (
          <>
            {each.question.type === "team-members-feedback" && (
              <img
                src="./images/mdi_ticket.svg"
                alt={i18n.t("imageAlt.ticket")}
              />
            )}
            <p className="question">
              {each.question.description}
              <span className="required-star">*</span>
            </p>
            {each.question.type === "boolean" && (
              <Radio.Group name="radiogroup" className="radio-group-images ">
                {each.question.options.map((option) => (
                  <RadioWithEmoji
                    imageSrc={
                      Object.values(option)[0] === "yes"
                        ? "/images/yes-image.svg"
                        : "/images/no-image.svg"
                    }
                    label={
                      Object.values(option)[0] === "yes"
                        ? i18n.t("common.yes")
                        : i18n.t("common.no")
                    }
                    value={Object.values(option)[0]}
                    textColor={
                      Object.values(option)[0] === "yes"
                        ? i18n.t("common.yes")
                        : i18n.t("common.no")
                    }
                    key={Object.values(option)[0]}
                    handleChange={(event) =>
                      handleChange(each, event.target.value)
                    }
                  />
                ))}
              </Radio.Group>
            )}
            {each.question.type === "scale-rating" && (
              <div className="rating-scale-container">
                <Rate
                  character={({ index = 0 }) => customIcons[index]}
                  onChange={(value) => handleChange(each, value)}
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
            )}
            {each.question.type === "star-rating" && (
              <Rate
                character={({ index = 0 }) => customStarIcons[index]}
                allowHalf
                className="rate"
                onChange={(value) => handleChange(each, value)}
              />
            )}
            {each.question.type === "emoji-options" && (
              <Radio.Group
                name="radiogroup"
                className="radio-group-images smiles-container"
              >
                {each.question.options.map((option) => (
                  <RadioWithEmoji
                    imageSrc={
                      Object.values(option)[0] === "Very Low"
                        ? "/images/very-low.svg"
                        : Object.values(option)[0] === "Low"
                          ? "/images/low.svg"
                          : Object.values(option)[0] === "Average"
                            ? "/images/avg.svg"
                            : Object.values(option)[0] === "High"
                              ? "/images/high.svg"
                              : "/images/very-high.svg"
                    }
                    label={Object.values(option)[0]}
                    value={
                      Object.values(option)[0] === "Very Low"
                        ? "very-low"
                        : Object.values(option)[0] === "Low"
                          ? "low"
                          : Object.values(option)[0] === "Average"
                            ? "avg"
                            : Object.values(option)[0] === "High"
                              ? "high"
                              : "very-high"
                    }
                    textColor={
                      Object.values(option)[0] === "Very Low"
                        ? "very-low-color"
                        : Object.values(option)[0] === "Low"
                          ? "low-color"
                          : Object.values(option)[0] === "Average"
                            ? "avg-color"
                            : Object.values(option)[0] === "High"
                              ? "high-color"
                              : "very-high-color"
                    }
                    key={Object.values(option)[0]}
                    handleChange={(event) =>
                      handleChange(each, event.target.value)
                    }
                  />
                ))}
              </Radio.Group>
            )}
            {each.question.type === "gauge-options" && (
              <Radio.Group
                name="radiogroup"
                className="radio-group-images speedometer-group-images"
              >
                {each.question.options.map((option, index) => (
                  <RadioWithSpeedometer
                    key={index}
                    speedometerImage="./images/gauge.svg"
                    needleImage="./images/needle.svg"
                    label={Object.values(option)[0]}
                    value={
                      Object.values(option)[0] === "Very Low"
                        ? "very-low-scale"
                        : Object.values(option)[0] === "Low"
                          ? "low-scale"
                          : Object.values(option)[0] === "Average"
                            ? "avg-scale"
                            : Object.values(option)[0] === "High"
                              ? "high-scale"
                              : "very-high-scale"
                    }
                    handleChange={(event) =>
                      handleChange(each, event.target.value)
                    }
                  />
                ))}
              </Radio.Group>
            )}
            {each.question.type === "textarea-feedback" && (
              <TextArea
                rows={5}
                placeholder={i18n.t("placeholder.message")}
                onBlur={() => handleChange(each, text)}
                onChange={(event) => setText(event.target.value)}
                className="text-area"
              />
            )}
          </>
        ),
      };
    });
  };

  const steps = dynamicSteps(surveyDetails.Survey.survey_answers);

  const handleTeamMemberFeedback = () => {
    console.log(questionsData, "entered data");
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
