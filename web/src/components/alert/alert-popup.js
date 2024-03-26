import { Modal } from "antd";
import "./alert-popup.scss";
import { WarningOutlined } from "@ant-design/icons";
import i18n from "../../locales/i18next";

export const AlertPopup = ({
  title = i18n.t(`common.error`),
  errorMessage = i18n.t(`alert.emailError`),
  showAlert,
  onClose,
}) => {
  let message = (typeof errorMessage) === "string" ? errorMessage : i18n.t(`alert.emailError`);
  return (
    <Modal
      title={title || "Error"}
      centered
      open={showAlert}
      maskClosable={false}
      className="alert-modal"
      onCancel={() => onClose(false)}
      footer={null}
    >
      <div className="alert-div"><WarningOutlined className="warn-icon"  /><span>{message}</span></div>
    </Modal>
  );
};
