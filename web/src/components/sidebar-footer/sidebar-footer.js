import React from "react";
import { IoMdPerson } from "react-icons/io";
import { RxExit } from "react-icons/rx";
import i18n from "../../locales/i18next";

export const SidebarFooter = () => {
  return (
    <div>
      <div className="sidebar-footer-container">
        <div className="side0bar-footer-text-container">
          <IoMdPerson className="footer-icon" />
          <p className="sidebar-footer-text">{i18n.t("sidebar.manager")}</p>
        </div>
        <RxExit className="footer-icon" />
      </div>
      <p className="footer-copyright-text">{i18n.t("sidebar.footerText")}</p>
    </div>
  );
};
