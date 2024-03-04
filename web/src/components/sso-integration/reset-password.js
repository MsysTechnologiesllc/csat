import { Button, Col, Form, Input, Modal, Row } from "antd";
import { useLocation, useNavigate } from "react-router";
import { PutService } from "../../services/put";
import { useState, useEffect } from "react";
import OkMessage from "./ok-message";
import ExpireMessage from "./expire-message";
import { GetService } from "../../services/get";
import i18n from "../../locales/i18next";
import {
  PASSWORD_VALIDATION,
  PASSWORD_VALIDATION_MESSAGE,
} from "../../common/constants";
function ResetPassword() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const token = params.get("token");
  const navigate = useNavigate();
  const [isExpired, setIsExpired] = useState(false);
  const [isOkMessage, setIsOkMessage] = useState(false);

  useEffect(() => {
    setIsExpired(false);
  }, []);

  function openSignIn() {
    setIsOkMessage(false);
  }

  const onResetPassword = (values) => {
    let email = localStorage.getItem("email");
    const payload = {
      email: email,
      new_password: values.password,
      confirm_password: values.confirmPassword,
      token: token,
    };
    new PutService().updatePassword(payload, (result) => {
      if (result?.status === 200) {
        setIsOkMessage(true);
        navigate("/login");
      }
    });
  };

  function resendRequest() {
    let email = localStorage.getItem("email");
    new GetService().getForgotPassword(email, (result) => {
      if (result.status === 200) {
        console.log("resend succes");
      }
    });
  }
  return (
    <>
      {isExpired ? (
        <ExpireMessage resend={resendRequest} />
      ) : (
        <>
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
              <h1 className="reset-text">{i18n.t("login.resetPwd")}</h1>
              <Form
                name="basic"
                wrapperCol={{ span: 24 }}
                className="sign-up-form"
                initialValues={{ remember: true }}
                onFinish={onResetPassword}
                autoComplete="off"
              >
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Please type your Password" },
                    {
                      pattern: PASSWORD_VALIDATION,
                      message: PASSWORD_VALIDATION_MESSAGE,
                    },
                  ]}
                >
                  <Input.Password placeholder={i18n.t("login.password")} />
                </Form.Item>
                <Form.Item
                  dependencies={["password"]}
                  name="confirmPassword"
                  rules={[
                    { required: true, message: i18n.t("login.confirmPwd") },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(i18n.t("login.PwdnotMatch")),
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder={i18n.t("login.confirmPwd")} />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 24 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="update-button"
                  >
                    {i18n.t("login.updatePwd")}
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <Modal
            title=""
            centered
            open={isOkMessage}
            onCancel={openSignIn}
            className="ok-message-modal"
            footer={[
              <div key="success" className="signIn-btn">
                <Button type="primary" onClick={openSignIn}>
                  {i18n.t("login.continue")} {i18n.t("login.signIn")}
                </Button>
              </div>,
            ]}
          >
            <OkMessage />
          </Modal>
        </>
      )}
    </>
  );
}
export default ResetPassword;
