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

export const TeamMembersFeedBack = ({ surveyId, surveyDetails, status }) => {
  const { TextArea } = Input;
  const { InputField, NoData } = plLibComponents.components;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [usersList, setUsersList] = useState([]);
  const [selectedMember, setSelectedMember] = useState([]);
  const [notify, setNotify] = useState("");
  const [message, setMessage] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [save, setSave] = useState(false);
  const { state } = useLocation();
  const [surveyStatus, setSurveyStatus] = useState("");
  const [feedback, setFeedback] = useState({});
  const [usersFeedback, setUsersFeedback] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [getApi, setGetApi] = useState(false);
  const [draftDisabled, setDraftDisabled] = useState(false);
  const [draftApi, setDraftApi] = useState(false);
  const [publicStatus, setPublicStatus] = useState(false);
  const handleFieldFinish = (changedFields, allFields) => {
    const obj = {};
    allFields.map((each) => {
      if (each?.name[0] === "positives") {
        return (obj.positives = each.value);
      } else if (each?.name[0] === "improvements") {
        return (obj.negatives = each.value);
      } else if (each?.name[0] === "rating") {
        return (obj.rating = each.value);
      }
      return obj;
    });
    obj.name = selectedMember?.user?.name;
    obj.userFeedbackId = selectedMember?.ID;
    setFeedback(obj);
  };
  const handleMember = (member) => {
    setSelectedMember(member);
    const user = usersFeedback?.filter(
      (user) =>
        user?.name === selectedMember?.user?.name ||
        user?.name === feedback?.name,
    );
    if (user.length === 0) setUsersFeedback((item) => [...item, feedback]);
  };

  useEffect(() => {
    if (surveyDetails) {
      setUsersList(
        surveyDetails?.Survey?.user_feedbacks.filter(
          (user) => user.role === "member",
        ),
      );
      if (surveyDetails?.Survey?.user_feedbacks?.length > 0) {
        const users = surveyDetails?.Survey?.user_feedbacks?.filter(
          (user) => user?.user?.role === "member",
        );
        setSelectedMember(users[0]);
      }
      setSurveyStatus(status);
    } else {
      new GetService().getManagerSurveyDetails(
        surveyId ? surveyId : state?.surveyDetails?.Survey?.ID,
        // state?.surveyDetails?.Survey?.passcode,
        (result) => {
          if (result?.data?.data) {
            setUsersList(
              result?.data?.data?.Survey?.user_feedbacks.filter(
                (user) => user.role === "member",
              ),
            );
            setPublicStatus(
              result?.data?.data?.Survey?.status === "publish" && true,
            );
            if (result?.data?.data?.Survey?.user_feedbacks?.length > 0) {
              const users = result?.data?.data?.Survey?.user_feedbacks?.filter(
                (user) => user.user.role === "member",
              );
              setSelectedMember(users[0]);
            }
            setSurveyStatus(result?.data?.data?.Survey?.status);
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
    }
  }, [save, searchInput]);
  useEffect(() => {
    if (
      selectedMember?.positives !== "" ||
      selectedMember?.negatives !== "" ||
      selectedMember?.rating !== 0
    ) {
      form.setFieldsValue({
        positives: selectedMember?.positives,
        improvements: selectedMember?.negatives,
        rating: selectedMember?.rating,
      });
    } else if (usersFeedback?.length > 0) {
      const user = usersFeedback.filter(
        (each) => each.name === selectedMember?.user?.name,
      );
      form.setFieldsValue({
        positives: user[0]?.positives,
        improvements: user[0]?.negatives,
        rating: user[0]?.rating,
      });
    }
  }, [selectedMember, usersFeedback]);
  const handleBack = () => {
    setNotify("");
    navigate(
      `/survey?survey_id=${state?.surveyDetails?.Survey?.ID}&passcode=${state?.surveyDetails?.Survey?.passcode}`,
      {
        state: { surveyDetails: state?.surveyDetails, status: state?.status },
      },
    );
  };

  useEffect(() => {
    if (getApi) {
      const payload = {
        survey_id: state?.surveyDetails?.Survey?.ID,
        survey_answers: state?.questionsData,
        survey_status: "publish",
        project_id: state?.surveyDetails?.Survey?.project_id,
      };
      new PutService().updateSurveyDetails(payload, (result) => {
        if (result?.status === 200) {
          setSubmitLoader(false);
          setNotify("");
          navigate("/survey/submitted");
        }
      });
    }
  }, [getApi]);
  useEffect(() => {
    if (disabled) {
      usersFeedback.map((payload) => {
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
      });
      setGetApi(true);
    }
  }, [disabled]);
  useEffect(() => {
    if (draftApi) {
      const payload = {
        survey_id: state?.surveyDetails?.Survey?.ID,
        survey_answers: state?.questionsData,
        survey_status: "draft",
        project_id: state?.surveyDetails?.Survey?.project_id,
      };
      new PutService().updateSurveyDetails(payload, (result) => {
        if (result?.status === 200) {
          setDraftLoader(false);
          setNotify("success");
          setMessage(i18n.t("common.draftMessage"));
          setTimeout(() => {
            setNotify("");
            setDraftApi(false);
          }, 2000);
        }
      });
    }
  }, [draftApi]);
  useEffect(() => {
    setDisabled(false);
  }, []);
  useEffect(() => {
    if (draftDisabled) {
      usersFeedback.map((payload) => {
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
      });
      setDraftDisabled(false);
      setDisabled(false);
      setDraftApi(true);
    }
  }, [draftDisabled]);
  const handleFeedbackasDraft = () => {
    setDraftLoader(true);
    setUsersFeedback((item) => [...item, feedback]);
    setDraftDisabled(true);
  };
  const handleSubmit = async () => {
    setSubmitLoader(true);
    setUsersFeedback((item) => [...item, feedback]);
    setDisabled(true);
  };
  // const handleReset = () => {
  //   form.resetFields();
  // };
  const handleSearch = (value) => {
    setSearchInput(value.value);
  };
  const customStarIcons = Array.from({ length: 5 }, (_, index) => (
    <IoStarSharp key={index} className="rating-icon" />
  ));
  const [draftLoader, setDraftLoader] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  return usersList.length === 0 ? (
    <NoData
      heading={i18n.t("error.noData")}
      descriptionLine1=""
      descriptionLine2=""
    />
  ) : (
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
          {usersList?.map((member) => (
            <Card
              key={member?.user?.ID}
              onClick={() => handleMember(member)}
              className={
                selectedMember?.user?.name === member?.user?.name
                  ? "member-card bg"
                  : "member-card"
              }
            >
              <div className="text-image-container">
                <p className="user-name" title={member?.user?.name}>
                  {member?.user?.name}
                </p>
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
          ))}
        </div>
      </Col>
      <Col xs={24} md={16} xl={16}>
        <div className="feeback-names">
          <p className="feedback-title">{i18n.t("teamFeedBack.feedback")}</p>
          <p className="name">{selectedMember?.user?.name}</p>
        </div>
        <Form form={form} onFieldsChange={handleFieldFinish}>
          <Row className="text-area-container">
            <Col xs={24} lg={12}>
              <p>{i18n.t("teamFeedBack.positives")}</p>
              <Form.Item name="positives">
                <TextArea
                  rows={4}
                  className="text-area"
                  placeholder={i18n.t("placeholder.message")}
                  disabled={
                    state?.status === undefined ? publicStatus : state?.status
                  }
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
                  disabled={
                    state?.status === undefined ? publicStatus : state?.status
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
                allowHalf
                className="rating"
                character={({ index = 0 }) => customStarIcons[index]}
                disabled={
                  state?.status === undefined ? publicStatus : state?.status
                }
              />
            </Form.Item>
          </Col>
        </Form>
      </Col>
      <div className="btn-container">
        <Button type="text" className="cancel-button" onClick={handleBack}>
          <GoArrowLeft className="arrow-icon" />
          <span> {i18n.t("button.back")}</span>
        </Button>
        {surveyStatus !== "publish" && (
          <div className="draft-submit-btns">
            <Button
              disabled={draftDisabled}
              className={
                draftDisabled === true ? "disabled-button" : "draft-button"
              }
              onClick={handleFeedbackasDraft}
              loading={draftLoader}
            >
              {i18n.t("button.saveAsDraft")}
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              className={
                disabled === true
                  ? "active-button disabled-button"
                  : "active-button"
              }
              disabled={disabled}
              loading={submitLoader}
            >
              {i18n.t("button.submit")}
            </Button>
          </div>
        )}
      </div>
      {notify && <NotifyStatus status={notify} message={message} />}
    </Row>
  );
};
TeamMembersFeedBack.propTypes = {
  surveyId: PropTypes.number,
  surveyDetails: PropTypes.object,
  status: PropTypes.bool,
};
