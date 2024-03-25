import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate, useLocation } from "react-router";
import i18n from "../../locales/i18next";
import { DaysAdded } from "../../utils/utils";
import { GetService } from "../../services/get";
import { plLibComponents } from "../../context-provider/component-provider";
import "./greetings.scss";

function GreetingsPage() {
  const { NoData } = plLibComponents.components;
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const survey_id = params.get("survey_id");
  const passCode = params.get("passcode");
  const [surveyDetails, setSurveyDetails] = useState({});
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    setSpinLoader(true);
    if (survey_id && passCode) {
      new GetService().getSurveyDetails(survey_id, passCode, (result) => {
        if (result?.data?.data && result?.status === 200) {
          setSurveyDetails(result?.data?.data);
          setSpinLoader(false);
        }
      });
    } else {
      setNotFound(true);
      setSpinLoader(false);
    }
  }, [survey_id, passCode]);
  const getStarted = (id, code) => {
    navigate(`/survey?survey_id=${id}&passcode=${code}`, {
      state: {
        surveyDetails: surveyDetails,
        status: surveyDetails?.Survey?.status === "publish" ? true : false,
      },
    });
  };
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
  return (
    <>
      {spinLoader ? (
        <div className="report-loading-spinner">
          <Loader />
        </div>
      ) : spinLoader == false && notFound ? (
        <NoData
          heading={i18n.t("error.noData")}
          descriptionLine1=""
          descriptionLine2=""
        />
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
              <div className="greetings-description">
                <h1 className="greetings-title">
                  {surveyDetails?.SurveyFormat?.title}
                </h1>
                <p className="greetings-desc">
                  {surveyDetails?.SurveyFormat?.message}
                </p>
              </div>
            </div>
            <div className="details-container">
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
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default GreetingsPage;
