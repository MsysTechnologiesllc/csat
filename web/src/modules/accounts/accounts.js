import {
  Button,
  Card,
  Col,
  Row,
  Modal,
  Segmented,
  Table,
  Pagination,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import {
  AppstoreOutlined,
  BarsOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import i18n from "../../locales/i18next";
import { GetService } from "../../services/get";
import { ShimmerSimpleGallery } from "react-shimmer-effects";
import { useDetectMobileOrDesktop } from "../../hooks/useDetectMobileOrDesktop";
import "./projects-list/projects-list.scss";

export const Accounts = () => {
  const { isMobile, isTablet } = useDetectMobileOrDesktop();
  const navigate = useNavigate();
  const [tenantId] = useOutletContext();
  const [accountsList, setAccountsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState("Grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(selectedSegment);
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
  const addNewAccount = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
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
      render: () => (
        <div>
          <EditOutlined className="edit" />
          <DeleteOutlined className="delete" />
        </div>
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
      });
  });
  return (
    <div className="projects-list-wrapper">
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      ></Modal>
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
              setSelectedSegment(value); // string
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
                        <h4 className="project-name">{account?.name}</h4>
                        <p className="client-name">
                          {deliveryHead?.length > 0 && deliveryHead[0]?.name}
                        </p>
                      </div>
                    </div>
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
    </div>
  );
};
