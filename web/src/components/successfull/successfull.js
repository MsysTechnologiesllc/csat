import React from "react";
import "./successfull.scss";
import { plLibComponents } from "../../context-provider/component-provider";

export const Successfull = () => {
  const { NoData } = plLibComponents.components;
  return (
    <>
      <div className="feedback-submitted">
        <NoData
          image="/images/submitted-logo.svg"
          heading="Your feedback is submitted successfully!"
          descriptionLine1="We sincerely thank you for sharing the feedback"
          descriptionLine2=""
        />
      </div>
    </>
  );
};
