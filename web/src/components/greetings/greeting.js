import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { useNavigate, useParams } from "react-router";
import i18n from "../../locales/i18next";
import { DaysAdded } from "../../utils/utils";
import { GetService } from "../../services/get";
import "./greetings.scss";
import { PostService } from "../../services/post";
import NotifyStatus from "../notify-status/notify-status";

function GreetingsPage() {
  const navigate = useNavigate();
  const { survey_id } = useParams();
  const [surveyDetails, setSurveyDetails] = useState({});
  const [passcode, setPasscode] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const [notify, setNotify] = useState("");
  const [message, setMessage] = useState("");
  const handlePasscode = () => {
    setIsModal(true);
  };
  const handleFinish = (values) => {
    const payload = {
      survey_id: JSON.parse(survey_id),
      passcode: values.passcode,
    };
    new PostService().postCredentials(payload, (result) => {
      if (result?.status === 200) {
        setNotify("success");
        setMessage("Successfully Entered Correct Passcode");
        setIsModal(false);
        setPasscode(false);
        setTimeout(() => {
          setNotify("");
        });
      } else {
        setNotify("warning");
        setMessage("Incorrect Passcode of the Survey");
        setTimeout(() => {
          setNotify("");
        });
      }
    });
    console.log(payload);
  };
  const checkPasswordStrength = (rule, value, callback) => {
    if (value.length !== 12) {
      callback("Passcode must be 12 characters long");
    } else {
      callback();
    }
  };
  useEffect(() => {
    if (survey_id) {
      new GetService().getSurveyDetails(survey_id, (result) => {
        if (result?.data?.data) {
          setSurveyDetails(result?.data?.data);
        }
      });
    }
  }, [survey_id]);
  const getStarted = (id) => {
    navigate(`/survey/${id}`, {
      state: {
        surveyDetails: surveyDetails,
        status: surveyDetails?.Survey?.status === "publish" ? true : false,
      },
    });
  };
  return (
    <>
      <div className="greetings-container">
        <div className="greetings-main-container">
          <div className="greetings-image-container">
            <img
              src="/images/greetings-image.svg"
              alt={i18n.t("greetings.altText")}
              className="greetings-image"
            />
          </div>
          {passcode === false && (
            <div className="greetings-description">
              <h1 className="greetings-title">
                {surveyDetails?.SurveyFormat?.title}
              </h1>
              <p className="greetings-desc">
                {surveyDetails?.SurveyFormat?.message}
              </p>
            </div>
          )}
        </div>
        <div className="details-container">
          {passcode === false && (
            <div className="project-details-container">
              <div span={4} className="details">
                <p className="title">{i18n.t("greetings.project")}</p>
                <p className="desc">{surveyDetails?.Survey?.project?.name}</p>
              </div>
              <div span={4} className="details">
                <p className="title">{i18n.t("greetings.projectManager")}</p>
                <p className="desc">{surveyDetails?.SurveyFormat?.PM_name}</p>
              </div>
              <div span={4} className="details">
                <p className="title">{i18n.t("greetings.deliveryHead")}</p>
                <p className="desc">{surveyDetails?.SurveyFormat?.DH_name}</p>
              </div>
              <div span={4} className="details">
                <p className="title">{i18n.t("greetings.shareBefore")}</p>
                <p className="desc">
                  {DaysAdded(
                    surveyDetails?.SurveyFormat?.survey_frequency_days,
                  )}
                </p>
              </div>
            </div>
          )}
          {passcode ? (
            <>
              <Button className="active-button" onClick={handlePasscode}>
                {i18n.t("greetings.passCode")}
              </Button>
              {isModal && (
                <Modal
                  open={isModal}
                  footer={false}
                  className="passcode-modal"
                  closable={false}
                >
                  <Form onFinish={handleFinish} className="passcode-form">
                    <Form.Item
                      name="passcode"
                      rules={[
                        {
                          required: true,
                          message: "Please input your passcode!",
                        },
                        {
                          validator: checkPasswordStrength,
                        },
                      ]}
                      label="Enter Passode:"
                    >
                      <Input.Password />
                    </Form.Item>
                    <div>
                      <Button
                        htmlType="submit"
                        type="text"
                        className="submit-button"
                      >
                        {i18n.t("button.submit")}
                      </Button>
                    </div>
                  </Form>
                </Modal>
              )}
            </>
          ) : (
            <Button
              className="active-button"
              onClick={() => getStarted(surveyDetails?.Survey?.ID)}
            >
              {surveyDetails?.Survey?.status === "publish"
                ? i18n.t("greetings.reviewFeedback")
                : i18n.t("greetings.getStarted")}
            </Button>
          )}
        </div>
      </div>
      {notify && <NotifyStatus status={notify} message={message} />}
    </>
  );
}

export default GreetingsPage;
