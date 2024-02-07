import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import { plLibComponents } from "../../context-provider/component-provider";
import { GetService } from "../../services/get";
// import { MdTimer } from "react-icons/md";
import moment from "moment";
import { SurveyQuestionList } from "../survey-questions-list/survey-questions-list";
import { TeamMembersFeedBack } from "../team-members-feedback/team-members-feedback";
import "./survey-details.scss";
import i18n from "../../locales/i18next";

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
  console.log(surveyDetails);
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
      <Row>
        <Col span={15} className="details-container">
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
              {surveyDetails?.SurveyFormat?.PM_email}
            </p>
          </div>
        </Col>
        <Col span={3}></Col>
        <Col span={4}>{/* <MdTimer /> */}</Col>
      </Row>
      <NavTabs tabItems={items} defaultOpenTabKey="" />
    </div>
  );
};
