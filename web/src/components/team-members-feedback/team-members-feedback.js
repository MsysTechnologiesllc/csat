import React, { useState } from "react";
import { Button, Card, Col, Form, Input, Rate, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { teamMembersList } from "../../stub-data/data";
import { useNavigate } from "react-router";
import "./team-members-feedback.scss";

export const TeamMembersFeedBack = () => {
  const [selectedMember, setSelectedMember] = useState(teamMembersList[0]);
  const [isAnyFieldFilled, setIsAnyFieldFilled] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const onValuesChange = () => {
    const formValues = form.getFieldsValue();
    const anyFieldHasValue = Object.values(formValues).some((value) => !!value);
    setIsAnyFieldFilled(anyFieldHasValue);
  };
  const handleSubmit = () => {
    navigate("/teamFeedback/submitted");
  };
  const handleBack = () => {
    navigate("/survey");
  };
  const onFinish = (values) => {
    console.log(values, "form output");
  };
  const handleReset = () => {
    form.resetFields();
  };
  return (
    <Row className="feedback-container">
      <Col span={8} className="card-search-container">
        <Input className="search-input" placeholder="Search by Name" />
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
        <Form form={form} onFinish={onFinish} onValuesChange={onValuesChange}>
          <Row className="text-area-container">
            <Col span={12}>
              <p>Positives</p>
              <Form.Item name="positives">
                <TextArea
                  placeholder="Your Message"
                  rows={4}
                  className="text-area"
                />
              </Form.Item>
            </Col>
            <Col span={11}>
              <p>Areas of Improvement</p>
              <Form.Item name="improvements">
                <TextArea
                  rows={4}
                  placeholder="Your Message"
                  className="text-area"
                />
              </Form.Item>
            </Col>
          </Row>
          <Col span={24} className="rating-btn-container">
            <p className="overall-ratting">Overall rating</p>
            <Form.Item name="rating">
              <Rate className="rating" />
            </Form.Item>
            <div className="rating-btn">
              <Button
                classNames="draft-button"
                disabled={!isAnyFieldFilled}
                onClick={handleReset}
              >
                RESET
              </Button>
              <Button
                className={
                  isAnyFieldFilled
                    ? "active-button"
                    : "active-button disabled-button"
                }
                htmlType="submit"
                disabled={!isAnyFieldFilled}
              >
                SAVE
              </Button>
            </div>
          </Col>
        </Form>
      </Col>
      <Col span={24} className="btn-container">
        <Col span={3}>
          <Button type="text" className="cancel-button" onClick={handleBack}>
            BACK
          </Button>
        </Col>
        <Col span={6} className="draft-submit-btns">
          <Button className="draft-button">SAVE AS DRAFT</Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            className="active-button"
          >
            SUBMIT
          </Button>
        </Col>
      </Col>
    </Row>
  );
};
