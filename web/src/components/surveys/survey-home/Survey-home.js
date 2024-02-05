import React from "react";
import "./Survey-home-styles.scss";
import SurveyHeader from "../../surveys/survey-header/Survey-header";
import SurveyList from "../survey-list/Survey-list";

const SurveyHome = () => {
  return (
    <div className="survey-home-container">
      <SurveyHeader />
      <SurveyList />
    </div>
  );
};

export default SurveyHome;
