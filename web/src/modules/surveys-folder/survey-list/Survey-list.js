import React, { useState } from "react";
import { Table, Select, Pagination } from "antd";
import PropTypes from "prop-types";
import { TableShimmer } from "../../../components/table-shimmer/table-shimmer";
import moment from "moment";
import { useNavigate } from "react-router";
import i18n from "../../../locales/i18next";

const SurveyList = ({
  data,
  getPageCount,
  getPagelimit,
  dataPerPage,
  totalData,
  isDataLoaded,
}) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(dataPerPage);
  const [current, setCurrent] = useState(1);
  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? "even-row" : "odd-row";
  };
  function dateFormatter(value) {
    return moment(value).format("DD MMM YYYY, hh:mm A");
  }
  function actionSvgChanger(status) {
    let image = "";
    if (status === "completed") {
      image = "/images/eye-privacy.svg";
    } else if (status === "pending") {
      image = "/images/pending.svg";
    } else if (status === "overdue") {
      image = "/images/overdue.svg";
    } else if (status === "publish") {
      image = "/images/sent-profile.svg";
    }
    return image;
  }
  function handleActionOnClick(status, record) {
    if (status === "publish" || "pending") {
      navigate("/surveys/surveyDetails", { state: { survey_id: record.ID } });
    }
  }
  const columnsData = [
    {
      title: i18n.t("surveyDetails.name"),
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: i18n.t("surveyList.prjName"),
      dataIndex: "prjName",
      key: "prjName",
      ellipsis: true,
      render: (_, record) => {
        return <p>{record.project.name}</p>;
      },
    },
    {
      title: i18n.t("surveyList.deadline"),
      dataIndex: "responce",
      key: "responce",
      ellipsis: true,
      render: (_, record) => {
        return <p>{dateFormatter(record.project.end_date)}</p>;
      },
    },
    {
      title: i18n.t("surveyList.status"),
      dataIndex: "status",
      key: "status",
      render: (text) => text.toUpperCase(),
    },
    {
      title: i18n.t("surveyList.action"),
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <div className="action-svg">
          <img
            src={process.env.PUBLIC_URL + actionSvgChanger(status)}
            onClick={() => handleActionOnClick(status, record)}
            alt={i18n.t("surveyList.action")}
          />
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
  const pageSizeOptions = [
    {
      value: 5,
      label: "5",
    },
    {
      value: 10,
      label: "10",
    },
    {
      value: 15,
      label: "15",
    },
  ];
  const handleChange = (value) => {
    setPage(value);
    getPagelimit(value);
  };
  return (
    <div className="survey-list-container">
      <Table
        size="small"
        dataSource={data}
        locale={
          !isDataLoaded ? (
            <TableShimmer row={5} col={5} />
          ) : (
            totalData === 0 && customLocale
          )
        }
        columns={columnsData}
        pagination={false}
        rowKey="key"
        scroll={{ y: 300, x: true }}
        rowClassName={getRowClassName}
        className="custom-scrollbar-table"
      />
      <div className="pagination-container">
        <span className="selector-text">
          {i18n.t("surveyList.rowsPerPage")}
        </span>
        <Select
          defaultValue={page}
          onChange={handleChange}
          options={pageSizeOptions}
        />
        <Pagination
          pageSize={page}
          current={current}
          total={totalData}
          pageSizeOptions={pageSizeOptions.map((size) => `${size.value}`)}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total}`}
          simple={true}
          showLessItems={true}
          onChange={(page) => {
            setCurrent(page);
            getPageCount(page);
          }}
        />
      </div>
    </div>
  );
};

export default SurveyList;

SurveyList.propTypes = {
  data: PropTypes.array.isRequired,
  totalData: PropTypes.number.isRequired,
  getPageCount: PropTypes.func.isRequired,
  getPagelimit: PropTypes.func.isRequired,
  isDataLoaded: PropTypes.bool.isRequired,
  dataPerPage: PropTypes.number.isRequired,
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
};
