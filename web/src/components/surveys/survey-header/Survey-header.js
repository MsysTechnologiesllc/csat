import React, { useState } from "react";
import { Drawer, Button } from "antd";
const SurveyHeader = () => {
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <div className="survey-header-container">
      <h3 className="survey-heading">Surveys</h3>
      <div className="survey-filter-section">
        <Button
          icon={<i className="icon-filter" />}
          className="filter-button"
          type="text"
          onClick={showDrawer}
        >
          Filter
        </Button>
      </div>
      <Drawer
        title="title"
        className="filter-sider"
        placement="right"
        onClose={onClose}
        closeIcon={<i className="icon-close-filled close-icon" />}
        open={open}
        footer={<div className="filter-buttons-container">nano</div>}
      >
        <div className="collpase-container">
          {/* <Collapse>
            <Panel header={i18n.t("contentCreation.category")}>
              <SearchInput
                className="content-creation-search"
                onChange={(event) => getCategorySearchData(event)}
                placeholder={i18n.t("contentCreation.searchPlaceolder")}
              />
              <div className="filter-checkbox-container">
                <Checkbox.Group
                  className="filter-checkbox"
                  value={checkedList}
                  options={courseList}
                  onChange={onChangeCategoryFilter}
                />
              </div>
            </Panel>
          </Collapse>
          <Collapse>
            <Panel header={i18n.t("contentCreation.courseStatus")}>
              <div className="filter-checkbox-course-container">
                <Radio.Group
                  onChange={onChangeCourseFilter}
                  value={selectedCourseData}
                >
                  {courseCheckboxData.map((item) => {
                    return (
                      <Radio className="filter-checkbox" value={item.key}>
                        {item.label}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </div>
            </Panel>
          </Collapse> */}
        </div>
      </Drawer>
    </div>
  );
};

export default SurveyHeader;
