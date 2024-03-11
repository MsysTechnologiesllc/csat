import {
  Button,
  Card,
  Col,
  Row,
  Modal,
  Segmented,
  Table,
  Pagination,
  Popover,
  Drawer,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import {
  AppstoreOutlined,
  BarsOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import i18n from "../../locales/i18next";
import { GetService } from "../../services/get";
import { ShimmerSimpleGallery } from "react-shimmer-effects";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineExclamationCircle,
} from "react-icons/ai";
import { useDetectMobileOrDesktop } from "../../hooks/useDetectMobileOrDesktop";
import "./projects-list/projects-list.scss";
import AddEditAccount from "./add-edit-account/add-edit-account";
import { PutService } from "../../services/put";
import NotifyStatus from "../../components/notify-status/notify-status";

export const Accounts = () => {
  const { isMobile, isTablet } = useDetectMobileOrDesktop();
  const navigate = useNavigate();
  const [tenantId] = useOutletContext();
  const [accountsList, setAccountsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState("Grid");
  const [deleteModal, setDeleteModal] = useState(false);
  const [isPopover, setIsPopover] = useState(false);
  const [popId, setPopId] = useState("");
  const [isId, setIsId] = useState("");
  const [notify, setNotify] = useState("");
  const [message, setMessage] = useState("");
  const accountsApi = () => {
    new GetService().getAccountsList(tenantId, (result) => {
      if (result?.status === 200) {
        setAccountsList(result?.data?.data?.tenant?.tenant_accounts);
        setIsLoading(false);
      }
    });
  };
  const handleOnOpenChange = (id) => {
    if (id !== popId) {
      setPopId(id);
      setIsPopover(true);
    }
  };
  const handleonCancel = () => {
    setDeleteModal(false);
    setIsId("");
    setPopId("");
  };
  const handleonOk = (account) => {
    const payload = {
      name: account.name,
      tenant_id: account.tenant_id,
      is_active: false,
    };
    new PutService().updateAccount(account.ID, payload, (result) => {
      if (result.status === 200) {
        accountsApi();
        setNotify("success");
        setMessage("Account Deleted Successfully");
        setDeleteModal(false);
        setIsId("");
        setPopId("");
        setTimeout(() => {
          setNotify("");
          setMessage("");
        }, 2000);
      }
    });
  };
  const handleOnClickMore = (option, account) => {
    if (option === "Delete" && isId !== account.ID) {
      setDeleteModal(true);
      setIsId(account.ID);
      setIsPopover(false);
    }
  };
  const handleView = (account) => {
    console.log(account, "accounts");
    navigate(`/accounts/${account.ID}/projects`, {
      state: {
        accountId: account.ID,
        tenantId: tenantId,
      },
    });
  };
  useEffect(() => {
    setIsLoading(true);
    if (tenantId) {
      accountsApi();
    }
  }, [tenantId]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  // const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState("add");
  const [accountsFormData, setAccountsFormData] = useState();

  const onFinish = () => {
    console.log(formData);
    // setLoading(true);
  };

  function getUpdatedFormData(values, logo) {
    let payload = {
      name: values.accName,
      owner: values.accOwner,
      avatar: logo,
    };
    console.log(payload);
    setFormData(payload);
  }
  useEffect(() => {
    setAccountsFormData({
      accName: "sandeep",
      accOwner: "dharma",
    });
    setFormStatus("add");
  }, []);

  const addNewAccount = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const columns = [
    {
      title: "Account",
      dataIndex: "accountName",
      key: "accountName",
    },
    {
      title: "Account Owner",
      dataIndex: "accountOwner",
      key: "accountOwner",
    },
    {
      title: "Projects",
      dataIndex: "projects",
      key: "projects",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <EditOutlined className="edit" />
          <DeleteOutlined
            className="delete"
            onClick={() => handleOnClickMore("Delete", record?.accountId)}
          />
        </div>
      ),
    },
    {
      title: "View",
      dataIndex: "view",
      key: "view",
      render: (text, record) => (
        <EyeOutlined onClick={() => handleView(record)} />
      ),
    },
  ];
  const data = [];
  accountsList.map((account, index) => {
    const deliveryHead =
      account?.account_projects?.length > 0 &&
      account?.account_projects[0]?.Users?.length > 0
        ? account?.account_projects[0]?.Users
        : account?.account_projects[1]?.Users?.filter((each) => {
            each?.role === "deliveryHead";
          });
    selectedSegment === "List" &&
      data.push({
        key: index + 1,
        accountName: account?.name,
        accountOwner: deliveryHead?.length > 0 && deliveryHead[0]?.name,
        projects: `${account?.account_projects?.length} project(s)`,
        accountId: account?.ID,
      });
  });

  return (
    <div className="projects-list-wrapper">
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
              onClick={() => onFinish()}
              className="submit-btn"
              // loading={loading}
            >
              {formStatus === "add"
                ? i18n.t("addAccount.addAccount")
                : i18n.t("addAccount.updateAccount")}
            </Button>
          </>
        }
      >
        <AddEditAccount
          handleClose={onClose}
          formStatus={formStatus}
          accountsFormData={accountsFormData}
          getUpdatedFormData={getUpdatedFormData}
        />
      </Drawer>
      <div className="account-header-container">
        <h1 className="project-title">{i18n.t("greetings.account")}</h1>
        <div className="actions-container">
          <Segmented
            options={[
              {
                value: "Grid",
                icon: <AppstoreOutlined />,
              },
              {
                value: "List",
                icon: <BarsOutlined />,
              },
            ]}
            onChange={(value) => {
              setSelectedSegment(value);
            }}
          />
          <Button onClick={addNewAccount} className="add-account-button">
            {i18n.t("addAccount.addBtn")}
          </Button>
        </div>
      </div>
      {isLoading ? (
        isMobile ? (
          <ShimmerSimpleGallery col={1} card imageHeight={150} />
        ) : isTablet ? (
          <ShimmerSimpleGallery col={2} card imageHeight={150} />
        ) : (
          <ShimmerSimpleGallery card imageHeight={150} />
        )
      ) : selectedSegment === "Grid" ? (
        <Row gutter={[20, 20]} className="project-list-wrapper">
          {accountsList?.map((account) => {
            const deliveryHead =
              account?.account_projects?.length > 0 &&
              account?.account_projects[0]?.Users?.length > 0
                ? account?.account_projects[0]?.Users
                : account?.account_projects[1]?.Users?.filter((each) => {
                    each?.role === "deliveryHead";
                  });
            return (
              <Col xs={24} md={12} lg={8} xxl={6} key={account?.ID}>
                <Card className="project-wrapper">
                  <div className="project-client-context-day-container">
                    <div className="avatar-project-client-context-container">
                      <p className="avatar">
                        {`${account?.name
                          .split(" ")
                          .map((word) => word?.charAt(0)?.toUpperCase())
                          .join("")}`}
                      </p>
                      <div className="project-client-container">
                        <h4 className="project-name" title={account?.name}>
                          {account?.name}
                        </h4>
                        <p className="client-name">
                          {deliveryHead?.length > 0 && deliveryHead[0]?.name}
                        </p>
                      </div>
                    </div>
                    <Popover
                      content={
                        <div className="more-options">
                          <span
                            onClick={(event) => {
                              event.stopPropagation();
                              handleOnClickMore("Edit");
                            }}
                          >
                            <AiOutlineEdit className="icon" />
                            {i18n.t("common.edit")}
                          </span>
                          <span
                            onClick={(event) => {
                              event.stopPropagation();
                              handleOnClickMore("Delete", account);
                            }}
                          >
                            <AiOutlineDelete className="icon" />
                            {i18n.t("common.delete")}
                          </span>
                        </div>
                      }
                      trigger="click"
                      arrow={false}
                      placement="bottomRight"
                      overlayStyle={{ padding: 0 }}
                      open={popId === account.ID && isPopover}
                      onOpenChange={() => handleOnOpenChange(account.ID)}
                    >
                      <div
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                        className="more-option-icon"
                      >
                        <img
                          src="/images/ellipse-vertical.svg"
                          alt={i18n.t("common.moreOptions")}
                        />
                      </div>
                    </Popover>
                    {isId === account.ID && (
                      <Modal
                        open={deleteModal}
                        closable={false}
                        okText="Delete"
                        onCancel={handleonCancel}
                        onOk={() => handleonOk(account)}
                        className="more-modal"
                        centered
                      >
                        <div className="model-content-container">
                          <AiOutlineExclamationCircle className="excalamation-icon" />
                          <div className="content-wrapper">
                            <h3 className="title">
                              {i18n.t("deleteModal.accountsTitle")}
                            </h3>
                            <p className="context">
                              {i18n.t("deleteModal.context")}
                            </p>
                          </div>
                        </div>
                      </Modal>
                    )}
                  </div>
                  <div className="team-view-container">
                    <p className="team-members-context">{`${account?.account_projects?.length} project(s)`}</p>
                    <Button
                      className="view-button"
                      type="text"
                      onClick={() => handleView(account)}
                    >
                      {i18n.t("accounts.view")}
                    </Button>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <div className="accounts-list-container">
          <Table columns={columns} dataSource={data} pagination={false} />
          <Pagination
            total={data?.length}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Total ${total} items`}
            className="pagination"
          />
        </div>
      )}
      {notify && <NotifyStatus status={notify} message={message} />}
    </div>
  );
};
