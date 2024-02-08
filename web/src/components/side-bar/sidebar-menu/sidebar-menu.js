import { Menu } from "antd";
import React from "react";
import PropTypes from "prop-types";
import "./sidebar-menu";

export const SiderBarMenu = ({
  menuItems,
  defaultSelectedItem,
  onClickCallback,
  selectedKeys,
}) => {
  return (
    <div>
      <Menu
        style={{
          background: "none",
        }}
        defaultSelectedKeys={defaultSelectedItem}
        selectedKeys={selectedKeys}
        items={menuItems}
        onClick={onClickCallback}
        mode="inline"
      />
    </div>
  );
};

SiderBarMenu.propTypes = {
  menuItems: PropTypes.array.isRequired,
  defaultSelectedItem: PropTypes.string.isRequired,
  onClickCallback: PropTypes.func.isRequired,
  selectedKeys: PropTypes.string.isRequired,
};
