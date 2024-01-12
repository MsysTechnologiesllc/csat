import React from "react";
import { Button } from "antd";
import { projectDetails } from "../../stub-data/data";
import { useNavigate } from "react-router";
import "./greetings.scss";
import i18n from "../../locales/i18next";

function GreetingsPage() {
  const navigate = useNavigate();
  const getStarted = () => {
    navigate("/survey");
  };

  return (
    <div className="greetings-container">
      <div className="greetings-main-container">
        <div className="greetings-image-container">
          <img
            src="images/greetings-image.svg"
            alt="greetings-image"
            className="greetings-image"
          />
        </div>
        <div className="greetings-description">
          <h1 className="greetings-title">{i18n.t("greetings.greetings")}</h1>
          <p className="greetings-desc">{i18n.t("greetings.description")}</p>
        </div>
      </div>
      <div className="details-container">
        <div className="project-details-container">
          {projectDetails.map((item, i) => (
            <div key={i} span={4} className="details">
              <p className="title">{item.title}</p>
              <p className="desc">{item.desc}</p>
            </div>
          ))}
        </div>

        <Button className="active-button" onClick={getStarted}>
          {i18n.t("greetings.getStarted")}
        </Button>
      </div>
    </div>
  );
}

export default GreetingsPage;
