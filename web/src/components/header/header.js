import React from "react";
import { Row } from "antd";
import PropTypes from "prop-types";
import "./header.scss";
import i18n from "../../locales/i18next";

export const Header = ({ prjTitle, displayPrjTitle }) => {
  return (
    <Row className="header-container">
      <div className="logo-container">
        <img src="/images/msys-group.svg" alt={i18n.t("common.logo")} />
        <p className="csat">
          {i18n.t("header.title")} <span>{i18n.t("header.proto")}</span>
        </p>
      </div>
      {displayPrjTitle === false && (
        <p className="prj-name">
          {i18n.t("greetings.project")}: <span> {prjTitle}</span>
        </p>
      )}
    </Row>
  );
};

Header.propTypes = {
  prjTitle: PropTypes.string.isRequired,
  displayPrjTitle: PropTypes.bool.isRequired,
};
