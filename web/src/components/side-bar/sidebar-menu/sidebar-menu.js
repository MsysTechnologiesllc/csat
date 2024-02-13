import { Menu } from "antd";
import React from "react";
import PropTypes from "prop-types";
import "./siderbar-menu.scss";

export const SiderBarMenu = ({
  menuItems,
  defaultSelectedItem,
  onClickCallback,
  selectedKeys,
}) => {
  return (
    <Menu
      defaultSelectedKeys={defaultSelectedItem}
      selectedKeys={selectedKeys}
      items={menuItems}
      onClick={onClickCallback}
      mode="inline"
      className="menu-container"
    />
  );
};

SiderBarMenu.propTypes = {
  menuItems: PropTypes.array.isRequired,
  defaultSelectedItem: PropTypes.string.isRequired,
  onClickCallback: PropTypes.func.isRequired,
  selectedKeys: PropTypes.string.isRequired,
};
