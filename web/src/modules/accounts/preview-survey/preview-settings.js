import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form } from "antd";
import PropTypes from "prop-types";
import { plLibComponents } from "../../../context-provider/component-provider";
import moment from "moment";
import "./preview-survey.scss";
import { PostService } from "../../../services/post";
import NotifyStatus from "../../../components/notify-status/notify-status";
import i18n from "../../../locales/i18next";

export const PreviewSettings = ({ userFeedback, surveyDetails }) => {
  const { SelectionDropdown } = plLibComponents.components;
  const [form] = Form.useForm();
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [notify, setNotify] = useState("");
  useEffect(() => {
    if (userFeedback.length > 0) {
      const dropdown = [];
      userFeedback?.filter((each) => {
        if (each?.user?.role === "client") {
          dropdown.push({
            value: each?.user?.email,
            label: each?.user?.name,
          });
        }
        setDropdownOptions(dropdown);
      });
    }
  }, [userFeedback]);
  const handleFinish = () => {
    const payload = {
      survey_id: surveyDetails?.Survey?.ID,
      survey_dates: selectedDates,
      client_email: selectedClient,
    };
    new PostService().createSurvey(payload, (result) => {
      if (result?.status === 200) {
        setNotify("success");
      }
    });
  };
  const handleSelect = (value) => {
    setSelectedClient(value);
  };
  const handleChange = (date) => {
    date.map((each) => {
      const { $y, $M, $D, $H, $m, $s, $SSS, $Z } = each;
      const formattedDate = moment(
        `${$y}-${$M + 1}-${$D} ${$H}:${$m}:${$s}.${$SSS}${$Z}`,
        "YYYY-MM-DD HH:mm:ss.SSSZZ",
      ).format("YYYY-MM-DD HH:mm:ss.SSSSSSZ");
      setSelectedDates((prev) => [...prev, formattedDate]);
    });
  };
  return (
    <>
      <Form form={form} onFinish={handleFinish} className="settings-container">
        <Form.Item name="clientName" className="select-dropdown">
          <SelectionDropdown
            dropdownPlaceholder="select client"
            handleSelection={handleSelect}
            dropdownOptions={dropdownOptions}
            defaultValue={dropdownOptions[0]?.label}
          />
        </Form.Item>
        <Form.Item name="frequencyDays" className="select-dropdown">
          <DatePicker
            multiple
            onChange={handleChange}
            maxTagCount="responsive"
            size="medium"
            style={{ width: "100%" }}
            showTime
          />
        </Form.Item>
        <div>
          <Button htmlType="submit">{i18n.t("accounts.sendClient")}</Button>
        </div>
      </Form>
      {notify && (
        <NotifyStatus status={notify} message="Successfully sent survey" />
      )}
    </>
  );
};
PreviewSettings.propTypes = {
  userFeedback: PropTypes.array.isRequired,
  surveyDetails: PropTypes.object.isRequired,
};
