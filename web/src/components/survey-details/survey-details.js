import React, { useEffect, useState } from "react";
import { Button, Col, Progress, Row, Breadcrumb } from "antd";
import { plLibComponents } from "../../context-provider/component-provider";
import { GetService } from "../../services/get";
// import { MdTimer } from "react-icons/md";
import moment from "moment";
import { SurveyQuestionList } from "../survey-questions-list/survey-questions-list";
import { TeamMembersFeedBack } from "../team-members-feedback/team-members-feedback";
import i18n from "../../locales/i18next";
import "./survey-details.scss";
import { useLocation, useNavigate } from "react-router";

export const SurveyDetails = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const survey_id = params.get("survey_id");
  const navigate = useNavigate();
  const { NavTabs } = plLibComponents.components;
  const [surveyDetails, setSurveyDetails] = useState({});
  const [list, setList] = useState([]);

  useEffect(() => {
    const breadItems = [
      { title: i18n.t("surveyList.surveys"), onClick: handleBreadCrumb },
    ];
    new GetService().getManagerSurveyDetails(survey_id, (result) => {
      if (result?.data?.data) {
        setSurveyDetails(result?.data?.data);
        breadItems.push({
          title: result?.data?.data?.Survey?.project?.name,
        });
        breadItems.push({
          title: result?.data?.data?.Survey?.name,
        });
      }
    });
    setList(breadItems);
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
      children: <TeamMembersFeedBack surveyId={survey_id} />,
    },
  ];
  const handleBack = () => {
    navigate("/surveys");
  };
  const handleBreadCrumb = () => {
    navigate("/surveys");
  };
  return (
    <div className="survey-details-container">
      <Breadcrumb items={list} onClick={handleBreadCrumb} />
      <h1 className="survey-details-title">
        {i18n.t("surveyDetails.surveyDetails")}
      </h1>
      <Row className="details-progress-avg-container">
        <Col sm={24} xl={16} className="details-container">
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
        <Col xs={24} xl={7} className="progress-container">
          <Progress
            type="circle"
            percent={(4.2 / 5) * 100}
            format={() => surveyDetails?.AverageRating}
          />
          <p className="score">{i18n.t("surveyDetails.score")}</p>
        </Col>
        {/* <Col xs={11} md={14} xl={5} className="avg-time-container">
          <MdTimer className="time-icon" />
          <p className="hrs">4.2 {i18n.t("surveyDetails.hrs")}</p>
          <p className="avg-time">{i18n.t("surveyDetails.avgTime")}</p>
        </Col> */}
      </Row>
      <NavTabs tabItems={items} defaultOpenTabKey="" />
      <div className="back-btn-container">
        <Button type="text" className="back-btn" onClick={handleBack}>
          {i18n.t("button.back")}
        </Button>
      </div>
    </div>
  );
};
