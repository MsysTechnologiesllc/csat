import React, { useState } from "react";
import { Table } from "antd";

const SurveyList = () => {
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
    { title: "Status", dataIndex: "status", key: "status" },
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
  const tableData = [
    {
      surveyName: "Liquidwar",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquid",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidwa",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidware",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquid Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidws",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquware",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidwe",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquware",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquide",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liware Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquid Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidre",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquare Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidware",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquid Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liware",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liqware",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquire",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liqare",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liqure Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidware",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidwar",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidwa Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquare Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidware Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidware",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidware",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidware",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidware",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidware Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidware Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: " Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidware ",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquid Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Lidware Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidwe",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquid ware",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidwre",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidwa  re",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidw Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquire Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquie Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidware ",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidwe Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidware Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidware",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidware",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidware",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidware",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidware",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquidware",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquid Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquid Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquid Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquid Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquid Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquid Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "Liquid Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "L ware Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "L ware Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "L ware Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "L ware Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
    {
      surveyName: "L ware Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "Completed",
    },
  ];
  const pageSizeOptions = ["6", "10", "15", "20"];
  //   const customPageSizeOptions = pageSizeOptions.map((size) => (
  //     <Select.Option key={size} value={size}>
  //       Rows per page: {size}
  //     </Select.Option>
  //   ));
  const [state, setState] = useState(6);
  const pagination = {
    pageSize: state,
    total: tableData.length,
    pageSizeOptions: pageSizeOptions.map((size) => `${size}`),
    itemRender: (current, type, originalElement) => {
      if (type === "pageSize") {
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
        dataSource={tableData}
        locale={tableData?.length === 0 && customLocale}
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
