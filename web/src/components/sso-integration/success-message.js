import { Button, Col, Row } from "antd";
import PropTypes from "prop-types";
import "./sso-integration.scss";
import i18n from "../../locales/i18next";
function SuccessMessage({ email, resend, isLoading }) {
  return (
    <Row className="forgot-password-modal success-mod">
      <Col span={24} className="modal-form-container">
        <p>{i18n.t("login.sentPwdResetLink")} </p>
        <p>{email}</p>
        <p> {i18n.t("login.validFor")}</p>
        <div className="resend-link">
          <span> {i18n.t("login.emailNotReceive")} </span>
          <Button disabled={isLoading} type="link" onClick={() => resend(true)}>
            {i18n.t("login.resend")}
          </Button>
        </div>
      </Col>
    </Row>
  );
}
export default SuccessMessage;

SuccessMessage.propTypes = {
  email: PropTypes.string.isRequired,
  resend: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
