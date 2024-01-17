import React from "react";
import { Row } from "antd";
import "./header.scss";
import i18n from "../../locales/i18next";

export const Header = () => {
  return (
    <Row className="header-container">
      <img src="/images/msys-group.svg" alt="msys-logo" />
      <p className="csat">
        {i18n.t("header.title")} <span>{i18n.t("header.proto")}</span>
      </p>
    </Row>
  );
};
