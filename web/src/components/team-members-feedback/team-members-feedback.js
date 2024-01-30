import React, { useState } from "react";
import { Button, Card, Col, Form, Row, Rate } from "antd";
import { teamMembersList } from "../../stub-data/data";
import { useNavigate } from "react-router";
import { GoArrowLeft } from "react-icons/go";
import { IoStarSharp } from "react-icons/io5";
import i18n from "../../locales/i18next";
import { plLibComponents } from "../../context-provider/component-provider";
import "./team-members-feedback.scss";

export const TeamMembersFeedBack = () => {
  const { InputField, InputTextArea } = plLibComponents.components;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [selectedMember, setSelectedMember] = useState(
    teamMembersList[0].value,
  );
  const [isAnyFieldFilled, setIsAnyFieldFilled] = useState(false);
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
      <Col xs={24} md={7} xl={7} className="card-search-container">
        <InputField
          isForm={false}
          type="textinput"
          labelText={i18n.t("placeholder.searchName")}
          placeholder={i18n.t("placeholder.search")}
          onChange={(event) => console.log(event.value)}
        />
        <div className="cards-container">
          {teamMembersList.map((member) => (
            <Card
              key={member.value}
              onClick={() => setSelectedMember(member.value)}
              className={
                selectedMember === member.value
                  ? "member-card bg"
                  : "member-card"
              }
            >
              <p className="text-image-container">
                {member.label}
                {member.hasFeedback === 1 && (
                  <img
                    src="./images/feedback_updated.svg"
                    alt={i18n.t("imageAlt.gauge")}
                    className="feedback-updated-image"
                  />
                )}
              </p>
            </Card>
          ))}
        </div>
      </Col>
      <Col xs={24} md={16} xl={16}>
        <div className="feeback-names">
          <p className="feedback-title">{i18n.t("teamFeedBack.feedback")}</p>
          <p className="name">{selectedMember}</p>
        </div>
        <Form form={form} onFinish={onFinish} onValuesChange={onValuesChange}>
          <Row className="text-area-container">
            <Col xs={24}>
              <p>{i18n.t("teamFeedBack.positives")}</p>
              <Form.Item name="positives">
                <InputTextArea
                  placeHolderText={i18n.t("placeholder.message")}
                  rowCount={4}
                  className="text-area"
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <p>{i18n.t("teamFeedBack.areaOfImprovement")}</p>
              <Form.Item name="improvements">
                <InputTextArea
                  rowCount={4}
                  placeHolderText={i18n.t("placeholder.message")}
                  className="text-area"
                />
              </Form.Item>
            </Col>
          </Row>
          <Col span={24} className="rating-btn-container">
            <p className="overall-ratting">
              {i18n.t("teamFeedBack.overallRating")}
            </p>
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
                {i18n.t("button.reset")}
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
                {i18n.t("button.save")}
              </Button>
            </div>
          </Col>
        </Form>
      </Col>
      <div className="btn-container">
        <Button type="text" className="cancel-button" onClick={handleBack}>
          <GoArrowLeft className="arrow-icon" />{" "}
          <span> {i18n.t("button.back")}</span>
        </Button>
        <div className="draft-submit-btns">
          <Button className="draft-button">
            {i18n.t("button.saveAsDraft")}
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            className="active-button"
          >
            {i18n.t("button.submit")}
          </Button>
        </div>
      </div>
    </Row>
  );
};
