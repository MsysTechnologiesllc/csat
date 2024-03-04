import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Button, Col, Form, Input, Row } from "antd";
import "./sso-integration.scss";
import { PostService } from "../../services/post";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import i18n from "../../locales/i18next";
import { plLibComponents } from "../../context-provider/component-provider";
import NotifyStatus from "../notify-status/notify-status";

export const SSOIntegration = () => {
  const { NavTabs, InputField } = plLibComponents.components;
  const navigate = useNavigate();
  const [notify, setNotify] = useState("");
  const [message, setMessage] = useState("");
  const [passcodeLoader, setPasscodeloader] = useState(false);
  const responseGoogle = async (response) => {
    const payload = {
      access_token: response.access_token,
    };
    if (response) {
      new PostService().postSSOApi(payload, (result) => {
        if (result?.status === 200) {
          if (result?.data?.data) {
            Cookies.set("jwt", result?.data?.data?.token);
            navigate("/accounts");
          }
        }
      });
    }
  };
  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
  });
  const handleFinishUser = (values) => {
    setPasscodeloader(true);
    const payload = {
      passcode: values.passcode,
    };
    new PostService().postCredentials(payload, (result) => {
      if (result?.status === 200) {
        setPasscodeloader(false);
        setNotify("success");
        setMessage("Success");
        setTimeout(() => {
          navigate(
            `/customer-survey?survey_id=${result?.data?.data?.ID}&passcode=${result?.data?.data?.Passcode}`,
          );
          setNotify("");
        }, 1000);
      } else {
        setPasscodeloader(false);
        setNotify("warning");
        setMessage("Incorrect Passcode to access the Survey");
        setTimeout(() => {
          setNotify("");
        }, 1000);
      }
    });
  };
  const checkPasswordStrength = (rule, value, callback) => {
    if (value.length !== 12) {
      callback("Passcode must be 12 characters long");
    } else {
      callback();
    }
  };
  const handleFinishAdmin = (values) => {
    const payload = {
      email: values.username,
      password: values.password,
    };
    new PostService().postLoginDetails(payload, (result) => {
      if (result?.status === 200) {
        console.log(result?.data);
        Cookies.set("jwt", result?.data?.user?.token);
        navigate("/accounts");
      }
    });
  };
  const items = [
    {
      key: "1",
      label: i18n.t("login.admin"),
      children: (
        <>
          <Form onFinish={handleFinishAdmin}>
            <InputField
              type="textinput"
              labelText={i18n.t("login.userName")}
              placeholder={i18n.t("login.userPlaceholder")}
              autoClear
              isForm
              formFieldName="username"
            />
            <InputField
              type="password"
              labelText={i18n.t("login.password")}
              placeholder={i18n.t("login.passwordPlaceholder")}
              isForm
              formFieldName="password"
            />
            <div>
              <Button htmlType="submit" type="text" className="login-button">
                {i18n.t("common.login")}
              </Button>
            </div>
          </Form>
          <p className="sso-description">{i18n.t("login.usingSSO")}</p>
          <Button onClick={googleLogin} type="text" className="google-button">
            <img src="/images/googleLogo.svg" />
            {i18n.t("common.google")}
          </Button>
        </>
      ),
    },
    {
      key: "2",
      label: i18n.t("login.customer"),
      children: (
        <Form onFinish={handleFinishUser}>
          <p className="user-description">{i18n.t("login.passcodeDesc")}</p>
          <p className="user-para">{i18n.t("login.passcodePara")}</p>
          <Form.Item
            name="passcode"
            rules={[
              {
                required: true,
                message: i18n.t("login.message"),
              },
              {
                validator: checkPasswordStrength,
              },
            ]}
          >
            <Input.Password placeholder={i18n.t("login.passcodePlaceholder")} />
          </Form.Item>
          <div>
            <Button
              htmlType="submit"
              type="text"
              className="login-button"
              loading={passcodeLoader}
            >
              {i18n.t("surveyList.viewSurvey")}
            </Button>
          </div>
        </Form>
      ),
    },
  ];
  return (
    <Row className="sso-login-wrapper">
      <Col xs={24} lg={13} className="sso-login-image-container">
        <img
          src="/images/login-image.svg"
          alt={i18n.t("common.logo")}
          className="login-image"
        />
        <h1 className="heading">{i18n.t("login.heading")}</h1>
        <p className="description">{i18n.t("login.desc")}</p>
      </Col>
      <Col xs={24} lg={11} className="login-container">
        <div className="logo-container">
          <img src="/images/msys-group.svg" alt={i18n.t("common.logo")} />
          <p className="csat">
            {i18n.t("header.title")} <span>{i18n.t("header.proto")}</span>
          </p>
        </div>
        <NavTabs tabItems={items} defaultOpenTabKey="" />
      </Col>
      {notify && <NotifyStatus status={notify} message={message} />}
    </Row>
  );
};
