import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate, useLocation } from "react-router";
import i18n from "../../locales/i18next";
import { DaysAdded } from "../../utils/utils";
import { GetService } from "../../services/get";
import "./greetings.scss";
// import { PostService } from "../../services/post";
// import NotifyStatus from "../notify-status/notify-status";

function GreetingsPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const survey_id = params.get("survey_id");
  const passCode = params.get("passcode");
  const [surveyDetails, setSurveyDetails] = useState({});
  // const [passcode, setPasscode] = useState(true);
  // const [isModal, setIsModal] = useState(false);
  // const [notify, setNotify] = useState("");
  // const [message, setMessage] = useState("");
  // const handlePasscode = () => {
  //   setIsModal(true);
  // };
  useEffect(() => {
    if (survey_id && passCode) {
      new GetService().getSurveyDetails(survey_id, passCode, (result) => {
        if (result?.data?.data) {
          setSurveyDetails(result?.data?.data);
        }
      });
    }
  }, [survey_id, passCode]);
  // const handleFinish = (values) => {
  //   setPasscodeloader(true);
  //   const payload = {
  //     survey_id: JSON.parse(survey_id),
  //     passcode: values.passcode,
  //   };
  //   new PostService().postCredentials(payload, (result) => {
  //     if (result?.status === 200) {
  //       setPasscodeloader(false);
  //       setNotify("success");
  //       setMessage("Success");
  //       setIsModal(false);
  //       setPasscode(false);
  //       getSurveyDetailsApi(survey_id);
  //       setTimeout(() => {
  //         setNotify("");
  //       });
  //     } else {
  //       setPasscodeloader(false);
  //       setNotify("warning");
  //       setMessage("Incorrect Passcode to access the Survey");
  //       setTimeout(() => {
  //         setNotify("");
  //       });
  //     }
  //   });
  // };
  // const checkPasswordStrength = (rule, value, callback) => {
  //   if (value.length !== 12) {
  //     callback("Passcode must be 12 characters long");
  //   } else {
  //     callback();
  //   }
  // };
  const getStarted = (id, code) => {
    navigate(`/survey?survey_id=${id}&passcode=${code}`, {
      state: {
        surveyDetails: surveyDetails,
        status: surveyDetails?.Survey?.status === "publish" ? true : false,
      },
    });
  };
  useEffect(() => {
    if (survey_id) {
      setSpinLoader(false);
    }
  }, [survey_id]);
  const Loader = () => {
    return (
      <div>
        <div className="loading">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  };
  const [spinLoader, setSpinLoader] = useState(true);
  // const [passcodeLoader, setPasscodeloader] = useState(false);
  return (
    <>
      {spinLoader ? (
        <div className="report-loading-spinner">
          <Loader />
        </div>
      ) : (
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
              {/* {passcode === false && ( */}
              <div className="greetings-description">
                <h1 className="greetings-title">
                  {surveyDetails?.SurveyFormat?.title}
                </h1>
                <p className="greetings-desc">
                  {surveyDetails?.SurveyFormat?.message}
                </p>
              </div>
              {/* )} */}
            </div>
            <div className="details-container">
              {/* {passcode === false && ( */}
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
              {/* )} */}
              {/* {passcode ? (
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
                            loading={passcodeLoader}
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
              ) : ( */}
              <Button
                className="active-button"
                onClick={() =>
                  getStarted(
                    surveyDetails?.Survey?.ID,
                    surveyDetails?.Survey?.passcode,
                  )
                }
              >
                {surveyDetails?.Survey?.status === "publish"
                  ? i18n.t("greetings.reviewFeedback")
                  : i18n.t("greetings.getStarted")}
              </Button>
              {/* )} */}
            </div>
          </div>
          {/* {notify && <NotifyStatus status={notify} message={message} />} */}
        </>
      )}
    </>
  );
}

export default GreetingsPage;
