import React, { useState, useEffect } from "react";
import {
  Spin,
  Form,
  Input,
  Upload,
  Select,
  Drawer,
  Button,
  message,
  Row,
  Col,
} from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
// import { InboxOutlined } from "@ant-design/icons";
import { useDetectMobileOrDesktop } from "../../../hooks/useDetectMobileOrDesktop";
import PropTypes from "prop-types";
import i18n from "../../../locales/i18next";
import DefaultLogo from "../../../assets/images/Default_logo.png";
import Check from "../../../assets/images/check.svg";
import "./add-edit-account.scss";
// import { PostService } from "../../../services/post";
import { GetService } from "../../../services/get";

const AddEditAccount = ({ open, setOpen }) => {
  const { Option } = Select;
  const { isMobile, isTablet } = useDetectMobileOrDesktop();
  const [dropdownOptions, setDropdownOptions] = useState();
  const [optionsLoader, setOptionsLoader] = useState(false);
  const [search, setSearch] = useState("");
  useEffect(() => {
    setAccountsFormData({
      accName: "sandeep",
      accOwner: "domininc",
    });
    setFormStatus("add");
  }, []);

  useEffect(() => {
    if (search?.length > 3) {
      setOptionsLoader(true);
      new GetService().getAccountOwners(search, (result) => {
        console.log(result);
        if (result.status === 200) {
          const data = [];
          result.data.data.db_users.map((item) => {
            data.push(item);
          });
          result.data.data.gsuit_users.map((item) => {
            data.push(item);
          });
          console.log(data);
          setDropdownOptions(data);
          setOptionsLoader(false);
        } else {
          setDropdownOptions([]);
          setOptionsLoader(false);
        }
      });
    } else {
      setOptionsLoader(false);
    }
  }, [search]);
  useEffect(() => {
    setSelectedItems(selectedItems);
  }, []);
  // const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState("add");
  const [accountsFormData, setAccountsFormData] = useState();
  const [form] = Form.useForm();
  const [selectedItems, setSelectedItems] = useState([]);
  // const [checkboxSelected, setCheckboxSelected] = useState(true);
  // const [base64, setBase64] = useState("");
  // console.log(setSelectedItems);
  // const beforeUpload = (file) => {
  //   const isImage = file.type.startsWith("image/");
  //   const isAllowedType =
  //     isImage && /\.(svg|png|jpg|jpeg|fig)$/i.test(file.name);
  //   const isSizeValid = file.size / 1024 / 1024 < 3;

  //   if (!isAllowedType) {
  //     message.error(i18n.t("addAccount.fileImageWarning"));
  //     return false; // Prevent upload
  //   }

  //   if (!isSizeValid) {
  //     message.error(i18n.t("addAccount.imageSizeWarning"));
  //     return false; // Prevent upload
  //   }

  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       const data = reader.result;
  //       setBase64(data);
  //       resolve({ file, data });
  //     };
  //     reader.onerror = (error) => {
  //       reject(error);
  //     };
  //   });
  // };

  // function handleChange() {
  //   setCheckboxSelected(false);
  //   form.setFieldsValue({
  //     accLogo: base64,
  //   });
  // }
  // function handleRemove() {
  //   setBase64(DefaultLogo);
  //   setTimeout(() => {
  //     form.setFieldsValue({
  //       accLogo: DefaultLogo,
  //     });
  //   }, 0);

  //   setTimeout(() => {
  //     setCheckboxSelected(true);
  //   }, 0);
  // }
  // const props = {
  //   name: "logo",
  //   beforeUpload: beforeUpload,
  //   onChange: handleChange,
  //   maxCount: 1,
  //   accept: ".svg, .png, .jpg, .jpeg, .fig",
  //   action: "",
  //   listType: "picture-circle",
  // };
  // const draggerProps = {
  //   ...props,
  //   showUploadList: {
  //     showRemoveIcon: true,
  //   },
  //   onRemove: handleRemove,
  // };

  // const dropdownOptions = [
  //   {
  //     label: "Sandeep",
  //     value: "sandeep",
  //     email: "sandeep@gmail.com",
  //     logo: DefaultLogo,
  //   },
  //   {
  //     label: "Test123",
  //     value: "test123",
  //     email: "test123@gmail.com",
  //     logo: DefaultLogo,
  //   },
  //   {
  //     label: "Nano",
  //     value: "nano",
  //     email: "sandeep@gmail.com",
  //     logo: DefaultLogo,
  //   },
  //   {
  //     label: "Domininc",
  //     value: "domininc",
  //     email: "dominic@gmail.com",
  //     logo: DefaultLogo,
  //   },
  // ];

  const onFinish = (values) => {
    // console.log("Form submitted with values:", values);
    console.log(values);
    const payload = {
      account_name: values.accName,
      tenant_id: 1001,
      account_owner: [
        {
          name: "Sandeep",
          email: "spandala@msystechnologies.com",
        },
      ],
      account_logo: values.accLogo,
    };
    console.log(payload);
    // new PostService().postCreeateAccount(payload, (result) => {
    //   if (result?.status === 200) {
    //     console.log(payload);
    //     console.log("post");
    //   }
    // });
    // onClose(); // Close the drawer after form submission
  };

  // const onChangeCheckbox = (e) => {
  //   const checked = e.target.checked;
  //   setCheckboxSelected(checked);

  //   if (checked) {
  //     setBase64("");
  //     form.setFieldsValue({
  //       accLogo: DefaultLogo,
  //     });
  //   }
  // };
  const onClose = () => {
    setOpen(false);
  };
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
        console.log(url);
        setLogoSuccessMessage(true);
        form.setFieldsValue({
          accLogo: url,
        });
      });
    }
  };
  const [logoSuccessMessage, setLogoSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  const handleSelect = (option) => {
    console.log(option);
    // setSelectedItems([...selectedItems, option.Name]);
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
            name="accLogo"
            rules={[
              {
                required: true,
                message: i18n.t("addAccount.accLogoRule"),
              },
            ]}
          >
            <Row justify="space-between" align="middle">
              <Col span={6}>
                <Upload
                  name="avatar"
                  listType="picture-circle"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  maxCount={1}
                  accept=".svg, .png, .jpg, .jpeg, .fig"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{
                        width: "100%",
                        borderRadius: "50%", // This adds rounded corners
                      }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Col>
              <Col span={18}>
                {logoSuccessMessage && (
                  <div className="logo-success-container">
                    <img src={Check} alt="/" className="check-image" />
                    <p className="success-message">
                      Logo uploaded successfully
                    </p>
                  </div>
                )}
                <p className="logo-recommendations">
                  Recommanded resolution is 640*640 with file size less than
                  2MB, keep visual elements centered
                </p>
              </Col>
            </Row>
          </Form.Item>
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
              onSearch={(e) => setSearch(e)}
              onSelect={(option) => handleSelect(option)}
              optionLabelProp="option"
              loading={optionsLoader}
              notFoundContent={optionsLoader ? <Spin size="small" /> : null}
            >
              {dropdownOptions?.map((option) => (
                <Option
                  key={option.Email}
                  value={option.Name}
                  label={option.Name}
                >
                  <div className="list-options-container">
                    <img src={option.logo} alt="/" className="image" />
                    <div className="label-container">
                      <p className="label">{option.Name}</p>
                      <p className="email">{option.Email}</p>
                    </div>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
          {/* <Form.Item
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
          </Form.Item> */}
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
