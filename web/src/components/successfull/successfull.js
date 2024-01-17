import React from "react";
import "./successfull.scss";

export const Successfull = () => {
  return (
    <div className="feedback-submitted">
      <img src="/images/submitted-logo.svg" alt="submtted" />
      <h1 className="title">Your feedback is submitted successfully!</h1>
      <p className="description">
        We sincerely thank you for sharing the feedback
      </p>
    </div>
  );
};
