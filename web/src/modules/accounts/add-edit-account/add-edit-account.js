import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Radio,
  Upload,
  Select,
  Drawer,
  Button,
  message,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useDetectMobileOrDesktop } from "../../../hooks/useDetectMobileOrDesktop";
import PropTypes from "prop-types";
import i18n from "../../../locales/i18next";
import DefaultLogo from "../../../assets/images/Default_logo.png";
import "./add-edit-account.scss";

const AddEditAccount = ({ open, setOpen }) => {
  const { isMobile, isTablet } = useDetectMobileOrDesktop();

  useEffect(() => {
    setAccountsFormData({
      accName: "sandeep",
      accOwner: "domininc",
    });
    setFormStatus("edit");
  }, []);

  // const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState("add");
  const [accountsFormData, setAccountsFormData] = useState();
  const { Dragger } = Upload;
  const [form] = Form.useForm();
  const [selectedItems, setSelectedItems] = useState([]);
  const [checkboxSelected, setCheckboxSelected] = useState(true);
  const [base64, setBase64] = useState("");

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    const isAllowedType =
      isImage && /\.(svg|png|jpg|jpeg|fig)$/i.test(file.name);
    const isSizeValid = file.size / 1024 / 1024 < 3;

    if (!isAllowedType) {
      message.error(i18n.t("addAccount.fileImageWarning"));
      return false; // Prevent upload
    }

    if (!isSizeValid) {
      message.error(i18n.t("addAccount.imageSizeWarning"));
      return false; // Prevent upload
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const data = reader.result;
        setBase64(data);
        resolve({ file, data });
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  function handleChange() {
    setCheckboxSelected(false);
    form.setFieldsValue({
      accLogo: base64,
    });
  }
  function handleRemove() {
    setBase64(DefaultLogo);
    setTimeout(() => {
      form.setFieldsValue({
        accLogo: DefaultLogo,
      });
    }, 0);

    setTimeout(() => {
      setCheckboxSelected(true);
    }, 0);
  }

  const props = {
    name: "logo",
    beforeUpload: beforeUpload,
    onChange: handleChange,
    maxCount: 1,
    accept: ".svg, .png, .jpg, .jpeg, .fig",
    action: "",
  };

  const draggerProps = {
    ...props,
    showUploadList: {
      showRemoveIcon: true,
    },
    onRemove: handleRemove,
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

  const onFinish = (values) => {
    console.log("Form submitted with values:", values);
    // onClose(); // Close the drawer after form submission
  };

  const onChangeCheckbox = (e) => {
    const checked = e.target.checked;
    setCheckboxSelected(checked);

    if (checked) {
      setBase64("");
      form.setFieldsValue({
        accLogo: DefaultLogo,
      });
    }
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
      className="custom-drawer"
      title={
        formStatus === "add"
          ? i18n.t("addAccount.addAccount")
          : i18n.t("addAccount.editAccount")
      }
      onClose={onClose}
      open={open}
      width={isMobile ? "90%" : isTablet ? "60%" : "40%"}
      extra={
        <>
          <Button type="text" onClick={onClose} className="cancle-btn">
            {i18n.t("button.cancel")}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="submit-btn"
            onClick={() => form.submit()}
          >
            {formStatus === "add"
              ? i18n.t("addAccount.addAccount")
              : i18n.t("addAccount.updateAccount")}
          </Button>
        </>
      }
    >
      <div className="add-edit-account-container">
        <Form
          form={form}
          name="accounts-form"
          onFinish={onFinish}
          initialValues={
            formStatus === "edit" && accountsFormData
              ? accountsFormData
              : { accLogo: DefaultLogo }
          }
          className="accounts-form"
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
                message: i18n.t("addAccount.accLogoRule"),
              },
            ]}
          >
            <Radio
              onChange={onChangeCheckbox}
              checked={checkboxSelected}
              disabled={!checkboxSelected}
            >
              <div className="default-logo-container">
                <div className="bg-round-container">
                  <img src={DefaultLogo} alt="/" className="logo-img" />
                </div>
                <p className="logo-text">Default.png</p>
              </div>
            </Radio>
            <div className="radio-uploader">
              <Dragger {...draggerProps}>
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
    </Drawer>
  );
};

export default AddEditAccount;

AddEditAccount.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
