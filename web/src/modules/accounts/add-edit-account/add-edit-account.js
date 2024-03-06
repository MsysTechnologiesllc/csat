import React from "react";
import { Form, Input, message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import i18n from "../../../locales/i18next";
import "./add-edit-account.scss";

const AddEditAccount = ({
  getUpdatedFormData,
  formStatus,
  accountsFormData,
}) => {
  const { Dragger } = Upload;
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error(i18n.t("addAccount.fileImageWarning"));
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 3;
    if (!isLt2M) {
      message.error(i18n.t("addAccount.imageSizeWarning"));
      return false;
    }
    return isImage && isLt2M;
  };
  const props = {
    name: "logo",
    beforeUpload: beforeUpload,
    maxCount: 1,
    accept: "image/*",
    action: "",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        //
      }
      if (status === "done") {
        //
      } else if (status === "error") {
        //
      }
    },
    onDrop() {
      //
    },
  };

  return (
    <div className="add-edit-account-container">
      <Form
        name="accounts-form"
        initialValues={
          formStatus === "edit" && accountsFormData ? accountsFormData : false
        }
        className="accounts-form"
        onValuesChange={(changedValues, allValues) => {
          getUpdatedFormData(allValues);
        }}
      >
        <Form.Item
          label="Account Name"
          name="accName"
          rules={[
            {
              required: true,
              message: i18n.t("addAccount.accNameRule"),
            },
          ]}
        >
          <Input placeholder={i18n.t("addAccount.example")} />
        </Form.Item>
        <p className="dummy-placeholder">{i18n.t("addAccount.accNameRule")}</p>
        <Form.Item
          label="Account Owner"
          name="accOwner"
          rules={[
            {
              required: true,
              message: i18n.t("addAccount.accNameRule"),
            },
          ]}
        >
          <Input placeholder={i18n.t("addAccount.example")} />
        </Form.Item>
        <p className="dummy-placeholder">{i18n.t("addAccount.accNameRule")}</p>
        <Form.Item>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined className="drag-icon" />
            </p>
            <p className="ant-upload-text">
              {i18n.t("addAccount.dropdownText")}
            </p>
            <p className="ant-upload-hint">
              {i18n.t("addAccount.dropConditions")}
            </p>
          </Dragger>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddEditAccount;

AddEditAccount.propTypes = {
  getUpdatedFormData: PropTypes.func.isRequired,
  formStatus: PropTypes.string.isRequired,
  accountsFormData: PropTypes.object.isRequired,
};
