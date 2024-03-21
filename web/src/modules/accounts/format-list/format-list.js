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
import { useLocation, useNavigate } from "react-router";

const FormatList = ({}) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [data, setData] = useState([]);
  const [breadcrumbList, setBreadcrumbList] = useState([]);
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
          <Col span={24} md={8} xl={4}>
            <div className="overview-sections">
              <div className="accounts-avatar-container">
                <Avatar></Avatar>
                <h5 className="acc-name">VA Launch pad</h5>
              </div>
              <div className="accounts-details-container">
                <div className="acc-owner-container">
                  <h5 className="acc-owner-label">
                    {i18n.t("addAccount.accOwner")}
                  </h5>
                  <p className="detail">Anand jain</p>
                </div>
                <div className="acc-owner-container">
                  <h5 className="acc-owner-label">
                    {i18n.t("prjOverview.sow")}
                  </h5>
                  <p className="detail">17/03/2021</p>
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
