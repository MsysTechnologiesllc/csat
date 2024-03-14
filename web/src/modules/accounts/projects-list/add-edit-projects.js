import { Button, DatePicker, Drawer, Form, Input, TreeSelect } from "antd";
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
  setDropdownOptions,
  eachProject,
  form,
}) => {
  const { isMobile, isTablet } = useDetectMobileOrDesktop();
  useEffect(() => {
    const pointOfContactData = eachProject?.Users?.filter(
      (user) => user.role === "client",
    );
    const pmoData = eachProject?.Users?.filter(
      (user) => user.role === "Manager",
    );
    const leadData = eachProject?.Users?.filter((user) => user.role === "Lead");
    const scrumTeamData = eachProject?.Users?.filter(
      (user) => user.role === "Developer",
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
    setDropdownOptions(
      [
        pointOfContactData?.map((each) => ({
          value: each?.email,
          title: each?.name,
        })),
        pmoData?.map((each) => ({
          value: each?.email,
          title: each?.name,
        })),
        leadData?.map((each) => ({
          value: each?.email,
          title: each?.name,
        })),
        scrumTeamData?.map((each) => ({
          value: each?.email,
          title: each?.name,
        })),
      ]
        .filter((item) => item?.length > 0)
        .flat()
        .map((item) => ({ value: item?.value, title: item?.title })),
    );
  }, [addProject]);
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
          <TreeSelect
            treeData={dropdownOptions}
            onSearch={(value) => {
              setSearch(value);
            }}
            value={["johnA3@example.com"]}
            allowClear="true"
            showSearch
            multiple
            placeholder="First Name /Last Name / Email ID"
          />
        </Form.Item>
        <h5 className="team-members">Team Members</h5>
        <Form.Item name="pmo" label="PMO">
          <TreeSelect
            treeData={dropdownOptions}
            onSearch={(value) => setSearch(value)}
            allowClear="true"
            showSearch
            multiple
            placeholder="Select / Type Email ID"
          />
        </Form.Item>
        <Form.Item name="lead" label="Lead">
          <TreeSelect
            treeData={dropdownOptions}
            onSearch={(value) => setSearch(value)}
            allowClear="true"
            showSearch
            multiple
            placeholder="Select / Type Email ID"
          />
        </Form.Item>
        <Form.Item name="scrumTeam" label="SCRUM Team">
          <TreeSelect
            treeData={dropdownOptions}
            onSearch={(value) => setSearch(value)}
            allowClear="true"
            showSearch
            multiple
            placeholder="Select / Type Email ID"
          />
        </Form.Item>
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
  eachProject: PropTypes.object.isRequired,
  form: PropTypes.any.isRequired,
};
