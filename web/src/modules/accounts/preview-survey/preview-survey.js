import React, { useEffect, useState } from "react";
import { plLibComponents } from "../../../context-provider/component-provider";
import { SurveyQuestionList } from "../../../components/survey-questions-list/survey-questions-list";
import { TeamMembersFeedBack } from "../../../components/team-members-feedback/team-members-feedback";
import { PreviewSettings } from "./preview-settings";
import { GetService } from "../../../services/get";
import i18n from "../../../locales/i18next";
import "./preview-survey.scss";

export const PreviewSurvey = () => {
  const { NavTabs } = plLibComponents.components;
  const [surveyDetails, setSurveyDetails] = useState({});
  useEffect(() => {
    new GetService().getPreviewSurvey(1, (result) => {
      if (result?.data?.data) {
        setSurveyDetails(result?.data?.data);
      }
    });
  }, []);
  const items = [
    {
      key: "1",
      label: i18n.t("surveyDetails.survey"),
      children: (
        <SurveyQuestionList
          surveyQuestionDetails={surveyDetails}
          isDisabled={false}
        />
      ),
    },
    {
      key: "2",
      label: i18n.t("surveyDetails.feedback"),
      children: <TeamMembersFeedBack surveyId={surveyDetails?.Survey?.ID} />,
    },
    {
      key: "3",
      label: "Settings",
      children: (
        <PreviewSettings
          userFeedback={surveyDetails?.Survey?.user_feedbacks}
          surveyDetails={surveyDetails}
        />
      ),
    },
  ];
  return (
    <div className="preview-container">
      <NavTabs tabItems={items} />
    </div>
  );
};
