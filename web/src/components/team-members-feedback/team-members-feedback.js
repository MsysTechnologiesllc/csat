import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Select, Rate } from "antd";
import { useLocation, useNavigate } from "react-router";
import { GoArrowLeft } from "react-icons/go";
import { IoStarSharp } from "react-icons/io5";
import i18n from "../../locales/i18next";
import { plLibComponents } from "../../context-provider/component-provider";
import { PutService } from "../../services/put";
import NotifyStatus from "../notify-status/notify-status";
import "./team-members-feedback.scss";

export const TeamMembersFeedBack = () => {
  const { InputField, InputTextArea } = plLibComponents.components;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [usersList, setUsersList] = useState([]);
  const [selectedMember, setSelectedMember] = useState([]);
  const [isAnyFieldFilled, setIsAnyFieldFilled] = useState(false);
  const [membersData, setMembersData] = useState([]);
  const [notify, setNotify] = useState("");
  const [message, setMessage] = useState("");
  const [feedBack, setFeedBack] = useState({
    positives: "",
    negatives: "",
    rating: "",
  });
  const { state } = useLocation();
  const { surveyDetails, questionsData } = state;
  useEffect(() => {
    setSelectedMember(surveyDetails?.Survey?.user_feedbacks[0]);
    setUsersList(surveyDetails?.Survey?.user_feedbacks);
    const membersList = [];
    surveyDetails?.Survey?.user_feedbacks.map((user) => {
      membersList.push({ value: user.user.name, label: user.user.name });
    });
    setMembersData(membersList);
  }, []);
  const onValuesChange = () => {
    const formValues = form.getFieldsValue();
    const anyFieldHasValue = Object.values(formValues).some((value) => !!value);
    setIsAnyFieldFilled(anyFieldHasValue);
  };
  const handleBack = () => {
    navigate(`/survey/${surveyDetails?.Survey.ID}`, {
      state: { surveyDetails: surveyDetails },
    });
  };
  const onFinish = (values) => {
    const payload = {
      userFeedbackId: selectedMember.ID,
      positives: feedBack.positives,
      negatives: feedBack.negatives,
      rating: values.rating,
    };
    new PutService().updateFeedback(payload, (result) => {
      if (result?.status === 200) {
        setMessage("User feedback saved succesfully");
      }
    });
  };
  const handleFeedbackasDraft = () => {
    const payload = {
      answers: questionsData,
      survey_status: "draft",
    };
    new PutService().updateFeedback(payload, (result) => {
      if (result?.status === 200) {
        setNotify("draft");
        setMessage("Draft saved successfully");
      }
    });
  };
  const handleSubmit = () => {
    const payload = {
      answers: questionsData,
      survey_status: "publish",
    };
    new PutService().updateFeedback(payload, (result) => {
      if (result?.status === 200) {
        navigate("/survey/submitted");
      }
    });
  };
  const handleReset = () => {
    form.resetFields();
  };
  const handleOnChange = (value) => {
    const foundUser = usersList?.find((each) => each.user.name.includes(value));
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
              key={member.user.ID}
              onClick={() => setSelectedMember(member)}
              className={
                selectedMember?.user?.name === member?.user?.name
                  ? "member-card bg"
                  : "member-card"
              }
            >
              <div className="text-image-container">
                {member?.user?.name}
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
          defaultValue={membersData[0]?.user?.label}
          onChange={handleOnChange}
        />
      </Col>
      <Col xs={24} md={15}>
        <div className="feeback-names">
          <p className="feedback-title">{i18n.t("teamFeedBack.feedback")}</p>
          <p className="name">{selectedMember?.user?.name}</p>
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
          <Button className="draft-button" classNames={handleFeedbackasDraft}>
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
      {notify && <NotifyStatus status={notify} message={message} />}
    </Row>
  );
};
