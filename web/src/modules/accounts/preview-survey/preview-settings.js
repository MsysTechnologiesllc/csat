import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, TreeSelect } from "antd";
import PropTypes from "prop-types";
import moment from "moment";
import "./preview-survey.scss";
import { PostService } from "../../../services/post";
import NotifyStatus from "../../../components/notify-status/notify-status";
import i18n from "../../../locales/i18next";

export const PreviewSettings = ({ userFeedback, surveyDetails }) => {
  const [form] = Form.useForm();
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedClient, setSelectedClient] = useState([]);
  const [notify, setNotify] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = (values) => {
    const payload = {
      survey_id: surveyDetails?.Survey?.ID,
      name: values.newClientName,
      email: values.email,
    };
    new PostService().createClient(payload, (result) => {
      if (result?.status === 200) {
        form.resetFields();
        setIsModalOpen(false);
        setNotify("success");
        setMessage("Successfully added new client");
        const option = {};
        option.value = values.email;
        option.title = values.newClientName;
        setDropdownOptions((options) => [...options, option]);
        setTimeout(() => {
          setNotify("");
        }, 1000);
      }
    });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
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
    const payload = {
      survey_id: surveyDetails?.Survey?.ID,
      survey_dates: selectedDates,
      client_email: selectedClient,
    };
    new PostService().createSurvey(payload, (result) => {
      if (result?.status === 200) {
        setSelectedClient([]);
        setSelectedDates([]);
        setNotify("success");
        setMessage("Successfully sent survey");
        setTimeout(() => {
          setNotify("");
          window.location.reload();
        }, 1000);
      }
    });
  };
  const handleSelect = (values) => {
    setSelectedClient(values);
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
          <Button type="primary" onClick={showModal}>
            {i18n.t("settings.add")}
          </Button>
          <Modal
            title={i18n.t("settings.addClient")}
            open={isModalOpen}
            footer={null}
            onCancel={handleCancel}
          >
            <Form
              form={form}
              className="add-client-container"
              onFinish={handleOk}
            >
              <Form.Item
                name="newClientName"
                rules={[{ required: true, message: "Name field is required" }]}
                label={i18n.t("settings.clientName")}
              >
                <Input
                  placeholder={i18n.t("settings.namePlaceholder")}
                  className="client-input"
                />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[{ required: true, message: "Email field is required" }]}
                label={i18n.t("settings.clientEmail")}
              >
                <Input
                  placeholder={i18n.t("settings.emailPlaceholder")}
                  className="client-input"
                />
              </Form.Item>
              <div className="btn-container">
                <Button htmlType="submit" type="text" className="submit-btn">
                  {i18n.t("button.submit")}
                </Button>
              </div>
            </Form>
          </Modal>
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
        <div>
          <Button
            htmlType="submit"
            disabled={
              selectedClient === "" || !selectedDates.length ? true : false
            }
          >
            {i18n.t("accounts.sendClient")}
          </Button>
        </div>
      </Form>
      {notify && <NotifyStatus status={notify} message={message} />}
    </>
  );
};
PreviewSettings.propTypes = {
  userFeedback: PropTypes.array.isRequired,
  surveyDetails: PropTypes.object.isRequired,
};
