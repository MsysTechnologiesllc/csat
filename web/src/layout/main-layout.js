import Layout, { Content, Header as AntdHeader } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { SideBar } from "../components/side-bar/side-bar";
import { MdSpaceDashboard } from "react-icons/md";
import { FaFolder } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdStarHalf, IoIosNotifications } from "react-icons/io";
import "./main-layout.scss";
import { Header } from "../components/header/header";

const menuItems = [
  {
    icon: <MdSpaceDashboard />,
    key: "/dashboard",
    label: "Dashboard",
  },
  {
    icon: <FaFolder />,
    key: "/accounts",
    label: "Accounts",
  },
  {
    icon: <IoMdStarHalf />,
    key: "/surveys",
    label: "Surveys",
  },
  {
    icon: <IoIosNotifications />,
    key: "/notifications",
    label: "Notifications",
  },
];

export const MainLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!showSidebar) {
      document.body.style.overflow = "auto";
    }
  }, [showSidebar]);
  return (
    <>
      <Layout className="header-layout">
        <AntdHeader>
          <Header prjTitle="" displayPrjTitle={true} />
          <div
            className={`header-arrow ${showSidebar === false ? "show-right-arrow" : "hide-right-arrow"}`}
            onClick={() => setShowSidebar(true)}
          >
            <RxHamburgerMenu className="arrow-icon" />
          </div>
        </AntdHeader>
      </Layout>
      <Layout hasSider className="main-layout-content-container">
        <div className={`${showSidebar ? "show-sidebar" : "hide-sidebar"}`}>
          <SideBar
            defaultSelectedItem={["/dashboard"]}
            menuItems={menuItems}
            onClickCallback={(evt) => {
              navigate(evt.key);
              setShowSidebar(false);
            }}
            showFooter
            showLogo
            selectedKeys={[location.pathname]}
            setShowSidebar={setShowSidebar}
            showSidebar={showSidebar}
          />
        </div>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </>
  );
};
