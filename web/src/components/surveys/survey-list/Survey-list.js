import React, { useState } from "react";
import { Table } from "antd";
import PropTypes from "prop-types";

const SurveyList = ({ filteredData }) => {
  const getRowClassName = (record, index) => {
    return index % 2 === 0 ? "even-row" : "odd-row";
  };
  const columnsData = [
    {
      title: "Survey Name",
      dataIndex: "surveyName",
      key: "surveyName",
      ellipsis: true,
    },
    {
      title: "Project Name",
      dataIndex: "prjName",
      key: "prjName",
      ellipsis: true,
    },
    {
      title: "Responce Deadline Date",
      dataIndex: "responce",
      key: "responce",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];
  const customLocale = {
    emptyText: (
      <div className="no-data">
        {/* <img src={NoDataImage} alt={"img"} /> */}
        <p>No data</p>
      </div>
    ),
  };
  const pageSizeOptions = ["6", "10", "15", "20"];
  const [state, setState] = useState(6);
  const pagination = {
    pageSize: state,
    total: filteredData.length,
    pageSizeOptions: pageSizeOptions.map((size) => `${size}`),
    itemRender: (current, type, originalElement) => {
      if (type === current) {
        return <>{`Rows per page: ${originalElement}`}</>;
      }
      return originalElement;
    },
    showSizeChanger: true,
    // showTotal: () => null,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
    simple: true,
    showLessItems: true,
    onChange: (page, pageSize) => {
      console.log("Page:", page, "Page Size:", pageSize);
    },
    onShowSizeChange: (current, size) => {
      setState(size);
    },
  };
  return (
    <div className="survey-list-container">
      <Table
        size="small"
        dataSource={filteredData}
        locale={filteredData?.length === 0 && customLocale}
        columns={columnsData}
        pagination={pagination}
        rowKey="key"
        rowClassName={getRowClassName}
      />
      {/* <Pagination
        current={1}
        total={20}
        pageSize={6}
        // onChange={handlePaginationChange}
        showTotal={(total, range) => `showing results ${range[1]} of ${total}`}
        showSizeChanger={false}
        className="pagination"
      /> */}
    </div>
  );
};

export default SurveyList;

SurveyList.propTypes = {
  filteredData: PropTypes.array.isRequired,
};
