import { Layout, Space } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { SideBar } from "../components/side-bar/side-bar";
import { MdSpaceDashboard } from "react-icons/md";
import { FaFolder } from "react-icons/fa6";
import { IoMdStarHalf, IoIosNotifications } from "react-icons/io";
import "./main-layout.scss";

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
  const [showSidebar, setShowSidebar] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!showSidebar) {
      document.body.style.overflow = "auto";
    }
  }, [showSidebar]);
  return (
    <>
      <Space direction="vertical" className="main-space" size={[0, 48]}>
        <Layout hasSider className="main-layout-content-container">
          <div
            className={`nav-arrow ${showSidebar ? "show-arrow" : "hide-arrow"}`}
            onClick={() => setShowSidebar(false)}
          >
            <i className="icon-right-arrow" />
          </div>
          <div className={`${showSidebar ? "show-sidebar" : "hide-sidebar"}`}>
            <SideBar
              defaultSelectedItem={["/dashboard"]}
              menuItems={menuItems}
              onClickCallback={(evt) => {
                navigate(evt.key);
              }}
              //   width={isCoursePage ? 86 : 220}
              showFooter
              // footer={!isCoursePage && <FooterLogo />}
              showLogo
              //   logo={<Logo />}
              selectedKeys={[location.pathname]}
            />
          </div>
          <Content>
            <Outlet />
          </Content>
        </Layout>
      </Space>
    </>
  );
};
