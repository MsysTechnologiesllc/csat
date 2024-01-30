import React, { useEffect } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router";
import "./greetings.scss";
import i18n from "../../locales/i18next";
import { surveyDetails } from "../../stub-data/survey-details";
import { DaysAdded } from "../../utils/utils";

function GreetingsPage() {
  const navigate = useNavigate();
  const getStarted = () => {
    navigate("/survey");
  };

  // console.log(DaysAdded(7));

  useEffect(() => {
    console.log(surveyDetails);
  });
  return (
    <div className="greetings-container">
      <div className="greetings-main-container">
        <div className="greetings-image-container">
          <img
            src="images/greetings-image.svg"
            alt="greetings-image"
            className="greetings-image"
          />
        </div>
        <div className="greetings-description">
          <h1 className="greetings-title">
            {surveyDetails.SurveyFormat.title}
          </h1>
          <p className="greetings-desc">{surveyDetails.SurveyFormat.message}</p>
        </div>
      </div>
      <div className="details-container">
        <div className="project-details-container">
          <div span={4} className="details">
            <p className="title">{i18n.t("greetings.project")}</p>
            <p className="desc">{surveyDetails.Survey.project.name}</p>
          </div>
          <div span={4} className="details">
            <p className="title">{i18n.t("greetings.projectManager")}</p>
            <p className="desc">{surveyDetails.SurveyFormat.PM_name}</p>
          </div>
          <div span={4} className="details">
            <p className="title">{i18n.t("greetings.deliveryHead")}</p>
            <p className="desc">{surveyDetails.SurveyFormat.DH_name}</p>
          </div>
          <div span={4} className="details">
            <p className="title">{i18n.t("greetings.shareBefore")}</p>
            <p className="desc">
              {DaysAdded(surveyDetails.SurveyFormat.survey_frequency_days)}
            </p>
          </div>
        </div>

        <Button className="active-button" onClick={getStarted}>
          {i18n.t("greetings.getStarted")}
        </Button>
      </div>
    </div>
  );
}

export default GreetingsPage;
