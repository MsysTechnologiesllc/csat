import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Upload,
  Select,
  Drawer,
  Button,
  Row,
  Col,
  Modal,
  message,
} from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { useDetectMobileOrDesktop } from "../../../hooks/useDetectMobileOrDesktop";
import PropTypes from "prop-types";
import i18n from "../../../locales/i18next";
import "./add-edit-account.scss";
import { GetService } from "../../../services/get";
import { PostService } from "../../../services/post";
import NotifyStatus from "../../../components/notify-status/notify-status";

const AddEditAccount = ({
  open,
  setOpen,
  editData,
  accountsApi,
  serviceType,
  setServiceType,
}) => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState();
  const [statusMessage, setStatusMessage] = useState("");
  const [notify, setNotify] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [removedOwners, setRemovedOwners] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState();
  const [optionsLoader, setOptionsLoader] = useState(false);
  const { isMobile, isTablet } = useDetectMobileOrDesktop();
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
        accLogo:
          editData.logo?.length !== 0
            ? `${editData.media_type},${editData.logo}`
            : setFileList([]),
      });
      setImageUrl(
        editData.logo?.length !== 0
          ? `${editData.media_type},${editData.logo}`
          : null,
      );
      editData.logo?.length !== 0
        ? setFileList([
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: `${editData.media_type},${editData.logo}`,
            },
          ])
        : setFileList([]);
    } else {
      form.resetFields();
      setFileList([]);
      setImageUrl(null);
      setSelectedItems([]);
    }
  }, [serviceType]);

  const handleFormSubmission = (values) => {
    setLoading(true);
    const payload = {
      account_name: values.accName,
      tenant_id: 1001,
      account_owner: selectedItems,
      account_logo:
        fileList && fileList[0]?.thumbUrl !== undefined
          ? fileList[0]?.thumbUrl
          : imageUrl,
      ...(serviceType === "edit" && {
        removed_user: removedOwners || null,
        is_active: true,
      }),
    };
    if (serviceType === "add") {
      new PostService().createAccount(payload, (result) => {
        if (result?.status === 200) {
          setStatusMessage(
            i18n.t("addAccount.addSuccess", {
              accName: values.accName,
            }),
          );
          setLoading(false);
          setNotify("addAccountSuccess");
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
          setStatusMessage(
            i18n.t("addAccount.updateSuccess", {
              accName: values.accName,
            }),
          );
          setNotify("updateAccountSuccess");
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
  const handleOwnerSearch = (search) => {
    if (search?.length > 2) {
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
  };
  const onClose = () => {
    setOpen(false);
    setServiceType("");
  };
  const handleChangeInOwners = (values, options) => {
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
  const handleOwnersDeselect = (value) => {
    let deletedOwners = selectedItems.filter((item) => item.email === value);
    if (deletedOwners) {
      setRemovedOwners([...removedOwners, ...deletedOwners]);
    }
    setSelectedItems(
      selectedItems.filter(
        (item) => item.name !== value && item.email !== value,
      ),
    );
  };
  const handleUploadModalCancel = () => {
    setPreviewOpen(false);
  };
  const handleLogoRemove = () => {
    setImageUrl(null);
    serviceType === "edit" && setFileList([]);
  };
  const getBase64 = (file) => {
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  const handleLogoPreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleLogoChange = ({ fileList: newFileList }) => {
    let isError = false;

    newFileList.forEach((file) => {
      const isAllowedType =
        file.type === "image/svg+xml" ||
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg";

      if (file.size / 1024 / 1024 > 2) {
        isError = true;
        return;
      }

      if (!isAllowedType) {
        isError = true;
        return;
      }
    });

    if (isError) {
      message.error(i18n.t("addAccount.imageOrFileSizeWarning"));
    } else {
      setFileList(newFileList);
    }
  };

  const uploadButton = (
    <button className="upload-button-logo" type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <span className="logo-container ">{i18n.t("common.upload")}</span>
    </button>
  );
  return (
    <>
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
              className={
                serviceType === "add" &&
                (!form.getFieldValue("accName") ||
                  !form.getFieldValue("accOwner") ||
                  form.getFieldValue("accOwner").length === 0 ||
                  form.getFieldValue("accName").length === 0)
                  ? "common-btn-styles disable-btn"
                  : "common-btn-styles submit-btn"
              }
              loading={loading}
              onClick={() => form.submit()}
              disabled={
                serviceType === "add" &&
                (!form.getFieldValue("accName") ||
                  !form.getFieldValue("accOwner") ||
                  form.getFieldValue("accOwner").length === 0 ||
                  form.getFieldValue("accName").length === 0)
              }
            >
              {i18n.t("button.submit")}
            </Button>
          </>
        }
      >
        <div className="add-edit-account-container">
          <Form
            form={form}
            name="accounts-form"
            onFinish={handleFormSubmission}
            className="accounts-form"
          >
            <Form.Item name="accLogo">
              <Row justify="space-between" align="middle">
                <Col span={6}>
                  <Upload
                    accept=".svg, .png, .jpg, .jpeg, .fig"
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture-circle"
                    fileList={fileList}
                    onPreview={handleLogoPreview}
                    onChange={handleLogoChange}
                    onRemove={handleLogoRemove}
                    maxCount={1}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                  <Modal
                    open={previewOpen}
                    footer={null}
                    onCancel={handleUploadModalCancel}
                  >
                    <img alt={i18n.t("common.logo")} src={previewImage} />
                  </Modal>
                </Col>
                <Col span={18}>
                  <p className="logo-recommendations">
                    {i18n.t("addAccount.logoRecommendation")}
                  </p>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item
              label={i18n.t("addAccount.accName")}
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
              label={i18n.t("addAccount.accOwner")}
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
                onDeselect={handleOwnersDeselect}
                placeholder={i18n.t("addAccount.accOwnerRule")}
                onSearch={(e) => handleOwnerSearch(e)}
                onChange={handleChangeInOwners}
                optionLabelProp="label"
                loading={optionsLoader}
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
      {notify && <NotifyStatus status={notify} message={statusMessage} />}
    </>
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
