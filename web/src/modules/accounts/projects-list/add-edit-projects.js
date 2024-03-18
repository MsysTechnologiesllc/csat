import { Button, DatePicker, Drawer, Form, Input, Select } from "antd";
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDetectMobileOrDesktop } from "../../../hooks/useDetectMobileOrDesktop";
import "./projects-list.scss";
import moment from "moment";

export const AddEditProjects = ({
  addProject,
  handleFinish,
  onClose,
  setSearch,
  dropdownOptions,
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
        name: user.name,
        email: user.email,
      })),
    );
  }, [addProject]);
  const handleChangeInOwners = (values, options) => {
    if (addProject === "add") {
      let option = [];
      options.map((item) => {
        option.push({ name: item.label, email: item.value });
      });
      setSelectedItems((prevData) => [...prevData, ...option]);
    }
    if (addProject === "edit") {
      let option = [];
      options.map((item) => {
        if (item.label !== undefined && item.value !== undefined) {
          option.push({ name: item.label, email: item.value });
        }
      });
      setSelectedItems((prevData) => [...prevData, ...option]);
    }
  };
  const handleOwnersDeselect = (value) => {
    let deletedItems = selectedItems.filter((item) => item.email === value);
    if (deletedItems) {
      setRemovedItems((prevData) => [...prevData, ...deletedItems]);
    }
    setSelectedItems(
      selectedItems.filter(
        (item) => item.name !== value && item.email !== value,
      ),
    );
  };
  const formItemData = [
    { name: "pmo", label: "PMO" },
    { name: "lead", label: "Lead" },
    { name: "scrumTeam", label: "SCRUM Team" },
  ];

  return (
    <Drawer
      title={addProject === "add" ? "Add Project" : "Edit Project"}
      width={isMobile ? "90%" : isTablet ? "60%" : "40%"}
      onClose={onClose}
      open={addProject === "add" || addProject === "edit" ? true : false}
      className="custom-drawer"
      extra={
        <>
          <Button onClick={onClose} className="cancle-btn">
            Cancel
          </Button>
          <Button
            onClick={() => form.submit()}
            className="submit-btn"
            htmlType="submit"
            type="primary"
          >
            {addProject === "add" ? "Submit" : "Update"}
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
          label={<span className="custom-label">Project Name</span>}
          rules={[
            {
              required: true,
              message: "Please enter project name",
            },
          ]}
        >
          <Input placeholder="Project #" />
        </Form.Item>
        <Form.Item name="startDate" label="SOW Start Date">
          <DatePicker />
        </Form.Item>
        <Form.Item name="pointOfContact" label="Point of contact">
          <Select
            mode="multiple"
            onDeselect={handleOwnersDeselect}
            placeholder="First Name /Last Name / Email ID"
            onSearch={(value) => setSearch(value)}
            onChange={handleChangeInOwners}
            optionLabelProp="label"
            // loading={optionsLoader}
            // notFoundContent={optionsLoader ? <Spin size="small" /> : null}
          >
            {dropdownOptions?.map((option) => (
              <Option
                key={option.email}
                value={option.email}
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
        <h5 className="team-members">Team Members</h5>
        {formItemData.map(({ name, label }) => (
          <Form.Item key={name} name={name} label={label}>
            <Select
              mode="multiple"
              onDeselect={handleOwnersDeselect}
              placeholder="Select / Type Email ID"
              onSearch={(value) => setSearch(value)}
              onChange={handleChangeInOwners}
              optionLabelProp="label"
            >
              {dropdownOptions?.map((option) => (
                <Option
                  key={option.email}
                  value={option.email}
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
  selectedItems: PropTypes.array.isRequired,
  setSelectedItems: PropTypes.array.isRequired,
  setRemovedItems: PropTypes.array.isRequired,
  eachProject: PropTypes.object.isRequired,
  form: PropTypes.any.isRequired,
};
