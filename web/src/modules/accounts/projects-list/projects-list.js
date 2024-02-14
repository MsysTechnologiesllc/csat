import { Breadcrumb, Button, Card, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import i18n from "../../../locales/i18next";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import "./projects-list.scss";
import { useLocation, useNavigate, useParams } from "react-router";
import { NoOfDays } from "../../../utils/utils";

export const ProjectsList = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [breadcrumbList, setBreadcrumbList] = useState([]);

  const handleView = (project) => {
    navigate(`/accounts/previewSurvey/${project.ID}`, {
      state: {
        accountName: state?.accountName,
        accountId: accountId,
        projectsList: state?.projectsList,
        status: true,
      },
    });
  };
  const handleBreadCrumb = () => {
    navigate("/accounts");
  };

  useEffect(() => {
    let breadcrumbItems = [
      { title: i18n.t("sidebar.accounts"), onClick: handleBreadCrumb },
    ];
    if (state?.accountName) {
      breadcrumbItems.push({
        title: state?.accountName,
      });
    }
    setBreadcrumbList(breadcrumbItems);
  }, [state?.accountName]);

  return (
    <div className="projects-list-wrapper">
      <Breadcrumb items={breadcrumbList} onClick={handleBreadCrumb} />
      <h1 className="project-title">{i18n.t("greetings.project")}</h1>
      <div className="context-wrapper">
        <IoMdInformationCircleOutline className="info-icon" />
        <p className="context">
          {i18n.t("accounts.description")}
          <a href="/surveys" target="_self" className="survey-anchor">
            {i18n.t("accounts.surveys")}
          </a>
        </p>
      </div>
      <Row gutter={[20, 20]} className="project-list-wrapper">
        {state?.projectsList?.map((project) => {
          const prjManager = project?.Users?.filter(
            (user) => user.role === "projectManager",
          );
          const teamMembers = project?.Users?.filter(
            (user) => user.role === "user",
          );
          return (
            <Col xs={24} md={12} lg={8} xxl={6} key={project.ID}>
              <Card className="project-wrapper">
                <div className="project-client-context-day-container">
                  <div className="avatar-project-client-context-container">
                    <p className="avatar">
                      {`${project.name
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase())
                        .join("")}`}
                    </p>
                    <div className="project-client-container">
                      <h4 className="project-name">{project.name}</h4>
                      <p className="client-name">{prjManager[0]?.name}</p>
                    </div>
                  </div>
                  <div className="day-left-container">
                    <GoDotFill className="dot-icon" />
                    <p className="days-left-context">
                      {i18n.t("projects.daysLeft", {
                        days:
                          NoOfDays(project?.end_date) > 0
                            ? NoOfDays(project?.end_date)
                            : 0,
                      })}
                    </p>
                  </div>
                </div>
                <div className="team-view-container">
                  <p className="team-members-context">{`${teamMembers?.length} Members(s)`}</p>
                  <Button
                    className="view-button"
                    type="text"
                    onClick={() => handleView(project)}
                  >
                    {i18n.t("accounts.view")}
                  </Button>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};
