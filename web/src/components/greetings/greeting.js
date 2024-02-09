import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate, useParams } from "react-router";
import i18n from "../../locales/i18next";
import { DaysAdded } from "../../utils/utils";
import { GetService } from "../../services/get";
import "./greetings.scss";

function GreetingsPage() {
  const navigate = useNavigate();
  const { survey_id } = useParams();
  const [surveyDetails, setSurveyDetails] = useState({});
  useEffect(() => {
    if (survey_id) {
      new GetService().getSurveyDetails(survey_id, (result) => {
        if (result?.data?.data) {
          setSurveyDetails(result?.data?.data);
        }
      });
    }
  }, [survey_id]);
  const getStarted = (id) => {
    navigate(`/survey/${id}`, {
      state: { surveyDetails: surveyDetails },
    });
  };
  return (
    <div className="greetings-container">
      <div className="greetings-main-container">
        <div className="greetings-image-container">
          <img
            src="/images/greetings-image.svg"
            alt={i18n.t("greetings.altText")}
            className="greetings-image"
          />
        </div>
        <div className="greetings-description">
          <h1 className="greetings-title">
            {surveyDetails?.SurveyFormat?.title}
          </h1>
          <p className="greetings-desc">
            {surveyDetails?.SurveyFormat?.message}
          </p>
        </div>
      </div>
      <div className="details-container">
        <div className="project-details-container">
          <div span={4} className="details">
            <p className="title">{i18n.t("greetings.project")}</p>
            <p className="desc">{surveyDetails?.Survey?.project?.name}</p>
          </div>
          <div span={4} className="details">
            <p className="title">{i18n.t("greetings.projectManager")}</p>
            <p className="desc">{surveyDetails?.SurveyFormat?.PM_name}</p>
          </div>
          <div span={4} className="details">
            <p className="title">{i18n.t("greetings.deliveryHead")}</p>
            <p className="desc">{surveyDetails?.SurveyFormat?.DH_name}</p>
          </div>
          <div span={4} className="details">
            <p className="title">{i18n.t("greetings.shareBefore")}</p>
            <p className="desc">
              {DaysAdded(surveyDetails?.SurveyFormat?.survey_frequency_days)}
            </p>
          </div>
        </div>

        <Button
          className="active-button"
          onClick={() => getStarted(surveyDetails?.Survey?.ID)}
        >
          {i18n.t("greetings.getStarted")}
        </Button>
      </div>
    </div>
  );
}

export default GreetingsPage;
