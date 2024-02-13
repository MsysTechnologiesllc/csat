import React, { useEffect, useState } from "react";
import { plLibComponents } from "../../../context-provider/component-provider";
import { SurveyQuestionList } from "../../../components/survey-questions-list/survey-questions-list";
import { TeamMembersFeedBack } from "../../../components/team-members-feedback/team-members-feedback";
import { PreviewSettings } from "./preview-settings";
import { GetService } from "../../../services/get";
import i18n from "../../../locales/i18next";
import "./preview-survey.scss";
import { useLocation, useNavigate } from "react-router";
import { Breadcrumb } from "antd";

export const PreviewSurvey = () => {
  const navigate = useNavigate();
  const { NavTabs } = plLibComponents.components;
  const [surveyDetails, setSurveyDetails] = useState({});
  const [breadcrumbList, setBreadcrumbList] = useState([]);
  const { state } = useLocation();
  const handleBreadcrumb = () => {
    navigate("/accounts");
  };
  const handleProjectBreadCrumb = () => {
    navigate(`/accounts/projects/${state?.accountId}`, {
      state: {
        projectsList: state?.projectsList,
        accountName: state?.accountName,
      },
    });
  };
  useEffect(() => {
    let breadcrumbItems = [{ title: "Accounts", onClick: handleBreadcrumb }];
    new GetService().getPreviewSurvey(1, (result) => {
      if (result?.data?.data) {
        setSurveyDetails(result?.data?.data);
        breadcrumbItems.push({
          title: state?.accountName,
          onClick: handleProjectBreadCrumb,
        });
        breadcrumbItems.push({
          title: result?.data?.data?.Survey?.project?.name,
        });
      }
      setBreadcrumbList(breadcrumbItems);
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
      label: i18n.t("surveyDetails.settings"),
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
      <Breadcrumb items={breadcrumbList} />
      <NavTabs tabItems={items} />
    </div>
  );
};
