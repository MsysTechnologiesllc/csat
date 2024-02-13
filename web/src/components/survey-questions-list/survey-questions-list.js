import React from "react";
import { Collapse, Radio, Rate, Input } from "antd";
import PropTypes from "prop-types";
import { LineOutlined } from "@ant-design/icons";
import { IoStarSharp } from "react-icons/io5";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import "./survey-questions-list.scss";
import i18n from "../../locales/i18next";

export const SurveyQuestionList = ({ surveyQuestionDetails }) => {
  const { TextArea } = Input;
  const { Panel } = Collapse;
  const questionsList = surveyQuestionDetails?.Survey?.survey_answers.sort(
    (a, b) => {
      return a.ID - b.ID;
    },
  );
  const CustomPanelHeader = ({ description, type }) => (
    <div className="details-desc-type">
      <p className="details-description">{description} *</p>
      <p className="details-type">
        {i18n.t("surveyDetails.optionType")}: <span>{type}</span>
      </p>
    </div>
  );
  const customIcons = Array.from({ length: 5 }, (_, index) => (
    <LineOutlined key={index} className="rating-icon" />
  ));
  const customStarIcons = Array.from({ length: 5 }, (_, index) => (
    <IoStarSharp key={index} className="rating-icon" />
  ));
  const getValueForType = (option, type) => {
    switch (type) {
      case "emoji-options":
        return Object.values(option)[0] === "Very Low"
          ? "very-low"
          : Object.values(option)[0] === "Low"
            ? "low"
            : Object.values(option)[0] === "Average"
              ? "avg"
              : Object.values(option)[0] === "High"
                ? "high"
                : "very-high";
      case "boolean":
        return Object.values(option)[0];
      case "gauge-options":
        return Object.values(option)[0] === "Very Low"
          ? "very-low-scale"
          : Object.values(option)[0] === "Low"
            ? "low-scale"
            : Object.values(option)[0] === "Average"
              ? "avg-scale"
              : Object.values(option)[0] === "High"
                ? "high-scale"
                : "very-high-scale";
      default:
        return "";
    }
  };
  return (
    <Collapse
      bordered={false}
      expandIcon={({ isActive }) => (
        <span className="icon-holder">
          {isActive ? (
            <p className="min-and-max">
              {i18n.t("surveyDetails.hide")} <IoMdArrowDropup />
            </p>
          ) : (
            <p className="min-and-max">
              {i18n.t("surveyDetails.show")} <IoMdArrowDropdown />
            </p>
          )}
        </span>
      )}
      expandIconPosition="end"
      className="survey-questions-container"
    >
      {questionsList?.map(
        ({ question, answer }, index) =>
          index !== questionsList.length - 1 && (
            <Panel
              header={
                <CustomPanelHeader
                  description={question?.description}
                  type={question?.type}
                />
              }
              key={index}
              className="each-panel"
            >
              <hr />
              {question?.type === "boolean" ||
              question?.type === "emoji-options" ||
              question?.type === "gauge-options" ? (
                <Radio.Group
                  name="radiogroup"
                  className="radio-group"
                  defaultValue={answer && JSON.parse(answer)[0].a}
                >
                  {JSON.parse(question.options).map((option, index) => (
                    <Radio
                      key={index}
                      value={getValueForType(option, question.type)}
                      disabled
                    >
                      {Object.values(option)[0]}
                    </Radio>
                  ))}
                </Radio.Group>
              ) : null}
              {question.type === "scale-rating" && (
                <div className="rating-scale-container">
                  <Rate
                    character={({ index = 0 }) => customIcons[index]}
                    defaultValue={answer && JSON.parse(answer).length}
                    disabled
                  />
                </div>
              )}
              {question.type === "star-rating" && (
                <Rate
                  character={({ index = 0 }) => customStarIcons[index]}
                  allowHalf
                  defaultValue={answer && JSON.parse(answer).length / 2}
                  disabled
                />
              )}
              {question.type === "textarea-feedback" && (
                <TextArea
                  defaultValue={answer && JSON.parse(answer)}
                  disabled
                />
              )}
            </Panel>
          ),
      )}
    </Collapse>
  );
};
SurveyQuestionList.propTypes = {
  surveyQuestionDetails: PropTypes.object.isRequired,
  description: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};
