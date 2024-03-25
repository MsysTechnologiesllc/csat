import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, TreeSelect } from "antd";
import PropTypes from "prop-types";
import moment from "moment";
import "./preview-survey.scss";
import { PostService } from "../../../services/post";
import NotifyStatus from "../../../components/notify-status/notify-status";
import i18n from "../../../locales/i18next";
import { AddClient } from "./add-client";

export const PreviewSettings = ({ userFeedback, surveyDetails }) => {
  const [form] = Form.useForm();
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedClient, setSelectedClient] = useState([]);
  const [notify, setNotify] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userFeedback.length > 0) {
      const dropdown = [];
      userFeedback?.filter((each) => {
        if (each?.user?.role === "client") {
          dropdown.push({
            key: each?.user?.ID,
            value: each?.user?.email,
            title: each?.user?.name,
          });
        }
        setDropdownOptions(dropdown);
      });
    }
  }, [userFeedback]);
  const handleFinish = () => {
    setLoading(true);
    const payload = {
      survey_id: surveyDetails?.Survey?.ID,
      survey_dates: selectedDates,
      client_email: selectedClient,
    };
    new PostService().createSurvey(payload, (result) => {
      if (result?.status === 200) {
        setLoading(false);
        setSelectedClient([]);
        setSelectedDates([]);
        setNotify("success");
        setMessage("Successfully sent survey");
        setTimeout(() => {
          setNotify("");
        }, 1000);
      }
    });
  };
  const handleSelect = (values) => {
    setSelectedClient(values);
  };
  const handleChange = (date) => {
    date?.map((each) => {
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
      <AddClient
        surveyDetails={surveyDetails}
        setMessage={setMessage}
        setNotify={setNotify}
        setDropdownOptions={setDropdownOptions}
        setSelectedClient={setSelectedClient}
      />
      <Form form={form} onFinish={handleFinish} className="settings-container">
        <Form.Item className="select-dropdown">
          <TreeSelect
            treeData={dropdownOptions}
            treeNodeFilterProp="title"
            value={selectedClient}
            allowClear="true"
            onChange={handleSelect}
            multiple
            placeholder={i18n.t("settings.selectClients")}
          />
        </Form.Item>
        <Form.Item className="select-dropdown">
          <DatePicker
            multiple
            onChange={handleChange}
            maxTagCount="responsive"
            size="medium"
            className="date-picker"
            showTime
            placeholder={i18n.t("settings.selectDate")}
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            disabled={
              selectedClient === "" || !selectedDates.length ? true : false
            }
            loading={loading}
          >
            {i18n.t("accounts.sendClient")}
          </Button>
        </Form.Item>
      </Form>
      {notify && <NotifyStatus status={notify} message={message} />}
    </>
  );
};
PreviewSettings.propTypes = {
  userFeedback: PropTypes.array.isRequired,
  surveyDetails: PropTypes.object.isRequired,
};
