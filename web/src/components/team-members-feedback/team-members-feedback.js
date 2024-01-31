import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Select, Rate } from "antd";
import { GetService } from "../../services/get";
import { useNavigate } from "react-router";
import { GoArrowLeft } from "react-icons/go";
import { IoStarSharp } from "react-icons/io5";
import i18n from "../../locales/i18next";
import { plLibComponents } from "../../context-provider/component-provider";
import "./team-members-feedback.scss";
import { PutService } from "../../services/put";

export const TeamMembersFeedBack = () => {
  const { InputField, InputTextArea } = plLibComponents.components;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [usersList, setUsersList] = useState([]);
  const [selectedMember, setSelectedMember] = useState([]);
  const [isAnyFieldFilled, setIsAnyFieldFilled] = useState(false);
  const [membersData, setMembersData] = useState([]);
  const [feedBack, setFeedBack] = useState({
    positives: "",
    negatives: "",
    rating: "",
  });
  useEffect(() => {
    new GetService().getTeamList(4, (result) => {
      setUsersList(result?.data?.data?.users);
      setSelectedMember(result?.data?.data?.users[0]);
      const membersList = [];
      result?.data?.data?.users.map((user) => {
        membersList.push({ value: user.name, label: user.name });
      });
      setMembersData(membersList);
    });
  }, []);
  const onValuesChange = () => {
    const formValues = form.getFieldsValue();
    const anyFieldHasValue = Object.values(formValues).some((value) => !!value);
    setIsAnyFieldFilled(anyFieldHasValue);
  };
  const handleBack = () => {
    navigate("/survey");
  };
  const onFinish = (values) => {
    const payload = {
      userFeedbackId: selectedMember.ID,
      positives: feedBack.positives,
      negatives: feedBack.negatives,
      rating: values.rating,
    };
    console.log(payload);
    new PutService().updateFeedback(payload, (result) => {
      console.log(result);
      // navigate("/teamFeedback/submitted");
    });
    // setFeedBack({
    //   positives: feedBack.positives,
    //   negatives: feedBack.negatives,
    //   rating: values.rating,
    // });
  };
  const handleSubmit = () => {
    //here complete survey is published
  };
  const handleReset = () => {
    form.resetFields();
  };
  const handleOnChange = (value) => {
    const foundUser = usersList.find((user) => user.name.includes(value));
    setSelectedMember(foundUser);
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
          labelText={i18n.t("placeholder.searchName")}
          placeholder={i18n.t("placeholder.search")}
        />
        <div className="cards-container">
          {usersList.map((member) => (
            <Card
              key={member.ID}
              onClick={() => setSelectedMember(member)}
              className={
                selectedMember?.name === member?.name
                  ? "member-card bg"
                  : "member-card"
              }
            >
              <div className="text-image-container">
                {member?.name}
                {member?.hasFeedback === 1 && (
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
          options={membersData}
          className="search-members"
          defaultValue={membersData[0]?.label}
          onChange={handleOnChange}
        />
      </Col>
      <Col xs={24} md={15}>
        <div className="feeback-names">
          <p className="feedback-title">{i18n.t("teamFeedBack.feedback")}</p>
          <p className="name">{selectedMember?.name}</p>
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
                  handleResultString={(value) =>
                    setFeedBack({
                      positives: value,
                      negatives: feedBack.negatives,
                      rating: feedBack.rating,
                    })
                  }
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
                  handleResultString={(value) =>
                    setFeedBack({
                      positives: feedBack.positives,
                      negatives: value,
                      rating: feedBack.rating,
                    })
                  }
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
