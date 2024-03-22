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
  Rate,
  Divider,
} from "antd";
import { TableShimmer } from "../../../components/table-shimmer/table-shimmer";
import i18n from "../../../locales/i18next";
import "./format-list.scss";
import { GetService } from "../../../services/get";
import moment from "moment";
import { useLocation, useNavigate } from "react-router";

const FormatList = ({}) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [data, setData] = useState([]);
  const [breadcrumbList, setBreadcrumbList] = useState([]);
  const handleAccounts = () => {
    navigate("/accounts");
  };
  console.log(state);
  const handleProjectsList = () => {
    navigate(`/accounts/${state?.accountId}/projects`, {
      state: {
        accountName: state?.accountName,
        projectsList: state?.projectsList,
        accountId: state?.accountId,
        tenantId: state?.tenantId,
        prjId: state?.prjId,
      },
    });
  };
  useEffect(() => {
    new GetService().getSurveyFormatList(state?.accountId, (result) => {
      if (result) {
        setData(result?.data?.data);
        console.log(result?.data?.data);
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
      title: i18n.t("prjOverview.createdDate"),
      dataIndex: "CreatedAt",
      key: "CreatedAt",
      ellipsis: true,
      render: (text, record) =>
        moment(record.CreatedAt).format("DD MMM YYYY, HH:mm"),
    },
    {
      title: i18n.t("prjOverview.resDeadline"),
      dataIndex: "surveys.dead_line",
      key: "surveys.dead_line",
      ellipsis: true,
      render: (text, record) =>
        moment(record.surveys[0].dead_line).format("DD MMM YYYY, HH:mm"),
    },
    {
      title: i18n.t("surveyList.status"),
      dataIndex: "surveys.status",
      key: "surveys.status",
      render: (text, record) => record.surveys[0].status,
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
    // TODO
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [clientsData, setClientsData] = useState([]);
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    new GetService().getTeamList(state?.prjId, (result) => {
      if (result) {
        setClientsData(result.data.data.clients);
        setUsersData(result.data.data.users);
      }
    });
  }, []);
  const randomColors = [
    { bg_color: "#FAAD14", text_color: "#FFFFFF" },
    { bg_color: "#08979C", text_color: "#FFFFFF" },
    { bg_color: "#E9EBF7", text_color: "#3A49AC" },
    { bg_color: "#E6F7FF", text_color: "#3A49AC" },
    { bg_color: "#722ED1", text_color: "#FFFFFF" },
    { bg_color: "#E9EBF7", text_color: "#3A49AC" },
    { bg_color: "#FFF1F0", text_color: "#f5222d" },
    { bg_color: "#5B8C00", text_color: "#FFFFFF" },
    { bg_color: "#5B6ABF", text_color: "#FFFFFF" },
  ];
  function generateRandomColor() {
    return randomColors[Math.floor(Math.random() * randomColors.length)];
  }
  console.log(state?.accOwner);
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
          <Col span={24} md={8} xl={4}>
            <div className="overview-sections">
              <div className="accounts-avatar-container">
                <Avatar src={state?.prjLogo || null} className="prj-logo">
                  {!state?.prjLogo &&
                    state?.projectName.charAt(0).toUpperCase()}
                </Avatar>
                <h5 className="acc-name">{state?.projectName}</h5>
              </div>
              <div className="accounts-details-container">
                <div className="acc-owner-container">
                  <h5 className="acc-owner-label">
                    {i18n.t("addAccount.accOwner")}
                  </h5>
                  <p className="detail">{state?.accOwner}</p>
                </div>
                <div className="acc-owner-container">
                  <h5 className="acc-owner-label">
                    {i18n.t("prjOverview.sow")}
                  </h5>
                  <p className="detail">
                    {moment(state?.prjCreatedDate).format("DD/MM/YYYY")}
                  </p>
                </div>
              </div>
            </div>
          </Col>
          <Col span={24} md={8} xl={6}>
            <div className="overview-sections stackholders">
              <div className="stackholders-container">
                <div className="label-avatar-container">
                  <h5 className="label">
                    {i18n.t("prjOverview.stakeholders")}
                  </h5>
                  <Avatar.Group
                    className="avatar-group"
                    maxCount={5}
                    maxPopoverTrigger="hover"
                    maxStyle={{
                      color: "#f56a00",
                      backgroundColor: "#E9EBF7",
                      cursor: "pointer",
                    }}
                  >
                    {clientsData?.map(({ name, email }) => {
                      const randomColor = generateRandomColor();
                      return (
                        <Tooltip title={name} placement="top" key={email}>
                          <Avatar
                            maxPopoverTrigger="hover"
                            style={{
                              color: randomColor.text_color,
                              backgroundColor: randomColor.bg_color,
                              cursor: "pointer",
                            }}
                          >
                            {name && name.charAt(0).toUpperCase()}
                          </Avatar>
                        </Tooltip>
                      );
                    })}
                  </Avatar.Group>
                </div>

                <Button
                  type="text"
                  className="add-btn"
                  onClick={(role) => showModal(role)}
                >
                  {i18n.t("prjOverview.add")}
                </Button>
              </div>

              <div className="stackholders-container">
                <div className="label-avatar-container">
                  <h5 className="label">{i18n.t("prjOverview.prjMembers")}</h5>
                  <Avatar.Group
                    className="avatar-group"
                    maxCount={5}
                    maxPopoverTrigger="hover"
                    maxStyle={{
                      color: "#f56a00",
                      backgroundColor: "#E9EBF7",
                      cursor: "pointer",
                    }}
                  >
                    {usersData?.map(({ name, email }) => {
                      const randomColor = generateRandomColor();
                      return (
                        <Tooltip title={name} placement="top" key={email}>
                          <Avatar
                            maxPopoverTrigger="hover"
                            style={{
                              color: randomColor.text_color,
                              backgroundColor: randomColor.bg_color,
                              cursor: "pointer",
                            }}
                          >
                            {name && name.charAt(0)}
                          </Avatar>
                        </Tooltip>
                      );
                    })}
                  </Avatar.Group>
                </div>

                <Button
                  type="text"
                  className="add-btn"
                  onClick={(role) => showModal(role)}
                >
                  {i18n.t("prjOverview.add")}
                </Button>
              </div>

              <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div>TODO</div>
              </Modal>
            </div>
          </Col>
          <Col span={24} md={7} xl={5}>
            <div className="overview-sections">
              <div className="last-sent bottom-space">
                <h5 className="label-text">{i18n.t("prjOverview.lastSent")}</h5>
                <p className="last-sent-text">
                  VA launchpad
                  <span className="last-sent-date"> | 02 FEB 2024</span>
                </p>
              </div>
              <div className="last-sent">
                <h5 className="label-text">{i18n.t("prjOverview.upComing")}</h5>
                <p className="last-sent-text">
                  VA launchpad
                  <span className="last-sent-date"> | 02 FEB 2024</span>
                </p>
                <p className="last-sent-text">
                  VA launchpad
                  <span className="last-sent-date"> | 02 FEB 2024</span>
                </p>
                <p className="last-sent-text">
                  VA launchpad
                  <span className="last-sent-date"> | 02 FEB 2024</span>
                </p>
              </div>
            </div>
          </Col>
          <Col
            span={24}
            md={24}
            xl={8}
            className="overview-sections rating-and-surveys"
          >
            <Row className="overview-rows rating">
              <Col span={24} md={10} xl={24}>
                <h5 className="rating-label">
                  {i18n.t("prjOverview.allRating")}
                </h5>
                <h5 className="rating-count">4.3</h5>
              </Col>
              <Col span={24} md={10} xl={24}>
                <Rate allowHalf defaultValue={2.5} disabled={true} />
              </Col>
            </Row>

            <Row
              span={24}
              md={10}
              lg={24}
              className="overview-rows all-surveys"
            >
              <div className="divider-containers">
                <h5 className="label">{i18n.t("prjOverview.totalSurveys")}</h5>
                <h5 className="count">56</h5>
              </div>
              <Divider type="vertical" />
              <div className="divider-containers">
                <h5 className="label">{i18n.t("prjOverview.sentSurveys")}</h5>
                <h5 className="count">34</h5>
              </div>
              <Divider type="vertical" />
              <div className="divider-containers">
                <h5 className="label">
                  {i18n.t("prjOverview.pendingSurveys")}
                </h5>
                <h5 className="count">22</h5>
              </div>
            </Row>
          </Col>
        </Row>
      </div>

      <div className="survey-list-container">
        <h5 className="tabel-heading">{i18n.t("prjOverview.recentSurveys")}</h5>
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
        />
      </div>
    </div>
  );
};

export default FormatList;
