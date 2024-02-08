import React from "react";
import { IoMdPerson } from "react-icons/io";
import { RxExit } from "react-icons/rx";

export const SidebarFooter = () => {
  return (
    <div>
      <div className="sidebar-footer-container">
        <div className="side0bar-footer-text-container">
          <IoMdPerson className="footer-icon" />
          <p className="sidebar-footer-text">Manager</p>
        </div>
        <RxExit className="footer-icon" />
      </div>
      <p className="footer-copyright-text">© 2022 MSys Technologies</p>
    </div>
  );
};
