import React, { useState } from "react";
import { Form, Input, message, Radio, Upload, Select } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import i18n from "../../../locales/i18next";
import DefaultLogo from "../../../assets/images/Default_logo.png";
import "./add-edit-account.scss";

const AddEditAccount = ({
  getUpdatedFormData,
  formStatus,
  accountsFormData,
}) => {
  const { Dragger } = Upload;
  const [base64Url, setBase64Url] = useState(null);
  const beforeUpload = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      setBase64Url(reader.result);
      setValue(reader.result);
    };
    return false;
  };
  console.log(base64Url);
  const handleChange = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  const props = {
    name: "logo",
    beforeUpload: beforeUpload,
    onChange: handleChange,
    maxCount: 1,
    accept: "image/*",
    action: "",
    onDrop() {
      handleChange;
    },
  };
  const dropdownOptions = [
    {
      label: "Sandeep",
      value: "sandeep",
      email: "sandeep@gmail.com",
      logo: DefaultLogo,
    },
    {
      label: "Test123",
      value: "test123",
      email: "test123@gmail.com",
      logo: DefaultLogo,
    },
    {
      label: "Nano",
      value: "nano",
      email: "sandeep@gmail.com",
      logo: DefaultLogo,
    },
    {
      label: "Domininc",
      value: "domininc",
      email: "dominic@gmail.com",
      logo: DefaultLogo,
    },
  ];
  const [value, setValue] = useState(DefaultLogo);
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  const [selectedItems, setSelectedItems] = useState([]);

  // useEffect(() => {
  //   setValue(selectedItems.length > 0 ? selectedItems[0].logo : DefaultLogo);
  // }, [selectedItems]);
  return (
    <div className="add-edit-account-container">
      <Form
        name="accounts-form"
        initialValues={
          formStatus === "edit" && accountsFormData ? accountsFormData : false
        }
        className="accounts-form"
        onValuesChange={(changedValues, allValues) => {
          getUpdatedFormData(allValues, value);
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
        <Form.Item
          label="Account Owner"
          name="accOwner"
          rules={[
            {
              required: true,
              message: i18n.t("addAccount.accOwnerRule"),
            },
          ]}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder="Please select"
            value={selectedItems}
            onChange={setSelectedItems}
            options={dropdownOptions}
            optionRender={(option) => (
              <div className="list-options-container">
                <img src={option.data.logo} alt="/" className="image" />
                <div className="label-container">
                  <p className="label"> {option.data.label}</p>
                  <p className="email"> {option.data.email}</p>
                </div>
              </div>
            )}
          />
        </Form.Item>
        <Form.Item
          name="accLogo"
          rules={[
            {
              required: true,
              message: i18n.t("addAccount.accNameRule"),
            },
          ]}
        >
          <Radio
            onChange={onChange}
            defaultChecked={true}
            className="default-logo-radio-container"
          >
            <div className="default-logo-container">
              <div className="bg-round-container">
                <img src={DefaultLogo} alt="/" className="logo-img" />
              </div>
              <p className="logo-text">Default.png</p>
            </div>
          </Radio>
        </Form.Item>
        <Form.Item>
          <div className="radio-uploader">
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
          </div>
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
