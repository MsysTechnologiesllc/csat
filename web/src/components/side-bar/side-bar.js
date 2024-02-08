import { Layout } from "antd";
import React from "react";
import PropTypes from "prop-types";
import { SiderBarMenu } from "./sidebar-menu/sidebar-menu";
import { Header } from "../header/header";
import { GoArrowLeft } from "react-icons/go";
import { SidebarFooter } from "../sidebar-footer/sidebar-footer";

const { Sider } = Layout;

export const SideBar = ({
  menuItems,
  defaultSelectedItem,
  onClickCallback,
  selectedKeys,
  setShowSidebar,
  showSidebar,
}) => {
  return (
    <Sider width={220} className="sidebar-container">
      <div>
        <Header prjTitle="" displayPrjTitle={true} />
        <div
          className={`nav-arrow ${showSidebar ? "show-arrow" : "hide-arrow"}`}
          onClick={() => setShowSidebar(false)}
        >
          <GoArrowLeft className="arrow-icon" />
        </div>
        <SiderBarMenu
          menuItems={menuItems}
          defaultSelectedItem={defaultSelectedItem}
          onClickCallback={onClickCallback}
          isDefaultNavBarView={true}
          selectedKeys={selectedKeys}
        />
      </div>
      <SidebarFooter />
    </Sider>
  );
};
SideBar.propTypes = {
  menuItems: PropTypes.array.isRequired,
  defaultSelectedItem: PropTypes.string.isRequired,
  onClickCallback: PropTypes.func.isRequired,
  selectedKeys: PropTypes.string.isRequired,
  showSidebar: PropTypes.bool.isRequired,
  setShowSidebar: PropTypes.bool.isRequired,
};
