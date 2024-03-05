import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Modal,
  Pagination,
  Row,
  Segmented,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import i18n from "../../../locales/i18next";
// import { IoMdInformationCircleOutline } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import "./projects-list.scss";
import {
  AppstoreOutlined,
  BarsOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router";
import { NoOfDays } from "../../../utils/utils";

export const ProjectsList = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [breadcrumbList, setBreadcrumbList] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState("Grid");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      }
    );
  };
  const handleBreadCrumb = () => {
    navigate("/accounts");
  };
  const addNewAccount = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
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
  const columns = [
    {
      title: "Project",
      dataIndex: "projectName",
      key: "projectName",
    },
    {
      title: "Project Owner",
      dataIndex: "projectOwner",
      key: "projectOwner",
    },
    {
      title: "Members",
      dataIndex: "members",
      key: "members",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: () => (
        <div>
          <EditOutlined className="edit" />
          <DeleteOutlined className="delete" />
        </div>
      ),
    },
  ];
  const data = [];
  state?.projectsList?.map((project, index) => {
    const prjManager = project?.Users?.filter(
      (user) => user.role === "projectManager"
    );
    const teamMembers = project?.Users?.filter(
      (user) => user.role === "member"
    );
    data.push({
      key: index + 1,
      projectName: project?.name,
      projectOwner: prjManager[0]?.name,
      members: `${teamMembers?.length} Member(s)`,
    });
  });
  return (
    <div className="projects-list-wrapper">
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      ></Modal>
      <Breadcrumb items={breadcrumbList} onClick={handleBreadCrumb} />
      <div className="account-header-container">
        <h1 className="project-title">{state?.accountName}</h1>
        <div className="actions-container">
          <Segmented
            options={[
              {
                value: "Grid",
                icon: <AppstoreOutlined />,
              },
              {
                value: "List",
                icon: <BarsOutlined />,
              },
            ]}
            onChange={(value) => {
              setSelectedSegment(value);
            }}
          />
          <Button onClick={addNewAccount} className="add-account-button">
            {i18n.t("addAccount.addBtn")}
          </Button>
        </div>
      </div>
      {/* <div className="context-wrapper">
        <IoMdInformationCircleOutline className="info-icon" />
        <p className="context">
          {i18n.t("accounts.description")}
          <a href="/surveys" target="_self" className="survey-anchor">
            {i18n.t("accounts.surveys")}
          </a>
        </p>
      </div> */}
      {selectedSegment === "Grid" ? (
        <Row gutter={[20, 20]} className="project-list-wrapper">
          {state?.projectsList?.map((project) => {
            const prjManager = project?.Users?.filter(
              (user) => user.role === "projectManager"
            );
            const teamMembers = project?.Users?.filter(
              (user) => user.role === "member"
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
                        <h4 className="project-name">{project?.name}</h4>
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
      ) : (
        <div className="accounts-list-container">
          <Table columns={columns} dataSource={data} pagination={false} />
          <Pagination
            total={data?.length}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Total ${total} items`}
            className="pagination"
          />
        </div>
      )}
    </div>
  );
};
