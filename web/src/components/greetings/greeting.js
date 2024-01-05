import React from "react";
import { Row, Col, Button } from "antd";
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
      <Row className="greetings-image-container">
        <Col span={14}>
          <img src="images/greetings-image.svg" alt="greetings-image" />
        </Col>
        <Col span={9} className="greetings-description">
          <h1 className="greetings-title">Greetings</h1>
          <p className="greetings-desc">
            We would appreciate if you could spare a few minutes of your time to
            share your feedback. This feedback will help us to ensure that the
            project is on track and to meet your expectations. If there are any
            concerns, we request you to share an open feedback that would enable
            us to work on those improvement areas and continue to provide our
            best services.
          </p>
        </Col>
      </Row>
      <Row className="details-container">
        <Col span={20} className="project-details-container">
          {projectDetails.map((item, i) => (
            <Col key={i} span={4}>
              <p className="title">{item.title}</p>
              <p className="desc">{item.desc}</p>
            </Col>
          ))}
        </Col>
        <Col span={4}>
          <Button className="btn" onClick={getStarted}>
            GET STARTED
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default GreetingsPage;
