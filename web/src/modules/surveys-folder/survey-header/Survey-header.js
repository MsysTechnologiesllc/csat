import React, { useState } from "react";
import PropTypes from "prop-types";
import { CloseOutlined } from "@ant-design/icons";
import i18n from "../../../locales/i18next";

import { Drawer, Button, Radio, Checkbox, Row, Col } from "antd";
const SurveyHeader = ({
  getStatusFilterUpdates,
  getAccountFilterUpdates,
  prjData,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("all");
  const [checkedList, setCheckedList] = useState([]);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onChange = (event) => {
    setValue(event.target.value);
    getStatusFilterUpdates(event.target.value);
    onClose();
  };
  const onChangeCheckbox = (checkedValues) => {
    setCheckedList(checkedValues);
    getAccountFilterUpdates(checkedValues);
    onClose();
  };
  const radioOptions = [
    { label: i18n.t("surveyList.all"), value: "all" },
    { label: i18n.t("surveyList.toFollow"), value: "pending" },
    { label: i18n.t("surveyList.publish"), value: "publish" },
    { label: i18n.t("surveyList.overdue"), value: "overdue" },
  ];
  const checkboxOptions = prjData.map((item) => {
    return { label: item?.name, value: item?.name };
  });
  return (
    <div className="survey-header-container">
      <h3 className="survey-heading">{i18n.t("surveyList.surveys")}</h3>
      <div className="survey-filter-section">
        <Button
          icon={
            <img
              src="/images/filter-icon.svg"
              alt={i18n.t("surveyList.filters")}
            />
          }
          className="filter-button"
          type="text"
          onClick={showDrawer}
        >
          {i18n.t("surveyList.filters")}
        </Button>
      </div>
      <Drawer
        className="filter-sider"
        placement="right"
        onClose={onClose}
        closeIcon={
          <div className="close-section">
            <CloseOutlined /> <span>{i18n.t("surveyList.close")}</span>
          </div>
        }
        open={open}
        footer={false}
      >
        <div className="filters-container">
          <div className="status-filter">
            <h5 className="filter-type-heading">
              {i18n.t("surveyList.status")}
            </h5>
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
            <h5 className="filter-type-heading">
              {i18n.t("surveyList.accName")}
            </h5>
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
  prjData: PropTypes.array.isRequired,
};
