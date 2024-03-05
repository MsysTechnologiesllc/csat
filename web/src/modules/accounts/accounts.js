import { Button, Card, Col, Modal, Popover, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
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

export const Accounts = () => {
  const { isMobile, isTablet } = useDetectMobileOrDesktop();
  const navigate = useNavigate();
  const [accountsList, setAccountsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tenantId] = useOutletContext();
  const [deleteModal, setDeleteModal] = useState(false);
  const [isPopover, setIsPopover] = useState(false);
  const [popId, setPopId] = useState("");
  const [isId, setIsId] = useState("");
  const handleOnOpenChange = (id) => {
    if (id !== popId) {
      setPopId(id);
      setIsPopover(true);
    }
  };
  const handleonCancel = () => {
    setDeleteModal(false);
  };
  const handleonOk = () => {
    setDeleteModal(false);
  };
  const handleOnClickMore = (option, id) => {
    if (option === "Delete" && isId !== id) {
      setDeleteModal(true);
      setIsId(id);
      setIsPopover(false);
    }
  };
  const handleView = (account) => {
    navigate(`/accounts/${account.ID}/projects`, {
      state: {
        projectsList: account?.account_projects,
        accountName: account?.name,
        accountId: account.ID,
      },
    });
  };
  useEffect(() => {
    setIsLoading(true);
    if (tenantId) {
      new GetService().getAccountsList(tenantId, (result) => {
        if (result?.status === 200) {
          setAccountsList(result?.data?.data?.tenant?.tenant_accounts);
          setIsLoading(false);
        }
      });
    }
  }, [tenantId]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState("add");
  const [accountsFormData, setAccountsFormData] = useState();
  useEffect(() => {
    setAccountsFormData({
      accName: "sandeep",
      accOwner: "dharma",
    });
    setFormStatus("add");
  }, []);
  const addNewAccount = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div className="projects-list-wrapper">
        <Modal
          title={
            formStatus === "add"
              ? i18n.t("addAccount.addAccount")
              : i18n.t("addAccount.editAccount")
          }
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={false}
          className="form-modal"
        >
          <AddEditAccount
            formStatus={formStatus}
            handleOk={handleOk}
            handleCancel={handleCancel}
            accountsFormData={accountsFormData}
          />
        </Modal>
        <div className="account-header-container">
          <h1 className="project-title">{i18n.t("greetings.account")}</h1>
          <div className="actions-container">
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
        ) : (
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
                          <h4 className="project-name">{account?.name}</h4>
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
                                handleOnClickMore("Delete", account.ID);
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
                          onOk={handleonOk}
                          className="modal"
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
        )}
      </div>
    </>
  );
};
