import { Button, DatePicker, Drawer, Form, Input, TreeSelect } from "antd";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDetectMobileOrDesktop } from "../../../hooks/useDetectMobileOrDesktop";
import "./projects-list.scss";
import { GetService } from "../../../services/get";

export const AddEditProjects = ({
  addProject,
  handleFinish,
  onClose,
  setSearch,
  dropdownOptions,
  setDropdownOptions,
  eachProject,
}) => {
  const { isMobile, isTablet } = useDetectMobileOrDesktop();
  const [form] = Form.useForm();
  // const [getData, setGetData] = useState([]);
  const [pointOfContactData, setPointOfContactData] = useState([]);
  // const [leadData, setLeadData] = useState([]);
  // const [scrumTeamData, setScrumTeamData] = useState([]);
  // const [pmoData, setPmoData] = useState([]);
  useEffect(() => {
    addProject === "edit" &&
      new GetService().getProjectDetails(eachProject?.ID, (result) => {
        if (result?.status === 200) {
          // setGetData(result?.data?.data);
          const data = [];
          const pointOfContact = result?.data?.data?.Users?.filter(
            (user) => user.role === "client",
          );
          pointOfContact?.map((each) => {
            data.push(each?.email);
            setPointOfContactData(data);
          });
          const scrumTeam = result?.data?.data?.Users?.filter(
            (user) => user.role === "member",
          );
          setScrumTeamData(scrumTeam);
          const pmo = result?.data?.data?.Users?.filter(
            (user) => user.role === "manager",
          );
          setPmoData(pmo);
          const lead = result?.data?.data?.Users?.filter(
            (user) => user.role === "lead",
          );
          setLeadData(lead);
          form.setFieldsValue({
            projectName: result?.data?.data?.name,
            // pointOfContact: pointOfContactData,
          });
        }
      });
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
              setDropdownOptions([]);
              setSearch(value);
            }}
            value={addProject === "edit" && pointOfContactData}
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
};
