import React, { useState } from "react";
import PropTypes from "prop-types";
import { CloseOutlined } from "@ant-design/icons";

import { Drawer, Button, Radio, Checkbox, Row, Col } from "antd";
const SurveyHeader = ({ getStatusFilterUpdates, getAccountFilterUpdates }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(1);
  const [checkedList, setCheckedList] = useState([]);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onChange = (e) => {
    setValue(e.target.value);
    getStatusFilterUpdates(e.target.value);
  };
  const onChangeCheckbox = (checkedValues) => {
    setCheckedList(checkedValues);
    getAccountFilterUpdates(checkedValues);
  };
  const radioOptions = [
    { label: "All", value: "all" },
    { label: "To Follow-up", value: "publish" },
    { label: "Completed", value: "completed" },
    { label: "Overdue", value: "pending" },
  ];
  const checkboxOptions = [
    { label: "Rubic", value: "rubic" },
    { label: "Liquidware", value: "liquidware" },
  ];
  return (
    <div className="survey-header-container">
      <h3 className="survey-heading">Surveys</h3>
      <div className="survey-filter-section">
        <Button
          icon={<img src="/images/filter-icon.svg" alt="filter" />}
          className="filter-button"
          type="text"
          onClick={showDrawer}
        >
          FILTERS
        </Button>
      </div>
      <Drawer
        className="filter-sider"
        placement="right"
        onClose={onClose}
        closeIcon={
          <div className="close-section">
            <CloseOutlined /> <span>CLOSE</span>
          </div>
        }
        open={open}
        footer={false}
      >
        <div className="filters-container">
          <div className="status-filter">
            <h5 className="filter-type-heading">Status</h5>
            <Radio.Group onChange={onChange} value={value}>
              <Row>
                {radioOptions.map((option) => (
                  <Col span={24} key={option.value}>
                    <Radio className="radio-text" value={option.value}>
                      {option.label}
                    </Radio>
                  </Col>
                ))}
              </Row>
            </Radio.Group>
          </div>
          <div className="account-filter">
            <h5 className="filter-type-heading">Account Name</h5>
            <Checkbox.Group onChange={onChangeCheckbox} value={checkedList}>
              <Row>
                {checkboxOptions.map((option) => (
                  <Col span={24} key={option.value}>
                    <Checkbox className="checkbox-text" value={option.value}>
                      {option.label}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default SurveyHeader;

SurveyHeader.propTypes = {
  getStatusFilterUpdates: PropTypes.func.isRequired,
  getAccountFilterUpdates: PropTypes.func.isRequired,
};
