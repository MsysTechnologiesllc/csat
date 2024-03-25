import Layout, { Content, Header as AntdHeader } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Header } from "../../components/header/header";
import { GetService } from "../../services/get";
import "./customer-survey-layout.scss";

export const CustomerSurveyLayout = () => {
  const [projectName, setProjectName] = useState("");
  let isCustomerSurvey = location.pathname
    .split("/")
    .includes("customer-survey");
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const survey_id = params.get("survey_id");
  const passcode = params.get("passcode");
  useEffect(() => {
    if (isCustomerSurvey === false && survey_id && passcode) {
      new GetService().getSurveyDetails(survey_id, passcode, (result) => {
        if (result?.data?.data) {
          setProjectName(result?.data?.data?.Survey?.project?.name);
        }
      });
    }
  }, [survey_id, isCustomerSurvey]);

  return (
    <>
      <Layout className="customer-survey-layout">
        <AntdHeader>
          <Header prjTitle={projectName} displayPrjTitle={isCustomerSurvey} />
        </AntdHeader>
        <Layout hasSider={false}>
          <Content>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};
