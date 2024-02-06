import React, { useEffect, useState } from "react";
import "./Survey-home-styles.scss";
import SurveyHeader from "../../surveys/survey-header/Survey-header";
import SurveyList from "../survey-list/Survey-list";

const SurveyHome = () => {

  const tableData = [
    {
      surveyName: "Liquidware",
      prjName: "Project",
      responce: "27 Jan",
      status: "completed",
    },
    {
      surveyName: "Liquidw Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "pending",
    },
    {
      surveyName: "Liquire Labs",
      prjName: "Project",
      responce: "27 Jan",
      status: "overdue",
    },
    {
      surveyName: "rubic",
      prjName: "Project",
      responce: "27 Jan",
      status: "overdue",
    },
    {
      surveyName: "rubic",
      prjName: "Project",
      responce: "27 Jan",
      status: "pending",
    },
    {
      surveyName: "rubic",
      prjName: "Project",
      responce: "27 Jan",
      status: "completed",
    },
  ];
  const [statusFilter, setStatusFilter] = useState("all");
  const [accountFilter, setAccountFilter] = useState("");
  const [filteredData, setFilteredData] = useState(tableData);

  function getStatusFilterUpdates(value) {
    setStatusFilter(value);
  }

  function getAccountFilterUpdates(value) {
    setAccountFilter(value);
  }
  useEffect(() => {
    let data = tableData;

    if (statusFilter !== "all") {
      data = data.filter((item) => {
        if (statusFilter === "toFollowUp") {
          return item.status === "pending";
        } else if (statusFilter === "completed") {
          return item.status === "completed";
        } else if (statusFilter === "overdue") {
          return item.status === "overdue";
        }

        return true;
      });
    }

    if (accountFilter.length > 0) {
      data = data.filter((item) => accountFilter.includes(item.surveyName));
    }

    setFilteredData(data);
  }, [statusFilter, accountFilter]);

  return (
    <div className="survey-home-container">
      <SurveyHeader
        getStatusFilterUpdates={getStatusFilterUpdates}
        getAccountFilterUpdates={getAccountFilterUpdates}
      />
      <SurveyList
        statusFilter={statusFilter}
        accountFilter={accountFilter}
        filteredData={filteredData}
      />
    </div>
  );
};

export default SurveyHome;
