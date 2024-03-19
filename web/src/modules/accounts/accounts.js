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
  Avatar,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import {
  TableOutlined,
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
  const [notify, setNotify] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [eachAccount, setEachAccount] = useState({});
  const [serviceType, setServiceType] = useState("add");
  const accountsApi = () => {
    new GetService().getAccountsList(tenantId, (result) => {
      if (result?.status === 200) {
        setAccountsList(result?.data?.data?.tenant?.tenant_accounts);
        setIsLoading(false);
      }
    });
  };
  const handleonCancel = () => {
    setDeleteModal(false);
    setEachAccount({});
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
        setNotify("deleteAccountSuccess");
        setMessage(`${account.name} has been removed`);
        setDeleteModal(false);
        setIsId("");
        setEachAccount({});
        setTimeout(() => {
          setNotify("");
          setMessage("");
        }, 2000);
      }
    });
  };
  const handleOnClickMore = (option, account) => {
    if (option === "Delete") {
      setDeleteModal(true);
      setEachAccount(account);
      // setIsId(account.ID);
    } else {
      setServiceType("edit");
      setOpen(true);
      setEachAccount(account);
    }
  };
  const handleView = (account) => {
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
  const addNewAccount = () => {
    setServiceType("add");
    setOpen(true);
  };
  const columns = [
    {
      title: "Account",
      dataIndex: "account.name",
      key: "name",
      render: (text, record) => record.account.name,
    },
    {
      title: "Account Owner",
      dataIndex: "account.account_owner.length",
      key: "accountOwner",
      render: (text, record) => (
        <>
          {record?.account?.account_owner?.length === 1 ? (
            <p className="avatar-name">
              {record?.account?.account_owner[0]?.name}
            </p>
          ) : (
            <div className="extra-avatars">
              <Avatar.Group
                className="avatar-group"
                maxCount={1}
                maxPopoverTrigger="click"
                size="small"
                maxStyle={{
                  color: "#f56a00",
                  backgroundColor: "#fde3cf",
                  cursor: "pointer",
                }}
              >
                <p className="avatar-name">
                  {record?.account?.account_owner[0]?.name}
                </p>
                {record.account.account_owner.slice(1).map(({ name }) => (
                  <Tooltip title={name} placement="top" key={name}>
                    <Avatar
                      style={{
                        color: "#f56a00",
                        backgroundColor: "#fde3cf",
                        cursor: "pointer",
                      }}
                      size="small"
                    >
                      {name && name.charAt(0)}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </div>
          )}
        </>
      ),
    },
    {
      title: "Projects",
      dataIndex: "account.account_projects.length",
      key: "projects",
      render: (text, record) => (
        <>
          <span>
            {record.account?.account_projects?.length > 0 ? (
              <>
                {record.account?.account_projects?.length}
                {i18n.t("addAccount.projects")}
              </>
            ) : (
              `0 ${i18n.t("addAccount.projects")}`
            )}
          </span>
        </>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <EditOutlined
            className="edit"
            onClick={() => handleOnClickMore("Edit", record.account)}
          />
          <DeleteOutlined
            className="delete"
            onClick={() => handleOnClickMore("Delete", record.account)}
          />
        </div>
      ),
    },
    {
      title: "View",
      dataIndex: "view",
      key: "view",
      render: (text, record) => (
        <EyeOutlined
          className="view"
          onClick={() => handleView(record.account)}
        />
      ),
    },
  ];
  const data = [];
  accountsList.map((account) => {
    selectedSegment === "List" &&
      data.push({
        account: account,
      });
  });
  useEffect(() => {
    if (tenantId) {
      new GetService().getAccountsList(tenantId, (result) => {
        if (result?.status === 200) {
          setAccountsList(result?.data?.data?.tenant?.tenant_accounts);
          setIsLoading(false);
        }
      });
    }
  }, [tenantId]);
  return (
    <div className="projects-list-wrapper">
      <AddEditAccount
        open={open}
        setOpen={setOpen}
        editData={eachAccount}
        accountsApi={accountsApi}
        serviceType={serviceType}
        setServiceType={setServiceType}
      />
      <div className="account-header-container">
        <h1 className="project-title">{i18n.t("greetings.account")}</h1>
        <div className="actions-container">
          <Segmented
            options={[
              {
                value: "Grid",
                icon: <TableOutlined />,
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
            let deliveryHeadName = [];
            deliveryHead?.map((each) => {
              deliveryHeadName.push(each?.name);
            });
            return (
              <Col xs={24} md={12} lg={8} xxl={6} key={account?.ID}>
                <Card className="project-wrapper">
                  <div className="project-client-context-day-container">
                    <div className="avatar-project-client-context-container">
                      {account.logo ? (
                        <Avatar src={`${account.media_type},${account.logo}`} />
                      ) : (
                        <p className="avatar">
                          {`${account?.name
                            .split(" ")
                            .map((word) => word?.charAt(0)?.toUpperCase())
                            .join("")}`}
                        </p>
                      )}
                      <div className="project-client-container">
                        <h4 className="project-name" title={account?.name}>
                          {account?.name}
                        </h4>
                        <p className="client-name" title={deliveryHeadName}>
                          {deliveryHead?.length > 0 &&
                            (deliveryHead.length === 1
                              ? deliveryHead[0]?.name
                              : `${deliveryHead[0]?.name}`)}
                          {deliveryHead?.length > 1 && (
                            <Avatar className="delivery-head-length">
                              +{deliveryHead?.length - 1}
                            </Avatar>
                          )}
                        </p>
                      </div>
                    </div>
                    <Popover
                      content={
                        <div className="more-options">
                          <span
                            onClick={(event) => {
                              event.stopPropagation();
                              handleOnClickMore("Edit", account);
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
                      arrow={false}
                      placement="bottomRight"
                      overlayStyle={{ padding: 0 }}
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
      {/* {isId && ( */}
      <Modal
        open={deleteModal}
        closable={false}
        okText="Delete"
        onCancel={handleonCancel}
        onOk={() => handleonOk(eachAccount)}
        className="more-modal"
        centered
      >
        <div className="model-content-container">
          <AiOutlineExclamationCircle className="excalamation-icon" />
          <div className="content-wrapper">
            <h3 className="title">{i18n.t("deleteModal.accountsTitle")}</h3>
            <p className="context">{i18n.t("deleteModal.context")}</p>
          </div>
        </div>
      </Modal>
      {/* )} */}
      {notify && <NotifyStatus status={notify} message={message} />}
    </div>
  );
};
