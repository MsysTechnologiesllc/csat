import React, { useState } from "react";
import { Button, Card, Col, Form, Row, Select, Rate } from "antd";
import { teamMembersList } from "../../stub-data/data";
import { useNavigate } from "react-router";
import { GoArrowLeft } from "react-icons/go";
import { IoStarSharp } from "react-icons/io5";
import "./team-members-feedback.scss";
import i18n from "../../locales/i18next";
import { plLibComponents } from "../../context-provider/component-provider";

export const TeamMembersFeedBack = () => {
  const { InputField, InputTextArea } = plLibComponents.components;
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
        <InputField
          isForm={false}
          type="textinput"
          labelText="Search by Name"
        />
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
              <div className="text-image-container">
                {member.label}
                {member.hasFeedback === 1 && (
                  <img
                    src="./images/feedback_updated.svg"
                    alt={i18n.t("imageAlt.gauge")}
                    className="feedback-updated-image"
                  />
                )}
              </div>
            </Card>
          ))}
        </div>
      </Col>
      <Col xs={24} md={24} className="team-members-list-container">
        <Select
          showSearch
          allowClear
          placeholder={i18n.t("placeholder.searchName")}
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
          <p className="feedback-title">{i18n.t("teamFeedBack.feedback")}</p>
          <p className="name">{selectedMember}</p>
        </div>
        <Form form={form} onFinish={onFinish} onValuesChange={onValuesChange}>
          <Row className="text-area-container">
            <Col xs={24} md={12}>
              <p>{i18n.t("teamFeedBack.positives")}</p>
              <Form.Item name="positives">
                <InputTextArea
                  placeHolderText={i18n.t("placeholder.message")}
                  rowCount={4}
                  className="text-area"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={11}>
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
