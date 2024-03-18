import { Button, Col, Form, Input, Row } from "antd";
import PropTypes from "prop-types";
import { useEffect } from "react";
import "./sso-integration.scss";
import i18n from "../../locales/i18next";
function ForgotPassword({ value, callBack, isLoading }) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      email: value,
    });
  }, [form, value]);
  function onForgotPassword(values) {
    callBack(values);
  }
  return (
    <Row className="forgot-container">
      <p>{i18n.t("login.resetInstructions")}</p>
      <Col span={24} className="modal-form-container">
        <Form
          name="forgot-password-form"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className="forgot-form"
          onFinish={onForgotPassword}
          autoComplete="off"
          layout="vertical"
          form={form}
        >
          <Form.Item
            label="Registered Email Address"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: i18n.t("login.validEmail"),
              },
            ]}
          >
            <Input placeholder={i18n.t("login.email")} />
          </Form.Item>
          <Form.Item className="one">
            <Button
              disabled={isLoading}
              loading={isLoading}
              type="primary"
              htmlType="submit"
            >
              {i18n.t("login.continue")}
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
export default ForgotPassword;

ForgotPassword.propTypes = {
  value: PropTypes.string.isRequired,
  callBack: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
