import { Breadcrumb, Button, Card, Col, Modal, Popover, Row } from "antd";
import React, { useEffect, useState } from "react";
import i18n from "../../../locales/i18next";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import "./projects-list.scss";
import { useLocation, useNavigate } from "react-router";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineExclamationCircle,
} from "react-icons/ai";
import { NoOfDays } from "../../../utils/utils";

export const ProjectsList = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [breadcrumbList, setBreadcrumbList] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isId, setIsId] = useState("");
  const [isPopover, setIsPopover] = useState(false);
  const [popId, setPopId] = useState("");
  const handleOnOpenChange = (id) => {
    if (id !== popId) {
      setPopId(id);
      setIsPopover(true);
    }
  };
  const handleonCancel = () => {
    setDeleteModal(false);
  };
  const handleonOk = () => {
    setDeleteModal(false);
  };
  const handleOnClickMore = (option, id) => {
    if (option === "Delete" && isId !== id) {
      setDeleteModal(true);
      setIsId(id);
      setIsPopover(false);
    }
  };
  const handleView = (project) => {
    navigate(
      `/accounts/${state?.accountId}/projects/${project?.ID}/formatlist`,
      {
        state: {
          prjId: project?.ID,
          accountName: state?.accountName,
          accountId: state?.accountId,
          projectsList: state?.projectsList,
          projectName: project?.name,
          status: true,
        },
      },
    );
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
    <>
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
              (user) => user.role === "member",
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
                    <Popover
                      content={
                        <div className="more-options">
                          <span
                            onClick={(event) => {
                              event.stopPropagation();
                              handleOnClickMore("Edit");
                            }}
                          >
                            <AiOutlineEdit className="icon" />
                            {i18n.t("common.edit")}
                          </span>
                          <span
                            onClick={(event) => {
                              event.stopPropagation();
                              handleOnClickMore("Delete", project.ID);
                            }}
                          >
                            <AiOutlineDelete className="icon" />
                            {i18n.t("common.delete")}
                          </span>
                        </div>
                      }
                      trigger="click"
                      arrow={false}
                      placement="bottomRight"
                      overlayStyle={{ padding: 0 }}
                      open={popId === project.ID && isPopover}
                      onOpenChange={() => handleOnOpenChange(project.ID)}
                    >
                      <div
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                        className="more-option-icon"
                      >
                        <img
                          src="/images/ellipse-vertical.svg"
                          alt={i18n.t("common.moreOptions")}
                        />
                      </div>
                    </Popover>
                    {isId === project.ID && (
                      <Modal
                        open={deleteModal}
                        closable={false}
                        okText="Delete"
                        onCancel={handleonCancel}
                        onOk={handleonOk}
                        className="modal"
                        centered
                      >
                        <div className="model-content-container">
                          <AiOutlineExclamationCircle className="excalamation-icon" />
                          <div className="content-wrapper">
                            <h3 className="title">
                              {i18n.t("deleteModal.projectsTitle", {
                                projectName: project.name,
                              })}
                            </h3>
                            <p className="context">
                              {i18n.t("deleteModal.context")}
                            </p>
                          </div>
                        </div>
                      </Modal>
                    )}
                  </div>
                  <div className="team-view-container">
                    <p className="team-members-context">{`${teamMembers?.length} Member(s)`}</p>
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
    </>
  );
};
