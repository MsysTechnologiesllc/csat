import React, { useState } from "react";
import { Button, Card, Col, Rate, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { teamMembersList } from "../../stub-data/data";
import "./team-members-feedback.scss";

export const TeamMembersFeedBack = () => {
  const [selectedMember, setSelectedMember] = useState({});
  return (
    <Row>
      <Col span={8} className="card-search-container">
        {teamMembersList.map((member) => (
          <Card
            key={member.id}
            onClick={() => setSelectedMember(member)}
            className={
              selectedMember.id === member.id ? "member-card bg" : "member-card"
            }
          >
            {member.name}
          </Card>
        ))}
      </Col>
      <Col span={16}>
        <div className="feeback-names">
          <p>Feedback for</p>
          <p>{selectedMember.name}</p>
        </div>
        <Row className="text-area-container">
          <Col span={10}>
            <p>Positives</p>
            <TextArea
              placeholder="Your Message"
              rows={4}
              style={{ width: 400 }}
            />
          </Col>
          <Col span={10}>
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
        <Row className="rating-btn-container">
          <Col>
            <p>Overall rating</p>
            <Rate size="large" />
            <div>
              <Button>Reset</Button>
              <Button>Save</Button>
            </div>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Button>Back</Button>
        <Button>SUBMIT</Button>
      </Col>
    </Row>
  );
};
