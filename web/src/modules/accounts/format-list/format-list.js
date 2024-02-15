import React, { useEffect, useState } from "react";
import { Breadcrumb, Table } from "antd";
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
      },
    });
  };
  useEffect(() => {
    new GetService().getSurveyFormatList(state?.prjId, (result) => {
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
      title: "Project Manager",
      dataIndex: "PM_name",
      key: "PM_name",
      ellipsis: true,
    },
    {
      title: "Deliery Head Name",
      dataIndex: "DH_name",
      key: "DH_name",
      ellipsis: true,
    },
    {
      title: "Survey Frequency",
      dataIndex: "survey_frequency_days",
      key: "survey_frequency_days",
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
          surveyDetails: { Survey: data[0].surveys[0] },
        },
      },
    );
  };

  return (
    <div className="survey-home-container">
      <Breadcrumb items={breadcrumbList} />
      <h3 className="survey-heading">{i18n.t("surveyList.surveys")}</h3>
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
          className="custom-scrollbar-table"
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      </div>
    </div>
  );
};

export default FormatList;
