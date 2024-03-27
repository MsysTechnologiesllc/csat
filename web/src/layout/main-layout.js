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
import i18n from "../locales/i18next";
import TokenUtil from "../utils/tokenUtils";
import Cookies from "js-cookie";

const menuItems = [
  {
    icon: <MdSpaceDashboard />,
    key: "/dashboard",
    label: i18n.t("sidebar.dashboard"),
  },
  {
    icon: <FaFolder />,
    key: "/accounts",
    label: i18n.t("sidebar.accounts"),
  },
  {
    icon: <IoMdStarHalf />,
    key: "/surveys",
    label: i18n.t("sidebar.surveys"),
  },
  {
    icon: <IoIosNotifications />,
    key: "/notifications",
    label: i18n.t("sidebar.notifications"),
  },
];

export const MainLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();
  const [tenantId, setTenantId] = useState(0);
  useEffect(() => {
    let jwt = Cookies.get("jwt");
    if (!jwt) {
      navigate("/login");
    } else {
      let jwtDetails = TokenUtil.getTokenDetails();
      if (jwtDetails?.Email) {
        setTenantId(jwtDetails?.TenantId);
      } else {
        Cookies.remove("jwt");
        navigate("/login");
      }
    }
  }, []);
  const handlesidebar = (evt) => {
    if (evt.key === "/surveys" || evt.key === "/accounts") {
      navigate(evt.key);
      setShowSidebar(false);
    }
  };

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
            onClickCallback={(evt) => handlesidebar(evt)}
            showFooter
            showLogo
            selectedKeys={[location.pathname]}
            setShowSidebar={setShowSidebar}
            showSidebar={showSidebar}
          />
        </div>
        <Content>
          <Outlet context={[tenantId]} />
        </Content>
      </Layout>
    </>
  );
};
