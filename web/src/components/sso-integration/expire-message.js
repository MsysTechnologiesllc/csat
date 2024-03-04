import { Button, Col } from "antd";
import PropTypes from "prop-types";
import i18n from "../../locales/i18next";

function ExpireMessage({ resend }) {
  return (
    <Col span={24} className="expire-message">
      <p className="create-message">{i18n.t("login.sessionExpired")}</p>
      <p>{i18n.t("login.reqPassword")}</p>
      <Button type="primary" className="request-btn" onClick={resend}>
        {i18n.t("login.reqLink")}
      </Button>
    </Col>
  );
}
export default ExpireMessage;

ExpireMessage.propTypes = {
  resend: PropTypes.func.isRequired,
};
