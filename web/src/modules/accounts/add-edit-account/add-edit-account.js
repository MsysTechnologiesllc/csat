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
import { useDetectMobileOrDesktop } from "../../../hooks/useDetectMobileOrDesktop";
import PropTypes from "prop-types";
import i18n from "../../../locales/i18next";
import Check from "../../../assets/images/check.svg";
import "./add-edit-account.scss";
import { GetService } from "../../../services/get";
import { PostService } from "../../../services/post";

const AddEditAccount = ({
  open,
  setOpen,
  editData,
  serviceType,
  accountsApi,
  setServiceType,
}) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const { isMobile, isTablet } = useDetectMobileOrDesktop();
  const [dropdownOptions, setDropdownOptions] = useState();
  const [optionsLoader, setOptionsLoader] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoSuccessMessage, setLogoSuccessMessage] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  useEffect(() => {
    if (search?.length > 3) {
      setOptionsLoader(true);
      new GetService().getAccountOwners(search, (result) => {
        if (result.status === 200) {
          const data = [
            ...(result?.data?.data?.db_users || []),
            ...(result?.data?.data?.gsuit_users || []),
          ];
          setDropdownOptions(data);
        } else {
          setDropdownOptions([]);
        }
        setOptionsLoader(false);
      });
    } else {
      setDropdownOptions([]);
      setOptionsLoader(false);
    }
  }, [search]);
  useEffect(() => {
    if (serviceType === "edit") {
      setSelectedItems(
        editData?.account_owner?.map((owner) => ({
          name: owner.name,
          email: owner.email,
        })),
      );
      form.setFieldsValue({
        accName: editData.name,
        accOwner: editData?.account_owner?.map((owner) => ({
          label: owner.name,
          value: owner.email,
        })),
        accLogo: `${editData.media_type},${editData.logo}`,
      });
      setImageUrl(`${editData.media_type},${editData.logo}`);
    } else {
      form.resetFields();
      setImageUrl(null);
    }
  }, [editData, serviceType]);
  const onFinish = (values) => {
    setLoading(true);
    const payload = {
      account_name: values.accName,
      tenant_id: 1001,
      account_owner: selectedItems,
      account_logo: imageUrl,
      is_active: true,
    };
    if (serviceType === "add") {
      new PostService().createAccount(payload, (result) => {
        if (result?.status === 200) {
          setLoading(false);
          form.resetFields();
          onClose();
          accountsApi();
        } else {
          setLoading(false);
        }
      });
    } else {
      new PostService().updateAccount(editData.ID, payload, (result) => {
        if (result?.status === 200) {
          setLoading(false);
          form.resetFields();
          onClose();
          accountsApi();
        } else {
          setLoading(false);
        }
      });
    }
  };
  const onClose = () => {
    setOpen(false);
    setServiceType("");
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
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        setLogoSuccessMessage(true);
        setImageUrl(url);
      });
    }
  };
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
  const handleChangeSelect = (values, options) => {
    if (serviceType === "add") {
      let option = [];
      options.map((item) => {
        option.push({ name: item.label, email: item.key });
      });
      setSelectedItems(option);
    }
    if (serviceType === "edit") {
      let option = [];
      options.map((item) => {
        if (item.label !== undefined && item.key !== undefined) {
          option.push({ name: item.label, email: item.key });
        }
      });
      setSelectedItems([...selectedItems, ...option]);
    }
  };
  const handleDeselect = (value) => {
    setSelectedItems(
      selectedItems.filter(
        (item) => item.name !== value && item.email !== value,
      ),
    );
  };
  return (
    <Drawer
      className="custom-drawer"
      title={
        serviceType === "add"
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
            // loading={loading}
            onClick={() => form.submit()}
          >
            {serviceType === "add"
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
                  // maxCount={1}
                  // accept=".svg, .png, .jpg, .jpeg, .fig"
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
              defaultValue={selectedItems}
              value={selectedItems}
              onDeselect={handleDeselect}
              placeholder="Please select"
              onSearch={(e) => setSearch(e)}
              onChange={handleChangeSelect}
              optionLabelProp="label"
              loading={optionsLoader}
              notFoundContent={optionsLoader ? <Spin size="small" /> : null}
            >
              {dropdownOptions?.map((option) => (
                <Option
                  key={option.email}
                  value={option.name}
                  label={option.name}
                >
                  <>
                    <p>{option.name}</p>
                    <p>{option.email}</p>
                  </>
                </Option>
              ))}
            </Select>
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
  accountsApi: PropTypes.func.isRequired,
  serviceType: PropTypes.string.isRequired,
  editData: PropTypes.object.isRequired,
  setServiceType: PropTypes.string.isRequired,
};
