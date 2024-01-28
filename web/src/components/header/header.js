import React from "react";
import { Row } from "antd";
import "./header.scss";
import i18n from "../../locales/i18next";

export const Header = () => {
  return (
    <Row className="header-container">
      <div className="logo-container">
        <img src="/images/msys-group.svg" alt="msys-logo" />
        <p className="csat">
          {i18n.t("header.title")} <span>{i18n.t("header.proto")}</span>
        </p>
      </div>
      <div className="">
        <p className="prj-name">
          Project: <span> Project 1</span>
        </p>
      </div>
    </Row>
  );
};
