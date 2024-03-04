import { Button, Col, Form, Input, Modal, Row } from "antd";
// import "./login.scss";
import { useNavigate } from "react-router";
// import Banner from "./banner";
import { PutService } from "../../services/put";
// import Learniply from "../../assets/images/login/learniply-Logo.svg";
// import jwt_decode from "jwt-decode";
import { useState } from "react";
import OkMessage from "./ok-message";
// import ExpireMessage from "./expire-message";
// import TokenUtil from "../../utils/TokenUtil";
// import PropTypes from "prop-types";
// import { GetService } from "../../services/get";
import i18n from "../../locales/i18next";
import {
  PASSWORD_VALIDATION,
  PASSWORD_VALIDATION_MESSAGE,
} from "../../common/constants";
function ResetPassword() {
//   const [form] = Form.useForm();
  const navigate = useNavigate();
  const [decodedEmail, setDecodedEmail] = useState("");
  //   const [isExpired, setIsExpired] = useState(true);
  const [isOkMessage, setIsOkMessage] = useState(false);
  //   useEffect(() => {
  //     (() => {
  //       let path = window.location.pathname.split("/");
  //       if (path.length) {
  //         var decoded = jwt_decode(path[path.length - 1]);
  //         setDecodedEmail(decoded.email);
  //         if (Number(decoded.expire) > new Date().getTime()) {
  //           setIsExpired(false);
  //         }
  //       }
  //     })();
  //   }, []);

  function openSignIn() {
    setIsOkMessage(false);
    navigate("/learniply/login");
  }

  //   function onResetPassword(values) {
  //     new PutService().resetPassword(
  //       {
  //         newPassword: String(values.password),
  //         newPasswordConfirm: String(values.password),
  //         email: decodedEmail,
  //       },
  //       (result) => {
  //         if (result) {
  //           setIsOkMessage(true);
  //         }
  //       }
  //     );
  //   }

  //   function resendRequest() {
  //     console.log("resendRequest");
  //     // const token = TokenUtil.generateJwtToken(decodedEmail);
  //     // const link = `${process.env.REACT_APP_REDIRECT_URL}/learniply/resetPassword/${token}`;
  //     // new GetService().resetPasswordRequest(link, decodedEmail, (result) => {});
  //   }

  const onResetPassword = (values) => {
    console.log(values);
  };
  return (
    <>
      {/* {isExpired ? (
        <ExpireMessage resend={resendRequest} />
      ) : ( */}
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
            <p>Reset Password</p>
          </div>
          {/* <Form
            form={form}
            name="resetPassword"
            onFinish={handleUpdatePassword}
            scrollToFirstError
          >
            <Form.Item
              name="password"
              label="New Password"
              rules={[
                {
                  required: true,
                  message: "Please input your new password!",
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The new password that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="update-button"
              >
                Update Password
              </Button>
            </Form.Item>
          </Form> */}
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
              <Button type="primary" htmlType="submit" className="sign-in-btn">
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
  );
}
export default ResetPassword;
