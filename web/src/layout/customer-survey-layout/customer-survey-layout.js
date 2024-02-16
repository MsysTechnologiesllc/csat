import Layout, { Content, Header as AntdHeader } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router";
import { Header } from "../../components/header/header";
import { GetService } from "../../services/get";
import "./customer-survey-layout.scss";

export const CustomerSurveyLayout = () => {
  const [projectName, setProjectName] = useState("");
  let isCustomerSurvey = location.pathname
    .split("/")
    .includes("customer-survey");
  const { survey_id } = useParams();
  useEffect(() => {
    if (isCustomerSurvey === false) {
      console.log("done");
      new GetService().getSurveyDetails(survey_id, (result) => {
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
