import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Col,
  Row,
  Table,
  Tooltip,
  Modal,
  Avatar,
} from "antd";
import { TableShimmer } from "../../../components/table-shimmer/table-shimmer";
import i18n from "../../../locales/i18next";
import "./format-list.scss";
import { GetService } from "../../../services/get";
import { useLocation, useNavigate } from "react-router";
import { AddProjectMembersAndStakeholders } from "./add-stakeholders-project-members";

const FormatList = ({}) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [data, setData] = useState([]);
  const [breadcrumbList, setBreadcrumbList] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  console.log(userSearch);
  const handleAccounts = () => {
    navigate("/accounts");
  };
  const handleProjectsList = () => {
    navigate(`/accounts/${state?.accountId}/projects`, {
      state: {
        accountName: state?.accountName,
        projectsList: state?.projectsList,
        accountId: state?.accountId,
        tenantId: state?.tenantId,
      },
    });
  };
  useEffect(() => {
    new GetService().getSurveyFormatList(state?.accountId, (result) => {
      if (result) {
        setData(result?.data?.data);
      }
    });
    let breadcrumbItems = [
      { title: i18n.t("sidebar.accounts"), onClick: handleAccounts },
    ];
    breadcrumbItems.push({
      title: state?.accountName,
      onClick: handleProjectsList,
    });
    breadcrumbItems.push({
      title: state?.projectName,
    });
    setBreadcrumbList(breadcrumbItems);
  }, []);
  let isDataLoaded = true;
  const getRowClassName = (index) => {
    return index % 2 === 0 ? "even-row" : "odd-row";
  };
  const columnsData = [
    {
      title: i18n.t("surveyDetails.name"),
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: i18n.t("greetings.projectManager"),
      dataIndex: "PM_name",
      key: "PM_name",
      ellipsis: true,
    },
    {
      title: i18n.t("greetings.deliveryHeadName"),
      dataIndex: "DH_name",
      key: "DH_name",
      ellipsis: true,
    },
    {
      title: i18n.t("greetings.frequency"),
      dataIndex: "survey_frequency_days",
      key: "survey_frequency_days",
    },
    {
      title: i18n.t("surveyList.action"),
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <div className="action-svg">
          <Tooltip title={i18n.t("surveyList.viewSurvey")}>
            <img
              src="/images/eye-privacy.svg"
              onClick={() => handleRowClick(record)}
              alt={i18n.t("surveyList.action")}
              className={"action-avatar"}
            />
          </Tooltip>
        </div>
      ),
    },
  ];
  const customLocale = {
    emptyText: (
      <div className="no-data">
        <img
          src="/images/No-Data-table.svg"
          alt={i18n.t("surveyList.noData")}
        />
        <p>{i18n.t("surveyList.noData")}</p>
      </div>
    ),
  };
  const modifiedTableData = data?.map((item) => ({
    ...item,
    key: item.ID,
  }));
  const handleRowClick = (record) => {
    navigate(
      `/accounts/${record?.account_id}/projects/${state?.prjId}/formatlist/previewSurvey`,
      {
        state: {
          accountName: state?.accountName,
          account_id: record?.account_id,
          projectsList: state?.projectsList,
          projectName: state?.projectName,
          status: state?.status,
          prjId: state?.prjId,
          surveyDetails: { Survey: record.surveys[0] },
        },
      },
    );
  };
  function createSurvey() {
    // TODO
  }
  const [isModalOpen, setIsModalOpen] = useState("");
  const showModal = (role) => {
    setIsModalOpen(role);
    console.log(role);
    // TODO
  };
  const handleOk = () => {
    setIsModalOpen("");
  };
  const handleCancel = () => {
    setIsModalOpen("");
  };
  let datas = [
    {
      name: "Sandep",
    },
    {
      name: "Sandep",
    },
    {
      name: "Sandep",
    },
    {
      name: "Sandep",
    },
    {
      name: "Sandep",
    },
    {
      name: "Sandep",
    },
    {
      name: "Sandep",
    },
    {
      name: "Sandep",
    },
  ];
  return (
    <div className="survey-home-container">
      <Breadcrumb items={breadcrumbList} />
      <div className="survey-header-container">
        <h3 className="survey-heading">{i18n.t("prjOverview.prjOverview")}</h3>
        <Button onClick={createSurvey} className="crete-survey-btn">
          {i18n.t("prjOverview.createSurvey")}
        </Button>
      </div>

      <div className="prj-overview-top-section">
        <Row className="main-row">
          <Col span={24} md={4}>
            <div className="overview-sections">
              <div className="accounts-avatar-container">
                <Avatar></Avatar>
                <h5 className="acc-name">VA Launch pad</h5>
              </div>
              <div className="accounts-details-container">
                <div className="acc-owner-container">
                  <h5 className="acc-owner-label">Account owner</h5>
                  <p className="detail">Anand jain</p>
                </div>
                <div className="acc-owner-container">
                  <h5 className="acc-owner-label">SOW Start Date</h5>
                  <p className="detail">17/03/2021</p>
                </div>
              </div>
            </div>
          </Col>
          <Col span={24} md={6}>
            <div className="overview-sections stackholders">
              <div className="stackholders-container">
                <div className="label-avatar-container">
                  <h5 className="label">Stakeholders</h5>
                  <Avatar.Group
                    className="avatar-group"
                    maxCount={5}
                    maxPopoverTrigger="click"
                    maxStyle={{
                      color: "#f56a00",
                      backgroundColor: "#fde3cf",
                      cursor: "pointer",
                    }}
                  >
                    {datas.map(({ name }) => (
                      <Tooltip title={name} placement="top" key={name}>
                        <Avatar
                          style={{
                            color: "#f56a00",
                            backgroundColor: "#fde3cf",
                            cursor: "pointer",
                          }}
                        >
                          {name && name.charAt(0)}
                        </Avatar>
                      </Tooltip>
                    ))}
                  </Avatar.Group>
                </div>
                <Button
                  type="text"
                  className="add-btn"
                  onClick={() => showModal("stakeholders")}
                >
                  {i18n.t("prjOverview.add")}
                </Button>
              </div>
              <div className="stackholders-container">
                <div className="label-avatar-container">
                  <h5 className="label">Project Members</h5>
                  <Avatar.Group
                    className="avatar-group"
                    maxCount={5}
                    maxPopoverTrigger="click"
                    maxStyle={{
                      color: "#f56a00",
                      backgroundColor: "#fde3cf",
                      cursor: "pointer",
                    }}
                  >
                    {datas.map(({ name }) => (
                      <Tooltip title={name} placement="top" key={name}>
                        <Avatar
                          style={{
                            color: "#f56a00",
                            backgroundColor: "#fde3cf",
                            cursor: "pointer",
                          }}
                        >
                          {name && name.charAt(0)}
                        </Avatar>
                      </Tooltip>
                    ))}
                  </Avatar.Group>
                </div>
                <Button
                  type="text"
                  className="add-btn"
                  onClick={() => showModal("projectMembers")}
                >
                  {i18n.t("prjOverview.add")}
                </Button>
              </div>
              <Modal
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
                className="project-member-stakeholder-modal"
                width={800}
              >
                <AddProjectMembersAndStakeholders
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  setUserSearch={setUserSearch}
                  userSearch={userSearch}
                />
              </Modal>
            </div>
          </Col>
          <Col span={24} md={4}>
            <div className="overview-sections">TODO</div>
          </Col>
          <Col
            span={24}
            md={9}
            className="overview-sections rating-and-surveys"
          >
            <Row span={24} className="overview-rows">
              TODO
            </Row>
            <Row span={24} className="overview-rows">
              TODO
            </Row>
          </Col>
        </Row>
      </div>

      <div className="survey-list-container">
        <Table
          locale={isDataLoaded && data?.length > 0 ? null : customLocale}
          loading={isDataLoaded === false && <TableShimmer row={5} col={5} />}
          size="small"
          dataSource={modifiedTableData}
          columns={columnsData}
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
          }}
          rowKey="key"
          scroll={{ y: 300, x: true }}
          rowClassName={getRowClassName}
          className="custom-scrollbar-table-format"
        />
      </div>
    </div>
  );
};

export default FormatList;
