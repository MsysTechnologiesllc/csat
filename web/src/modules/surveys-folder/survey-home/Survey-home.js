import React, { useEffect, useState } from "react";
import "./Survey-home-styles.scss";
import SurveyHeader from "../survey-header/Survey-header";
import SurveyList from "../survey-list/Survey-list";
import { GetService } from "../../../services/get";
import { useDetectMobileOrDesktop } from "../../../hooks/useDetectMobileOrDesktop";
import { useOutletContext } from "react-router";

const SurveyHome = () => {
  const { isMobile } = useDetectMobileOrDesktop();
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(isMobile ? 10 : 5);
  const [totalData, setTotlaData] = useState(0);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAccounts, setFilterAccounts] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [prjData, setPrjData] = useState([]);
  const [tenantId] = useOutletContext();
  let id = 1001;
  let page = pageNumber;
  let limit = dataPerPage;
  let accName = JSON.stringify(filterAccounts);
  let status = filterStatus;
  let user_id = 1;
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
        },
      );
    }
  }, [pageNumber, dataPerPage, filterStatus, filterAccounts]);

  function getStatusFilterUpdates(value) {
    setPageNumber(1);
    if (value === "all") {
      setFilterStatus("");
    } else {
      setFilterStatus(value);
    }
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
