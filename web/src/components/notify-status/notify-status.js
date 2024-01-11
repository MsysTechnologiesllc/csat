import React, { useEffect, useState } from "react";
import { notification } from "antd";
import PropTypes from "prop-types";
import "./notify-status-style.scss";
import { STATUS_KEY, NOTIFICATION_DURATION } from "../../common/constants";
import { CheckCircleOutlined } from "@ant-design/icons";

const NotifyStatus = ({ status, message }) => {
  const [info, setInfo] = useState(status && status);
  const [statusAbout, setStatusAbout] = useState();
  const resetStates = () => {
    setStatusAbout();
    setInfo();
  };
  const notifyStatus = (type) => {
    switch (type) {
      case "draft":
        setStatusAbout(
          notification["success"]({
            onClose: resetStates,
            icon: (
              <div className="tick-container">
                <CheckCircleOutlined className="tick" />
              </div>
            ),
            className: "notify-status-container",
            key: STATUS_KEY,
            message: <h2 className="message-title">{message}</h2>,
            duration: NOTIFICATION_DURATION,
          }),
        );
        break;
      default:
    }
  };
  useEffect(() => {
    notifyStatus(info);
  });
  return <>{statusAbout}</>;
};
NotifyStatus.propTypes = {
  status: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};
export default NotifyStatus;
