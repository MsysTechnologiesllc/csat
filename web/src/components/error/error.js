import React from "react";
import { plLibComponents } from "../../context-provider/component-provider";
import "./error.scss";
import i18n from "../../locales/i18next";

const Error = () => {
  const { Error } = plLibComponents.components;
  return (
    <div className="error-wrapper">
      <Error
        heading={i18n.t("error.erro")}
        descriptionLine1={i18n.t("error.desc1")}
        descriptionLine2={i18n.t("error.desc2")}
      />
    </div>
  );
};

export default Error;
