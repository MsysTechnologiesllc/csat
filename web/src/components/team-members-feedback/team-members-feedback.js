import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Rate, Input } from "antd";
import { useLocation, useNavigate } from "react-router";
import { GoArrowLeft } from "react-icons/go";
import { IoStarSharp } from "react-icons/io5";
import i18n from "../../locales/i18next";
import { plLibComponents } from "../../context-provider/component-provider";
import { PutService } from "../../services/put";
import NotifyStatus from "../notify-status/notify-status";
import { GetService } from "../../services/get";
import PropTypes from "prop-types";
import "./team-members-feedback.scss";

export const TeamMembersFeedBack = ({ surveyId }) => {
  const { TextArea } = Input;
  const { InputField } = plLibComponents.components;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [usersList, setUsersList] = useState([]);
  const [selectedMember, setSelectedMember] = useState([]);
  const [isAnyFieldFilled, setIsAnyFieldFilled] = useState(false);
  const [notify, setNotify] = useState("");
  const [message, setMessage] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [save, setSave] = useState(false);
  const { state } = useLocation();
  useEffect(() => {
    new GetService().getSurveyDetails(
      surveyId ? surveyId : state?.surveyDetails?.Survey?.ID,
      (result) => {
        if (result?.data?.data) {
          setUsersList(result?.data?.data?.Survey?.user_feedbacks);
          setSelectedMember(result?.data?.data?.Survey?.user_feedbacks[0]);
          setSave(false);
          if (searchInput !== "") {
            const searchedUser =
              result?.data?.data?.Survey?.user_feedbacks.filter((member) => {
                if (
                  member.user.name
                    .toLowerCase()
                    .includes(searchInput.toLowerCase())
                ) {
                  return member;
                }
              });
            setUsersList(searchedUser);
          }
        }
      },
    );
  }, [save, searchInput]);
  useEffect(() => {
    form.setFieldsValue({
      positives: selectedMember?.positives,
      improvements: selectedMember?.negatives,
      rating: selectedMember?.rating,
    });
  }, [selectedMember]);
  const onValuesChange = () => {
    const formValues = form.getFieldsValue();
    const anyFieldHasValue = Object.values(formValues).some((value) => !!value);
    setIsAnyFieldFilled(anyFieldHasValue);
  };
  const handleBack = () => {
    setNotify("");
    navigate(`/survey/${state?.surveyDetails?.Survey.ID}`, {
      state: { surveyDetails: state?.surveyDetails },
    });
  };
  const onFinish = (values) => {
    const payload = {
      userFeedbackId: selectedMember.ID,
      positives: values.positives,
      negatives: values.improvements,
      rating: values.rating,
    };
    new PutService().updateFeedback(payload, (result) => {
      if (result?.status === 200) {
        setSave(true);
        setNotify("success");
        setMessage(i18n.t("common.userFeedbackSubmitted"));
        setTimeout(() => {
          setNotify("");
        }, 2000);
      }
    });
  };
  const handleFeedbackasDraft = () => {
    const payload = {
      survey_id: state?.surveyDetails?.Survey?.ID,
      survey_answers: state?.questionsData,
      survey_status: "draft",
    };
    new PutService().updateSurveyDetails(payload, (result) => {
      if (result?.status === 200) {
        setNotify("success");
        setMessage(i18n.t("common.draftMessage"));
        setTimeout(() => {
          setNotify("");
        }, 2000);
      }
    });
  };
  const handleSubmit = () => {
    const payload = {
      survey_id: state?.surveyDetails?.Survey?.ID,
      survey_answers: state?.questionsData,
      survey_status: "publish",
    };
    new PutService().updateSurveyDetails(payload, (result) => {
      if (result?.status === 200) {
        setNotify("");
        navigate("/survey/submitted");
      }
    });
  };
  const handleReset = () => {
    form.resetFields();
  };
  const handleSearch = (value) => {
    setSearchInput(value.value);
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
          onChange={handleSearch}
        />
        <div className="cards-container">
          {usersList.map(
            (member) =>
              member.user.role === "user" && (
                <Card
                  key={member?.user?.ID}
                  onClick={() => setSelectedMember(member)}
                  className={
                    selectedMember?.user?.name === member?.user?.name
                      ? "member-card bg"
                      : "member-card"
                  }
                >
                  <div className="text-image-container">
                    {member?.user?.name}
                    {member?.positives !== "" &&
                      member?.negatives !== "" &&
                      member?.rating !== 0 && (
                        <img
                          src="/images/feedback_updated.svg"
                          alt={i18n.t("imageAlt.gauge")}
                          className="feedback-updated-image"
                        />
                      )}
                  </div>
                </Card>
              ),
          )}
        </div>
      </Col>
      <Col xs={24} md={16} xl={16}>
        <div className="feeback-names">
          <p className="feedback-title">{i18n.t("teamFeedBack.feedback")}</p>
          <p className="name">{selectedMember?.user?.name}</p>
        </div>
        <Form form={form} onFinish={onFinish} onValuesChange={onValuesChange}>
          <Row className="text-area-container">
            <Col xs={24} lg={12}>
              <p>{i18n.t("teamFeedBack.positives")}</p>
              <Form.Item name="positives">
                <TextArea
                  rows={4}
                  className="text-area"
                  placeholder={i18n.t("placeholder.message")}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={11}>
              <p>{i18n.t("teamFeedBack.areaOfImprovement")}</p>
              <Form.Item name="improvements">
                <TextArea
                  rows={4}
                  className="text-area"
                  placeholder={i18n.t("placeholder.message")}
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
                allowHalf
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
          <Button className="draft-button" onClick={handleFeedbackasDraft}>
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
TeamMembersFeedBack.propTypes = {
  surveyId: PropTypes.number.isRequired,
};
