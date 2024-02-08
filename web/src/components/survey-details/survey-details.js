import React, { useEffect, useState } from "react";
import { Col, Progress, Row } from "antd";
import { plLibComponents } from "../../context-provider/component-provider";
import { GetService } from "../../services/get";
import { MdTimer } from "react-icons/md";
import moment from "moment";
import { SurveyQuestionList } from "../survey-questions-list/survey-questions-list";
import { TeamMembersFeedBack } from "../team-members-feedback/team-members-feedback";
import i18n from "../../locales/i18next";
import "./survey-details.scss";

export const SurveyDetails = () => {
  const { NavTabs } = plLibComponents.components;
  const [surveyDetails, setSurveyDetails] = useState({});
  useEffect(() => {
    new GetService().getSurveyDetails(9, (result) => {
      if (result?.data?.data) {
        setSurveyDetails(result?.data?.data);
      }
    });
  }, []);
  const items = [
    {
      key: "1",
      label: i18n.t("surveyDetails.survey"),
      children: <SurveyQuestionList surveyQuestionDetails={surveyDetails} />,
    },
    {
      key: "2",
      label: i18n.t("surveyDetails.feedback"),
      children: <TeamMembersFeedBack />,
    },
  ];
  return (
    <div className="survey-details-container">
      <h1 className="survey-details-title">
        {i18n.t("surveyDetails.surveyDetails")}
      </h1>
      <Row className="details-progress-avg-container">
        <Col sm={24} xl={14} className="details-container">
          <div className="details">
            <p className="details-name">{i18n.t("surveyDetails.name")}</p>
            <p className="details-name-data">{surveyDetails?.Survey?.name}</p>
          </div>
          <div className="details">
            <p className="details-name">{i18n.t("surveyDetails.completion")}</p>
            <p className="details-name-data">
              {moment(surveyDetails?.Survey?.updatedAt).format("DD MMM YYYY")}
            </p>
          </div>
          <div className="details">
            <p className="details-name">{i18n.t("surveyDetails.contact")}</p>
            <p className="details-name-data">
              {surveyDetails?.SurveyFormat?.PM_name} (
              {surveyDetails?.SurveyFormat?.PM_email})
            </p>
          </div>
        </Col>
        <Col xs={11} md={9} xl={4} className="progress-container">
          <Progress
            type="circle"
            percent={(4.2 / 5) * 100}
            format={() => 4.2}
          />
          <p className="score">Score</p>
        </Col>
        <Col xs={11} md={14} xl={5} className="avg-time-container">
          <MdTimer className="time-icon" />
          <p className="hrs">4.2 Hrs</p>
          <p className="avg-time">Average Response Time</p>
        </Col>
      </Row>
      <NavTabs tabItems={items} defaultOpenTabKey="" />
    </div>
  );
};
