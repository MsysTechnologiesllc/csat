import React from "react";
import { Row } from "antd";
import "./header.scss";

export const Header = () => {
  return (
    <Row className="header-container">
      <img src="/images/msys-group.svg" alt="msys-logo" />
      <p className="csat">
        CSAT <span>Proto</span>
      </p>
    </Row>
  );
};
