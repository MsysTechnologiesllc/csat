import { Button, Col, Row } from "antd";
import PropTypes from "prop-types";
import i18n from "../../locales/i18next";
import Clock from "../../assets/images/clock-failed.svg";
import "./warnings.scss";
function ExpireMessage({ resend, resendLoader, enableSuccessMessage, email }) {
  return (
    <Row>
      <Col span={24} className="expire-message">
        <p className="create-message">{i18n.t("login.sessionExpired")}</p>
        <img className="tick-image" src={Clock} alt="right" />
        <p className="req-password">{i18n.t("login.reqPassword")}</p>
        {enableSuccessMessage === false ? (
          <Button
            className="expire-button"
            onClick={resend}
            loading={resendLoader}
          >
            {i18n.t("login.reqLink")}
          </Button>
        ) : (
          <p className="sent">
            {i18n.t("login.sentPwdResetLink")}
            <span>{email}</span>
            {i18n.t("login.validFor")}
          </p>
        )}
      </Col>
    </Row>
  );
}
export default ExpireMessage;

ExpireMessage.propTypes = {
  email: PropTypes.string.isRequired,
  resend: PropTypes.func.isRequired,
  resendLoader: PropTypes.bool.isRequired,
  enableSuccessMessage: PropTypes.bool.isRequired,
};
