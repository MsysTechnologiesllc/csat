import { Col } from "antd";
import i18n from "../../locales/i18next";
import Tick from "../../assets/images/tick.svg";
import "./warnings.scss";

function OkMessage() {
  return (
    <Col span={24} className="ok-message">
      <img src={Tick} alt="right" />
      <p className="done-message">{i18n.t("login.allDone")}</p>
      <p className="reset-message"> {i18n.t("login.pwdReset")}</p>
    </Col>
  );
}
export default OkMessage;
