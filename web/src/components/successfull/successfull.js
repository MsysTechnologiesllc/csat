import React from "react";
import { plLibComponents } from "../../context-provider/component-provider";
import i18n from "../../locales/i18next";
import "./successfull.scss";

export const Successfull = () => {
  const { NoData } = plLibComponents.components;
  return (
    <>
      <div className="feedback-submitted">
        <NoData
          image="/images/submitted-logo.svg"
          heading={i18n.t("submittedSuccessfully.submitted")}
          descriptionLine1={i18n.t("submittedSuccessfully.description")}
          descriptionLine2=""
        />
      </div>
    </>
  );
};
