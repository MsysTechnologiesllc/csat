import React from "react";
import { IoMdPerson } from "react-icons/io";
import { RxExit } from "react-icons/rx";
import i18n from "../../locales/i18next";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import "../../layout/main-layout.scss";

export const SidebarFooter = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove("jwt");
    navigate("/login");
  };
  return (
    <div>
      <div className="sidebar-footer-container">
        <div
          className="side0bar-footer-text-container"
          title={localStorage.getItem("userName")}
        >
          <IoMdPerson className="footer-icon" />
          <p className="sidebar-footer-text">
            {localStorage.getItem("userName")}
          </p>
        </div>
        <RxExit
          className="footer-icon"
          onClick={handleLogout}
          title={i18n.t("common.logout")}
        />
      </div>
      <p className="footer-copyright-text">{i18n.t("sidebar.footerText")}</p>
    </div>
  );
};
