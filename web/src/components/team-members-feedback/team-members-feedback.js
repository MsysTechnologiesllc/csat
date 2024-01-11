import React, { useState } from "react";
import { Button, Card, Col, Form, Input, Rate, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { teamMembersList } from "../../stub-data/data";
import { useNavigate } from "react-router";
import { GoArrowLeft } from "react-icons/go";
import { IoStarSharp } from "react-icons/io5";
import "./team-members-feedback.scss";

export const TeamMembersFeedBack = () => {
  const [selectedMember, setSelectedMember] = useState(
    teamMembersList[0].value,
  );
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
  const customStarIcons = Array.from({ length: 5 }, (_, index) => (
    <IoStarSharp key={index} className="rating-icon" />
  ));
  return (
    <Row className="feedback-container">
      <Col xs={24} md={8} className="card-search-container">
        <Input className="search-input" placeholder="Search by Name" />
        <div className="cards-container">
          {teamMembersList.map((member) => (
            <Card
              key={member.value}
              onClick={() => setSelectedMember(member.value)}
              className={
                selectedMember.value === member.value
                  ? "member-card bg"
                  : "member-card"
              }
            >
              {member.label}
            </Card>
          ))}
        </div>
      </Col>
      <Col xs={24} md={24} className="team-members-list-container">
        <Select
          showSearch
          allowClear
          placeholder="Search by Names"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label.toLowerCase() ?? "").includes(input)
          }
          options={teamMembersList}
          className="search-members"
          defaultValue={teamMembersList[0].label}
          onChange={(value) => setSelectedMember(value)}
        />
      </Col>
      <Col xs={24} md={15}>
        <div className="feeback-names">
          <p className="feedback-title">Feedback for</p>
          <p className="name">{selectedMember}</p>
        </div>
        <Form form={form} onFinish={onFinish} onValuesChange={onValuesChange}>
          <Row className="text-area-container">
            <Col xs={24} md={12}>
              <p>Positives</p>
              <Form.Item name="positives">
                <TextArea
                  placeholder="Your Message"
                  rows={4}
                  className="text-area"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={11}>
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
              <Rate
                className="rating"
                character={({ index = 0 }) => customStarIcons[index]}
              />
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
      <div className="btn-container">
        <Button type="text" className="cancel-button" onClick={handleBack}>
          <GoArrowLeft className="arrow-icon" /> <span> BACK</span>
        </Button>
        <div className="draft-submit-btns">
          <Button className="draft-button">SAVE AS DRAFT</Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            className="active-button"
          >
            SUBMIT
          </Button>
        </div>
      </div>
    </Row>
  );
};
