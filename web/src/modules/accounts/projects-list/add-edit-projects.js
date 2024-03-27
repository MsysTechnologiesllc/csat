import { Button, DatePicker, Drawer, Form, Input, Select } from "antd";
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDetectMobileOrDesktop } from "../../../hooks/useDetectMobileOrDesktop";
import "./projects-list.scss";
import moment from "moment";
import i18n from "../../../locales/i18next";

export const AddEditProjects = ({
  addProject,
  handleFinish,
  onClose,
  setSearch,
  dropdownOptions,
  setDropdownOptions,
  eachProject,
  form,
  selectedItems,
  setSelectedItems,
  setRemovedItems,
}) => {
  const { isMobile, isTablet } = useDetectMobileOrDesktop();
  const { Option } = Select;
  useEffect(() => {
    const pointOfContactData = eachProject?.Users?.filter(
      (user) => user.role === "client",
    );
    const pmoData = eachProject?.Users?.filter(
      (user) => user.role === "manager",
    );
    const leadData = eachProject?.Users?.filter((user) => user.role === "lead");
    const scrumTeamData = eachProject?.Users?.filter(
      (user) => user.role === "member",
    );
    addProject === "edit" &&
      form.setFieldsValue({
        projectName: eachProject?.name,
        startDate: moment(eachProject?.start_date, "DD-MM-YYYY"),
        pointOfContact: pointOfContactData?.map((each) => each?.email),
        pmo: pmoData?.map((each) => each?.email),
        lead: leadData?.map((each) => each?.email),
        scrumTeam: scrumTeamData?.map((each) => each?.email),
      });
    setSelectedItems(
      eachProject?.Users?.map((user) => ({
        name: user?.name,
        email: user?.email,
      })),
    );
  }, [addProject]);
  const handleChangeInOwners = (values, options) => {
    if (addProject === "add") {
      let option = [];
      options.map((item) => {
        option.push({ name: item?.label, email: item?.value });
      });
      setSelectedItems((prevData) => [...prevData, ...option]);
    }
    if (addProject === "edit") {
      let option = [];
      options?.map((item) => {
        if (item?.label !== undefined && item?.value !== undefined) {
          option.push({ name: item?.label, email: item?.value });
        }
      });
      setSelectedItems((prevData) => [...prevData, ...option]);
    }
  };
  const handleOwnersDeselect = (value) => {
    let deletedItems = selectedItems?.filter((item) => item?.email === value);
    if (deletedItems) {
      setRemovedItems((prevData) => [...prevData, ...deletedItems]);
    }
    setSelectedItems(
      selectedItems.filter(
        (item) => item?.name !== value && item?.email !== value,
      ),
    );
  };
  const formItemData = [
    { name: "pmo", label: i18n.t("addProjects.pmo") },
    { name: "lead", label: i18n.t("addProjects.lead") },
    { name: "scrumTeam", label: i18n.t("addProjects.scrumTeam") },
  ];
  const handleEnter = () => {
    setDropdownOptions([]);
  };
  return (
    <Drawer
      title={
        addProject === "add"
          ? i18n.t("addProjects.addProject")
          : i18n.t("addProjects.editProject")
      }
      width={isMobile ? "90%" : isTablet ? "60%" : "40%"}
      onClose={onClose}
      open={addProject === "add" || addProject === "edit" ? true : false}
      className="custom-drawer"
      extra={
        <>
          <Button onClick={onClose} className="cancle-btn">
            {i18n.t("button.cancel")}
          </Button>
          <Button
            onClick={() => form.submit()}
            className="submit-btn"
            htmlType="submit"
            type="primary"
          >
            {addProject === "add"
              ? i18n.t("button.submit")
              : i18n.t("button.update")}
          </Button>
        </>
      }
    >
      <Form
        form={form}
        onFinish={handleFinish}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Form.Item
          name="projectName"
          label={
            <span className="custom-label">
              {i18n.t("addProjects.projectName")}
            </span>
          }
          rules={[
            {
              required: true,
              message: i18n.t("addProjects.message"),
            },
          ]}
        >
          <Input placeholder={i18n.t("addProjects.project")} />
        </Form.Item>
        <Form.Item
          name="startDate"
          label={i18n.t("addProjects.startDate")}
          rules={[
            {
              required: true,
              message: i18n.t("addProjects.startDateMessage"),
            },
          ]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="pointOfContact"
          label={i18n.t("addProjects.pointOfContact")}
          rules={[
            {
              required: true,
              message: i18n.t("addProjects.pointOfContactMessage"),
            },
          ]}
        >
          <Select
            mode="multiple"
            onDeselect={handleOwnersDeselect}
            placeholder={i18n.t("addProjects.placeholderPOC")}
            onSearch={(value) => setSearch(value)}
            onChange={handleChangeInOwners}
            optionLabelProp="label"
            onMouseEnter={handleEnter}
          >
            {dropdownOptions?.map((option) => (
              <Option
                key={option.email}
                value={option.name}
                label={option.name}
              >
                <>
                  <p>{option.name}</p>
                  <p>{option.email}</p>
                </>
              </Option>
            ))}
          </Select>
        </Form.Item>
        <h5 className="team-members">{i18n.t("addProjects.teamMembers")}</h5>
        {formItemData.map(({ name, label }) => (
          <Form.Item
            key={name}
            name={name}
            label={label}
            rules={[
              {
                required: true,
                message: i18n.t("addProjects.pmoMessage"),
              },
            ]}
          >
            <Select
              mode="multiple"
              onDeselect={handleOwnersDeselect}
              placeholder={i18n.t("addProjects.placeholder")}
              onSearch={(value) => setSearch(value)}
              onChange={handleChangeInOwners}
              onMouseEnter={handleEnter}
              optionLabelProp="label"
            >
              {dropdownOptions?.map((option) => (
                <Option
                  key={option.email}
                  value={option.name}
                  label={option.name}
                >
                  <>
                    <p>{option.name}</p>
                    <p>{option.email}</p>
                  </>
                </Option>
              ))}
            </Select>
          </Form.Item>
        ))}
      </Form>
    </Drawer>
  );
};
AddEditProjects.propTypes = {
  addProject: PropTypes.bool.isRequired,
  handleFinish: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  setSearch: PropTypes.string.isRequired,
  dropdownOptions: PropTypes.array.isRequired,
  setDropdownOptions: PropTypes.array.isRequired,
  selectedItems: PropTypes.array.isRequired,
  setSelectedItems: PropTypes.array.isRequired,
  setRemovedItems: PropTypes.array.isRequired,
  eachProject: PropTypes.object.isRequired,
  form: PropTypes.any.isRequired,
};
