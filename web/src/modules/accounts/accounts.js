import { Button, Card, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import i18n from "../../locales/i18next";
import { GetService } from "../../services/get";
import "./projects-list/projects-list.scss";

export const Accounts = () => {
  const navigate = useNavigate();
  const [accountsList, setAccountsList] = useState([]);
  const handleView = (account) => {
    navigate(`/accounts/projects/${account.ID}`, {
      state: {
        projectsList: account?.account_projects,
        accountName: account?.name,
      },
    });
  };

  const tenant_id = 1001;

  useEffect(() => {
    if (tenant_id) {
      new GetService().getAccountsList(tenant_id, (result) => {
        setAccountsList(result?.data?.data?.tenant?.tenant_accounts);
      });
    }
  }, [tenant_id]);
  return (
    <div className="projects-list-wrapper">
      <h1 className="project-title">{i18n.t("greetings.account")}</h1>
      <Row gutter={[20, 20]} className="project-list-wrapper">
        {accountsList.map((account) => {
          const deliveryHead =
            account.account_projects[0].Users.length > 0
              ? account.account_projects[0].Users
              : account.account_projects[1].Users.filter(
                  (each) => each.role === "deliveryHead",
                );
          return (
            <Col xs={24} md={12} lg={8} xxl={6} key={account.ID}>
              <Card className="project-wrapper">
                <div className="project-client-context-day-container">
                  <div className="avatar-project-client-context-container">
                    <p className="avatar">
                      {`${account.name
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase())
                        .join("")}`}
                    </p>
                    <div className="project-client-container">
                      <h4 className="project-name">{account.name}</h4>
                      <p className="client-name">{deliveryHead[0]?.name}</p>
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
    </div>
  );
};
