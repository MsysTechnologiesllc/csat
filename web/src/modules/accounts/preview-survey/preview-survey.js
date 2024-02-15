import React, { useEffect, useState } from "react";
import { plLibComponents } from "../../../context-provider/component-provider";
import { SurveyQuestionList } from "../../../components/survey-questions-list/survey-questions-list";
import { TeamMembersFeedBack } from "../../../components/team-members-feedback/team-members-feedback";
import { PreviewSettings } from "./preview-settings";
import i18n from "../../../locales/i18next";
import { useLocation, useNavigate } from "react-router";
import { Breadcrumb } from "antd";
import "./preview-survey.scss";

export const PreviewSurvey = () => {
  const navigate = useNavigate();
  const { NavTabs } = plLibComponents.components;
  const [breadcrumbList, setBreadcrumbList] = useState([]);
  const { state } = useLocation();
  const handleBreadcrumb = () => {
    navigate("/accounts");
  };
  const handleProjectBreadCrumb = () => {
    navigate(`/accounts/${state?.account_id}/projects`, {
      state: {
        projectsList: state?.projectsList,
        accountName: state?.accountName,
      },
    });
  };
  const handleSurveyFormat = () => {
    navigate(
      `/accounts/${state?.account_id}/projects/${state?.prjId}/formatlist`,
      {
        state: {
          accountName: state?.accountName,
          projectsList: state?.projectsList,
          projectName: state?.projectName,
          status: state?.status,
          prjId: state?.prjId,
        },
      },
    );
  };
  useEffect(() => {
    let breadcrumbItems = [
      { title: i18n.t("sidebar.accounts"), onClick: handleBreadcrumb },
    ];
    breadcrumbItems.push({
      title: state?.accountName,
      onClick: handleProjectBreadCrumb,
    });
    breadcrumbItems.push({
      title: state?.projectName,
      onClick: handleSurveyFormat,
    });
    breadcrumbItems.push({
      title: state?.surveyDetails?.Survey?.name,
    });
    setBreadcrumbList(breadcrumbItems);
  }, []);
  const items = [
    {
      key: "1",
      label: i18n.t("surveyDetails.survey"),
      children: (
        <SurveyQuestionList
          surveyQuestionDetails={state?.surveyDetails}
          isDisabled={false}
        />
      ),
    },
    {
      key: "2",
      label: i18n.t("surveyDetails.feedback"),
      children: (
        <TeamMembersFeedBack
          surveyDetails={state?.surveyDetails}
          status={state?.status}
        />
      ),
    },
    {
      key: "3",
      label: i18n.t("surveyDetails.settings"),
      children: (
        <PreviewSettings
          userFeedback={state?.surveyDetails?.Survey?.user_feedbacks}
          surveyDetails={state?.surveyDetails}
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
