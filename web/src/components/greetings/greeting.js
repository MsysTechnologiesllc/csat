import React from "react";
import { Button } from "antd";
import { projectDetails } from "../../stub-data/data";
import { useNavigate } from "react-router";
import "./greetings.scss";

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
          <h1 className="greetings-title">Greetings</h1>
          <p className="greetings-desc">
            We would appreciate if you could spare a few minutes of your time to
            share your feedback. This feedback will help us to ensure that the
            project is on track and to meet your expectations. If there are any
            concerns, we request you to share an open feedback that would enable
            us to work on those improvement areas and continue to provide our
            best services.
          </p>
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
          GET STARTED
        </Button>
      </div>
    </div>
  );
}

export default GreetingsPage;
