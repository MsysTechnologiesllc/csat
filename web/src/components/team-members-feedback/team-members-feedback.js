import React, { useState } from "react";
import { Button, Card, Col, Input, Rate, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { teamMembersList } from "../../stub-data/data";
import { useNavigate } from "react-router";
import "./team-members-feedback.scss";

export const TeamMembersFeedBack = () => {
  const [selectedMember, setSelectedMember] = useState(teamMembersList[0]);
  const navigate = useNavigate();
  const handleSubmit = () => {
    navigate("/teamFeedback/submitted");
  };
  return (
    <Row className="feedback-container">
      <Col span={8} className="card-search-container">
        <Input className="search-input" placeholder="Enter here" />
        <div className="cards-container">
          {teamMembersList.map((member) => (
            <Card
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className={
                selectedMember.id === member.id
                  ? "member-card bg"
                  : "member-card"
              }
            >
              {member.name}
            </Card>
          ))}
        </div>
      </Col>
      <Col span={15}>
        <div className="feeback-names">
          <p className="feedback-title">Feedback for</p>
          <p className="name">{selectedMember.name}</p>
        </div>
        <Row className="text-area-container">
          <Col span={11}>
            <p>Positives</p>
            <TextArea
              placeholder="Your Message"
              rows={4}
              style={{ width: 400 }}
            />
          </Col>
          <Col span={11}>
            <p>Areas of Improvement</p>
            <TextArea
              style={{ width: 400 }}
              rows={4}
              fullWidth
              placeholder="Your Message"
              multiline
            />
          </Col>
        </Row>
        <Row>
          <Col span={24} className="rating-btn-container">
            <p>Overall rating</p>
            <Rate size="large" className="rating" />
            <div className="rating-btn">
              <Button className="draft-button">RESET</Button>
              <Button className="active-button">SAVE</Button>
            </div>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Button className="draft-button">Back</Button>
        <Button className="active-button" onClick={handleSubmit}>
          SUBMIT
        </Button>
      </Col>
    </Row>
  );
};
