import React, { useEffect, useState } from "react";
import Wizard from "./wizard";
import { WizardProgressBar } from "./wizard-progress-bar";
import { Button, Col, Input, Radio, Rate, Row } from "antd";
import { useLocation, useNavigate } from "react-router";
import { LineOutlined } from "@ant-design/icons";
import { IoStarSharp } from "react-icons/io5";
import i18n from "../../locales/i18next";
import { plLibComponents } from "../../context-provider/component-provider";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { PutService } from "../../services/put";
import "./feedback-survey.scss";

export const FeedBackSurvey = () => {
  const { RadioWithEmoji, RadioWithSpeedometer } = plLibComponents.components;
  const { TextArea } = Input;
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [questionsData, setQuestionsData] = useState([]);
  const [notify, setNotify] = useState("");
  const [text, setText] = useState("");
  const { state } = useLocation();
  const { surveyDetails } = state;
  const [message, setMessage] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [isAnswerSelected, setIsAnsweraSelected] = useState(false);
  const [draft, setDraft] = useState("");
  const [comment, setComment] = useState("");
  const [submitLoader, setSubmitLoader] = useState(false);
  const [draftLoader, setDraftLoader] = useState(false);
  useEffect(() => {
    if (draft === "draft") {
      const payload = {
        survey_id: surveyDetails.Survey.ID,
        survey_answers: questionsData,
        survey_status: "draft",
        project_id: surveyDetails.Survey.project_id,
      };
      new PutService().updateSurveyDetails(payload, (result) => {
        if (result?.status === 200) {
          setDraftLoader(false);
          setQuestionsData([]);
          setDraft("");
          setNotify("success");
          setMessage(i18n.t("common.draftMessage"));
        }
      });
    }
  }, [questionsData, draft]);

  const customIcons = Array.from({ length: 5 }, (_, index) => (
    <LineOutlined key={index} className="rating-icon" />
  ));
  const customStarIcons = Array.from({ length: 5 }, (_, index) => (
    <IoStarSharp key={index} className="rating-icon" />
  ));
  const answersSetting = (ques) => {
    const defaultSurveAns = {};
    if (ques?.answer?.length && selectedValue === "") {
      defaultSurveAns.ID = ques.ID;
      defaultSurveAns.answer = JSON.parse(ques.answer);
      setQuestionsData((prev) => [...prev, defaultSurveAns]);
    } else {
      const surveyAnswers = {};
      const scaleRes = [];
      if (ques?.question?.type === "scale-rating") {
        for (let i = 1; i <= selectedValue; i++) {
          const key = String.fromCharCode(96 + i);
          scaleRes.push({ [key]: i });
        }
        surveyAnswers.ID = ques.ID;
        surveyAnswers.answer = scaleRes;
        surveyAnswers.comment = comment;
        setQuestionsData((prevData) => [...prevData, surveyAnswers]);
      } else if (ques?.question?.type === "star-rating") {
        let length = selectedValue * 2;
        for (let i = 1; i <= length; i++) {
          const key = String.fromCharCode(96 + i);
          scaleRes.push({ [key]: i / 2 });
        }
        surveyAnswers.ID = ques.ID;
        surveyAnswers.answer = scaleRes;
        surveyAnswers.comment = comment;
        setQuestionsData((prevData) => [...prevData, surveyAnswers]);
      } else if (ques?.question?.type === "textarea-feedback") {
        surveyAnswers.ID = ques.ID;
        surveyAnswers.answer = selectedValue;
        surveyAnswers.comment = comment;
        setQuestionsData((prevData) => [...prevData, surveyAnswers]);
      } else {
        scaleRes.push({ [String.fromCharCode(97)]: selectedValue });
        surveyAnswers.ID = ques.ID;
        surveyAnswers.answer = scaleRes;
        surveyAnswers.comment = comment;
        setQuestionsData((prevData) => [...prevData, surveyAnswers]);
      }
    }
  };
  const [proceedLoader, setProceedLoader] = useState(false);
  const handleTeamMemberFeedback = () => {
    setProceedLoader(true);
    if (surveyDetails?.Survey?.status !== "publish") {
      const payload = {
        survey_id: surveyDetails.Survey.ID,
        survey_status: "pending",
        survey_answers: questionsData,
        project_id: surveyDetails.Survey.project_id,
      };
      new PutService().updateSurveyDetails(payload, (result) => {
        if (result?.status === 200) {
          setProceedLoader(false);
          navigate(
            `/teamFeedback?survey_id=${surveyDetails?.Survey?.ID}&passcode=${surveyDetails?.Survey?.passcode}`,
            {
              state: {
                surveyDetails: surveyDetails,
                questionsData: questionsData,
                status: state?.status,
              },
            },
          );
        }
      });
    } else {
      setProceedLoader(false);
      navigate(
        `/teamFeedback?survey_id=${surveyDetails?.Survey?.ID}&passcode=${surveyDetails?.Survey?.passcode}`,
        {
          state: {
            surveyDetails: surveyDetails,
            questionsData: questionsData,
            status: state?.status,
          },
        },
      );
    }
  };
  const handleSaveAsDraft = (ques) => {
    setDraftLoader(true);
    answersSetting(ques);
    setDraft("draft");
  };
  const handleChange = (value) => {
    setSelectedValue(value);
    setIsAnsweraSelected(true);
  };
  const handleOnBlur = (value) => {
    setComment(value);
  };
  const handleSubmit = () => {
    setSubmitLoader(true);
    const payload = {
      survey_id: surveyDetails.Survey.ID,
      survey_answers: questionsData,
      survey_status: "publish",
      project_id: surveyDetails.Survey.project_id,
    };
    new PutService().updateSurveyDetails(payload, (result) => {
      if (result?.status === 200) {
        navigate("/survey/submitted");
      }
    });
  };
  const nextStep = (ques) => {
    setCurrentStep(currentStep + 1);
    setNotify("");
    setIsAnsweraSelected(false);
    answersSetting(ques);
    setSelectedValue("");
    setComment("");
  };
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setQuestionsData(questionsData.slice(0, -1));
    setSelectedValue("");
    setIsAnsweraSelected(false);
    setComment("");
  };
  const handleCancel = () => {
    navigate(
      `/customer-survey?survey_id=${surveyDetails?.Survey?.ID}&passcode=${surveyDetails?.Survey?.passcode}`,
    );
    setSelectedValue("");
    setComment("");
    setIsAnsweraSelected(false);
  };
  const handleTextArea = (event) => {
    setText(event.target.value);
    setIsAnsweraSelected(true);
  };
  const handleComment = (values) => {
    setText(values);
  };
  const dynamicSteps = (dynamicStepsData) => {
    const isLastStep = currentStep === dynamicStepsData?.length - 1;
    return dynamicStepsData?.map((each, index) => {
      return {
        title: `Step ${index}`,
        content: (
          <>
            <div className="question-answer-container">
              {each.question.type === "team-members-feedback" && (
                <img
                  src="/images/mdi_ticket.svg"
                  alt={i18n.t("imageAlt.ticket")}
                />
              )}
              <p className="question">
                {each?.question?.description}
                <span className="required-star">*</span>
              </p>
              {each.question.type === "boolean" && (
                <Radio.Group
                  name="radiogroup"
                  className="radio-group-images"
                  defaultValue={each?.answer && JSON.parse(each?.answer)[0].a}
                  disabled={each?.answer && true}
                >
                  {JSON.parse(each.question.options).map((option) => (
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
                      handleChange={(event) => handleChange(event.target.value)}
                    />
                  ))}
                </Radio.Group>
              )}
              {each.question.type === "scale-rating" && (
                <div className="rating-scale-container">
                  <Rate
                    character={({ index = 0 }) => customIcons[index]}
                    onChange={(value) => handleChange(value)}
                    defaultValue={
                      each?.answer && JSON.parse(each?.answer).length
                    }
                    disabled={each?.answer && true}
                  />
                  <div className="rating-desc-container">
                    <span className="unsatisfy-text">
                      {i18n.t("surveyQuestions.unSatisfied")}
                    </span>
                    <span className="satisy-text">
                      {i18n.t("surveyQuestions.satisfied")}
                    </span>
                  </div>
                  {(selectedValue <= 2 &&
                    selectedValue !== "" &&
                    selectedValue > 0) ||
                  each?.comment ? (
                    <TextArea
                      rows={1}
                      placeholder={i18n.t("placeholder.message")}
                      onBlur={() => handleOnBlur(text)}
                      onChange={(event) => handleComment(event.target.value)}
                      className="comment-text-area"
                      defaultValue={each?.comment !== "" ? each?.comment : ""}
                      disabled={each?.comment && true}
                    />
                  ) : null}
                </div>
              )}
              {each.question.type === "star-rating" && (
                <>
                  <Rate
                    character={({ index = 0 }) => customStarIcons[index]}
                    allowHalf
                    className="rate"
                    onChange={(value) => handleChange(value)}
                    defaultValue={
                      each?.answer && JSON.parse(each?.answer).length / 2
                    }
                    disabled={each?.answer && true}
                  />
                  {(selectedValue <= 2 &&
                    selectedValue !== "" &&
                    selectedValue > 0) ||
                  each?.comment ? (
                    <TextArea
                      rows={1}
                      placeholder={i18n.t("placeholder.message")}
                      onBlur={() => handleOnBlur(text)}
                      onChange={(event) => handleComment(event.target.value)}
                      className="comment-text-area"
                      defaultValue={each?.comment !== "" ? each?.comment : ""}
                      disabled={each?.comment && true}
                    />
                  ) : null}
                </>
              )}
              {each.question.type === "emoji-options" && (
                <>
                  <Radio.Group
                    name="radiogroup"
                    className="radio-group-images smiles-container"
                    defaultValue={each?.answer && JSON.parse(each?.answer)[0].a}
                    disabled={each?.answer && true}
                  >
                    {JSON.parse(each.question.options).map((option) => (
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
                          handleChange(event.target.value)
                        }
                      />
                    ))}
                  </Radio.Group>
                  {selectedValue === "low" ||
                  selectedValue === "very-low" ||
                  each?.comment ? (
                    <TextArea
                      rows={1}
                      placeholder={i18n.t("placeholder.message")}
                      onBlur={() => handleOnBlur(text)}
                      onChange={(event) => handleComment(event.target.value)}
                      className="comment-text-area"
                      defaultValue={each?.comment?.length ? each?.comment : ""}
                      disabled={each?.comment && true}
                    />
                  ) : null}
                </>
              )}
              {each.question.type === "gauge-options" && (
                <>
                  <Radio.Group
                    name="radiogroup"
                    className="radio-group-images speedometer-group-images"
                    defaultValue={each?.answer && JSON.parse(each?.answer)[0].a}
                    disabled={each?.answer && true}
                  >
                    {JSON.parse(each.question.options).map((option, index) => (
                      <RadioWithSpeedometer
                        key={index}
                        speedometerImage="/images/Gauge.svg"
                        needleImage="/images/needle.svg"
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
                          handleChange(event.target.value)
                        }
                      />
                    ))}
                  </Radio.Group>
                  {selectedValue === "low-scale" ||
                  selectedValue === "very-low-scale" ||
                  each?.comment ? (
                    <TextArea
                      rows={1}
                      placeholder={i18n.t("placeholder.message")}
                      onBlur={() => handleOnBlur(text)}
                      onChange={(event) => handleComment(event.target.value)}
                      className="comment-text-area"
                      defaultValue={each?.comment?.length ? each?.comment : ""}
                      disabled={each?.comment && true}
                    />
                  ) : null}
                </>
              )}
              {each.question.type === "textarea-feedback" && (
                <TextArea
                  rows={5}
                  placeholder={i18n.t("placeholder.message")}
                  onBlur={() => handleChange(text)}
                  onChange={(event) => handleTextArea(event)}
                  className="text-area"
                  defaultValue={each?.answer && JSON.parse(each?.answer)}
                  disabled={each?.answer && true}
                />
              )}
            </div>
            <Row className="btn-container">
              <Col className="prev-cancel-container">
                {currentStep > 0 ? (
                  <Button
                    onClick={prevStep}
                    className="previous-button"
                    type="text"
                  >
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
                  {surveyDetails?.Survey?.status !== "publish" && (
                    <Button
                      className="draft-button hide-on-tablet"
                      onClick={() => handleSaveAsDraft(each)}
                      disabled={
                        (each?.answer?.length !== 0 ? false : true) &&
                        !isAnswerSelected
                      }
                      loading={draftLoader}
                    >
                      {i18n.t("button.saveAsDraft")}
                    </Button>
                  )}
                  <Button
                    onClick={handleTeamMemberFeedback}
                    className="draft-button"
                    loading={proceedLoader}
                  >
                    {i18n.t("button.yesProceed")}
                  </Button>
                  {surveyDetails?.Survey?.status !== "publish" && (
                    <Button
                      type="primary"
                      onClick={handleSubmit}
                      loading={submitLoader}
                      className="active-button"
                    >
                      {i18n.t("button.noSubmit")}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="draft-submit-btns">
                  {surveyDetails?.Survey?.status !== "publish" && (
                    <Button
                      className={
                        (each?.answer?.length && each?.answer?.length) ||
                        isAnswerSelected
                          ? "draft-button"
                          : "draft-button disabled-button"
                      }
                      disabled={
                        (each?.answer?.length === 0 ||
                        each?.answer?.length === undefined
                          ? true
                          : false) && isAnswerSelected === false
                          ? true
                          : false
                      }
                      onClick={() => handleSaveAsDraft(each)}
                    >
                      {i18n.t("button.saveAsDraft")}
                    </Button>
                  )}
                  <Button
                    type="primary"
                    onClick={() => nextStep(each)}
                    className={
                      (each?.answer?.length && each?.answer?.length) ||
                      isAnswerSelected
                        ? "active-button"
                        : "active-button disabled-button"
                    }
                    disabled={
                      (each?.answer?.length === 0 ||
                      each?.answer?.length === undefined
                        ? true
                        : false) && isAnswerSelected === false
                        ? true
                        : false
                    }
                  >
                    <span> {i18n.t("button.next")}</span>
                    <GoArrowRight className="arrow-icon" />
                  </Button>
                </div>
              )}
            </Row>
          </>
        ),
      };
    });
  };
  const steps = dynamicSteps(
    surveyDetails?.Survey?.survey_answers.sort((a, b) => {
      return a.ID - b.ID;
    }),
  );

  return (
    <div className="wizard-wrapper">
      <Wizard
        currentStep={currentStep}
        steps={steps}
        notify={notify}
        prevStep={prevStep}
        handleCancel={handleCancel}
        message={message}
      />
      <WizardProgressBar currentStep={currentStep} steps={steps} />
    </div>
  );
};
