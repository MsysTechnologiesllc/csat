import { Button, Form, Input, Modal } from "antd";
import React, { useState } from "react";
import PropTypes from "prop-types";
import i18n from "../../../locales/i18next";
import { PostService } from "../../../services/post";

export const AddClient = ({
  surveyDetails,
  setDropdownOptions,
  setMessage,
  setNotify,
  setSelectedClient,
}) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = (values) => {
    console.log(values, "called");
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
        setSelectedClient((prev) => [...prev, values.email]);
        setTimeout(() => {
          setNotify("");
        }, 2000);
        setTimeout(() => {
          setSelectedClient([]);
        }, 200);
      }
    });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="add-client-btn-container">
      <Button type="primary" onClick={showModal} className="add-client-button">
        {i18n.t("settings.add")}
      </Button>
      <Modal
        title={i18n.t("settings.addClient")}
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <Form form={form} className="add-client-container" onFinish={handleOk}>
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
            <Button
              htmlType="submit"
              type="text"
              className="submit-btn"
              // onClick={handleOk}
            >
              {i18n.t("button.submit")}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
AddClient.propTypes = {
  surveyDetails: PropTypes.object,
  setDropdownOptions: PropTypes.array,
  setMessage: PropTypes.string,
  setNotify: PropTypes.string,
  setSelectedClient: PropTypes.array,
};
