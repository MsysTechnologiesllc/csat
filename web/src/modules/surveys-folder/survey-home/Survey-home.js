import React, { useEffect, useState } from "react";
import "./Survey-home-styles.scss";
import SurveyHeader from "../survey-header/Survey-header";
import SurveyList from "../survey-list/Survey-list";
import { GetService } from "../../../services/get";

const SurveyHome = () => {
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(5);
  const [totalData, setTotlaData] = useState(0);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAccounts, setFilterAccounts] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [prjData, setPrjData] = useState([]);
  let id = 1001;
  let page = pageNumber;
  let limit = dataPerPage;
  let accName = JSON.stringify(filterAccounts);
  let status = filterStatus;
  let user_id = 328;
  useEffect(() => {
    new GetService().getSurveyProjectsFilter(user_id, (result) => {
      if (result) {
        setPrjData(result?.data?.data.projects);
      }
    });
  }, []);
  useEffect(() => {
    if (id) {
      setIsDataLoaded(false);
      new GetService().getSurveyList(
        id,
        page,
        limit,
        accName,
        status,
        user_id,
        (result) => {
          if (result?.data?.data.Surveys) {
            setIsDataLoaded(true);
            setData(result.data.data.Surveys);
            setTotlaData(result.data.data.TotalCount);
          }
          if (filterStatus === "overdue" || "pending") {
            filterActionsData(result?.data?.data.Surveys);
          }
        },
      );
    }
  }, [pageNumber, dataPerPage, filterStatus, filterAccounts]);
  function filterActionsData(data) {
    if (state === "overdue") {
      let datas = data?.filter((item) => item.status === "overdue");
      setData(datas);
      setTotlaData(datas?.length);
    } else if (state === "pending") {
      let datas = data?.filter((item) => item.status === "pending");
      setData(datas);
      setTotlaData(datas?.length);
    }
  }
  const [state, setState] = useState("");
  function getStatusFilterUpdates(value) {
    let newFilterStatus = "";
    let newState = "";

    switch (value) {
      case "all":
        newFilterStatus = "";
        newState = "";
        break;
      case "overdue":
        newFilterStatus = "pending";
        newState = "overdue";
        break;
      case "pending":
        newFilterStatus = "pending";
        newState = "pending";
        break;
      default:
        newFilterStatus = "publish";
        newState = "publish";
    }

    setFilterStatus(newFilterStatus);
    setState(newState);
  }

  function getAccountFilterUpdates(value) {
    if (value === "") {
      setFilterAccounts("");
    } else {
      setFilterAccounts(value);
    }
  }

  function getPageCount(value) {
    setPageNumber(value);
  }
  function getPagelimit(value) {
    setDataPerPage(value);
  }
  return (
    <div className="survey-home-container">
      <SurveyHeader
        getStatusFilterUpdates={getStatusFilterUpdates}
        getAccountFilterUpdates={getAccountFilterUpdates}
        prjData={prjData}
      />
      <SurveyList
        isDataLoaded={isDataLoaded}
        data={data}
        dataPerPage={dataPerPage}
        getPageCount={getPageCount}
        getPagelimit={getPagelimit}
        totalData={totalData}
      />
    </div>
  );
};

export default SurveyHome;
