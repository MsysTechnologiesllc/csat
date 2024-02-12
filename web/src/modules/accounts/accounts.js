import { Breadcrumb, Button, Card, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import i18n from "../../locales/i18next";
import { GetService } from "../../services/get";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import "./accounts.scss";
import { projectsData } from "../../stub-data/project-list";
import { useNavigate } from "react-router";

export const Accounts = () => {
  const navigate = useNavigate();
  const [breadrumbList, setBreadcrumbList] = useState([]);
  const survey_id = 57;

  const handleView = () => {
    navigate("/accounts/previewSurvey/:surveyId");
  };

  let breadcrumbItems = [{ title: "Accounts" }];

  useEffect(() => {
    new GetService().getSurveyDetails(survey_id, (result) => {
      if (result?.data?.data) {
        breadcrumbItems.push({
          title: result?.data?.data?.Survey?.project?.name,
        });
      }
    });
    setBreadcrumbList(breadcrumbItems);
  }, [survey_id]);
  return (
    <div className="accounts-wrapper">
      <Breadcrumb items={breadrumbList} />
      <h1 className="project-title">{i18n.t("greetings.project")}</h1>
      <div className="context-wrapper">
        <IoMdInformationCircleOutline className="info-icon" />
        <p className="context">
          Only projects for which the surveys are pending for this month are
          displayed. To view all surveys, please go to
          <a href="/surveys" target="_self" className="survey-anchor">
            Surveys.
          </a>
        </p>
      </div>
      <Row gutter={[20, 20]} className="project-list-wrapper">
        {projectsData.map((project) => (
          <Col span={8} key={project.id}>
            <Card className="project-wrapper">
              <div className="project-client-context-day-container">
                <div className="avatar-project-client-context-container">
                  <p className="avatar">
                    {`${project.prjName[0]}${project.prjName.slice(-1)}`}
                  </p>
                  <div className="project-client-container">
                    <h4 className="project-name">{project.prjName}</h4>
                    <p className="client-name">{project.clientName}</p>
                  </div>
                </div>
                <div className="day-left-container">
                  <GoDotFill className="dot-icon" />
                  <p className="days-left-context">
                    {i18n.t("projects.daysLeft", {
                      days: project.survey_frequency_days,
                    })}
                  </p>
                </div>
              </div>
              <div className="team-view-container">
                <p className="team-members-context">{`${project.teamMembers} Members(s)`}</p>
                <Button
                  className="view-button"
                  type="text"
                  onClick={handleView}
                >
                  VIEW
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
