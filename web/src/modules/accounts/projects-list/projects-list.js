import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Modal,
  Pagination,
  Popover,
  Row,
  Segmented,
  Table,
  TreeSelect,
} from "antd";
import React, { useEffect, useState } from "react";
import i18n from "../../../locales/i18next";
import { GoDotFill } from "react-icons/go";
import "./projects-list.scss";
import {
  AppstoreOutlined,
  BarsOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineExclamationCircle,
} from "react-icons/ai";
import { NoOfDays } from "../../../utils/utils";
import { GetService } from "../../../services/get";
import { PutService } from "../../../services/put";
import NotifyStatus from "../../../components/notify-status/notify-status";

export const ProjectsList = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { state } = useLocation();
  const [breadcrumbList, setBreadcrumbList] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState("Grid");
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isId, setIsId] = useState("");
  const [isPopover, setIsPopover] = useState(false);
  const [popId, setPopId] = useState("");
  const [projectsList, setProjectsList] = useState({});
  const [notify, setNotify] = useState("");
  const [message, setMessage] = useState("");
  const projectsApi = () => {
    new GetService().getAccountsList(state?.tenantId, (result) => {
      if (result?.status === 200) {
        const filteredAccount =
          result?.data?.data?.tenant?.tenant_accounts.filter(
            (account) => account.ID === state?.accountId,
          );
        setProjectsList(...filteredAccount);
        setIsLoading(false);
      }
    });
  };
  useEffect(() => {
    if (state?.tenantId) {
      projectsApi();
    }
  }, [state?.tenantId]);
  const [open, setOpen] = useState(false);
  // const showDrawer = () => {
  //   setOpen(true);
  // };
  const onClose = () => {
    setOpen(false);
  };
  const handleOnOpenChange = (id) => {
    if (id !== popId) {
      setPopId(id);
      setIsPopover(true);
    }
  };
  const handleonCancel = () => {
    setDeleteModal(false);
    setIsId("");
    setPopId("");
  };
  const handleonOk = (project) => {
    const payload = {
      name: project?.name,
      account_id: projectsList.ID,
      active: false,
    };
    new PutService().updateProject(project.ID, payload, (result) => {
      if (result.status === 200) {
        projectsApi();
        setNotify("success");
        setMessage("Project Deleted Successfully");
        setDeleteModal(false);
        setIsId("");
        setPopId("");
        setTimeout(() => {
          setNotify("");
          setMessage("");
        }, 2000);
      }
    });
  };
  const handleOnClickMore = (option, id) => {
    if (option === "Delete" && isId !== id) {
      setDeleteModal(true);
      setIsId(id);
      setIsPopover(false);
    }
  };
  const handleView = (project) => {
    navigate(
      `/accounts/${state?.accountId}/projects/${project?.ID}/formatlist`,
      {
        state: {
          prjId: project?.ID,
          accountName: projectsList?.name,
          accountId: projectsList.ID,
          projectsList: projectsList?.account_projects,
          projectName: project?.name,
          status: true,
        },
      },
    );
  };
  const handleBreadCrumb = () => {
    navigate("/accounts");
  };
  const addNewProject = () => {
    setOpen(true);
  };
  // const handleOk = () => {
  //   setIsModalOpen(false);
  // };
  // const handleCancel = () => {
  //   setIsModalOpen(false);
  // };

  useEffect(() => {
    let breadcrumbItems = [
      { title: i18n.t("sidebar.accounts"), onClick: handleBreadCrumb },
    ];
    if (projectsList) {
      breadcrumbItems.push({
        title: projectsList?.name,
      });
    }
    setBreadcrumbList(breadcrumbItems);
  }, [projectsList]);
  const columns = [
    {
      title: "Project",
      dataIndex: "projectName",
      key: "projectName",
    },
    {
      title: "Project Owner",
      dataIndex: "projectOwner",
      key: "projectOwner",
    },
    {
      title: "Members",
      dataIndex: "members",
      key: "members",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: () => (
        <div>
          <EditOutlined className="edit" />
          <DeleteOutlined className="delete" />
        </div>
      ),
    },
    {
      title: "View",
      dataIndex: "view",
      key: "view",
      render: () => <EyeOutlined />,
    },
  ];
  const data = [];
  projectsList?.account_projects?.map((project, index) => {
    const prjManager = project?.Users?.filter(
      (user) => user.role === "projectManager",
    );
    const teamMembers = project?.Users?.filter(
      (user) => user.role === "member",
    );
    data.push({
      key: index + 1,
      projectName: project?.name,
      projectOwner: prjManager[0]?.name,
      members: `${teamMembers?.length} Member(s)`,
    });
  });
  const handleFieldFinish = (changedFields, allFields) => {
    console.log(allFields);
  };
  const treeData = [
    {
      title: "Node1",
      value: "0-0",
      key: "0-0",
    },
    {
      title: "Node2",
      value: "0-1",
      key: "0-1",
    },
    {
      title: "Node3",
      value: "0-2",
      key: "0-2",
    },
  ];
  return (
    <div className="projects-list-wrapper">
      <Breadcrumb items={breadcrumbList} onClick={handleBreadCrumb} />
      <div className="account-header-container">
        <h1 className="project-title">{projectsList?.name}</h1>
        <div className="actions-container">
          <Segmented
            options={[
              {
                value: "Grid",
                icon: <AppstoreOutlined />,
              },
              {
                value: "List",
                icon: <BarsOutlined />,
              },
            ]}
            onChange={(value) => {
              setSelectedSegment(value);
            }}
          />
          <Button onClick={addNewProject} className="add-account-button">
            ADD PROJECTS
          </Button>
          <Drawer
            title="Add project"
            width={720}
            onClose={onClose}
            open={open}
            extra={
              <div>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onClose} htmlType="submit" type="primary">
                  Add Project
                </Button>
              </div>
            }
          >
            <Form
              form={form}
              onFieldsChange={handleFieldFinish}
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
              <Form.Item
                name="projectStakeholders"
                label="Project Stakeholders"
              >
                <TreeSelect
                  treeData={treeData}
                  treeNodeFilterProp="title"
                  allowClear="true"
                  showSearch
                  multiple
                  placeholder="First Name /Last Name / Email ID"
                />
              </Form.Item>
              <Form.Item name="stakeholder" label="Stake holder">
                <TreeSelect
                  treeData={treeData}
                  treeNodeFilterProp="title"
                  allowClear="true"
                  showSearch
                  multiple
                  placeholder="Select / Type Email ID"
                />
              </Form.Item>
              <Form.Item name="scrumTeam" label="SCRUM Team">
                <TreeSelect
                  treeData={treeData}
                  treeNodeFilterProp="title"
                  allowClear="true"
                  showSearch
                  multiple
                  placeholder="Select / Type Email ID"
                />
              </Form.Item>
              <Form.Item name="lead" label="Lead">
                <TreeSelect
                  treeData={treeData}
                  treeNodeFilterProp="title"
                  allowClear="true"
                  showSearch
                  multiple
                  placeholder="Select / Type Email ID"
                />
              </Form.Item>
              <Form.Item name="pmo" label="PMO">
                <TreeSelect
                  treeData={treeData}
                  treeNodeFilterProp="title"
                  allowClear="true"
                  showSearch
                  multiple
                  placeholder="Select / Type Email ID"
                />
              </Form.Item>
            </Form>
          </Drawer>
        </div>
      </div>
      {selectedSegment === "Grid" ? (
        <Row gutter={[20, 20]} className="project-list-wrapper">
          {projectsList?.account_projects?.map((project) => {
            const prjManager = project?.Users?.filter(
              (user) => user.role === "projectManager",
            );
            const teamMembers = project?.Users?.filter(
              (user) => user.role === "member",
            );
            return (
              <Col xs={24} md={12} lg={8} xxl={6} key={project.ID}>
                <Card className="project-wrapper">
                  <div className="project-client-context-day-container">
                    <div className="avatar-project-client-context-container">
                      <p className="avatar">
                        {`${project.name
                          .split(" ")
                          .map((word) => word.charAt(0).toUpperCase())
                          .join("")}`}
                      </p>
                      <div className="project-client-container">
                        <h4 className="project-name" title={project.name}>
                          {project.name}
                        </h4>
                        <p className="client-name">{prjManager[0]?.name}</p>
                      </div>
                    </div>
                    <div className="day-left-container">
                      <GoDotFill
                        className={
                          NoOfDays(project?.end_date) <= 0
                            ? "red-dot"
                            : NoOfDays(project?.end_date) > 0 &&
                                NoOfDays(project?.end_date) <= 10
                              ? "orange-dot"
                              : "green-dot"
                        }
                      />
                      <p className="days-left-context">
                        {NoOfDays(project?.end_date) > 0
                          ? i18n.t("projects.daysLeft", {
                              days:
                                NoOfDays(project?.end_date) > 0 &&
                                NoOfDays(project?.end_date),
                            })
                          : i18n.t("projects.completed")}
                      </p>
                    </div>
                    <Popover
                      content={
                        <div className="more-options">
                          <span
                            onClick={(event) => {
                              event.stopPropagation();
                              handleOnClickMore("Edit");
                            }}
                          >
                            <AiOutlineEdit className="icon" />
                            {i18n.t("common.edit")}
                          </span>
                          <span
                            onClick={(event) => {
                              event.stopPropagation();
                              handleOnClickMore("Delete", project.ID);
                            }}
                          >
                            <AiOutlineDelete className="icon" />
                            {i18n.t("common.delete")}
                          </span>
                        </div>
                      }
                      trigger="click"
                      arrow={false}
                      placement="bottomRight"
                      overlayStyle={{ padding: 0 }}
                      open={popId === project.ID && isPopover}
                      onOpenChange={() => handleOnOpenChange(project.ID)}
                    >
                      <div
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                        className="more-option-icon"
                      >
                        <img
                          src="/images/ellipse-vertical.svg"
                          alt={i18n.t("common.moreOptions")}
                        />
                      </div>
                    </Popover>
                    {isId === project.ID && (
                      <Modal
                        open={deleteModal}
                        closable={false}
                        okText="Delete"
                        onCancel={handleonCancel}
                        onOk={() => handleonOk(project)}
                        className="modal"
                        centered
                      >
                        <div className="model-content-container">
                          <AiOutlineExclamationCircle className="excalamation-icon" />
                          <div className="content-wrapper">
                            <h3 className="title">
                              {i18n.t("deleteModal.projectsTitle", {
                                projectName: project.name,
                              })}
                            </h3>
                            <p className="context">
                              {i18n.t("deleteModal.context")}
                            </p>
                          </div>
                        </div>
                      </Modal>
                    )}
                  </div>
                  <div className="team-view-container">
                    <p className="team-members-context">{`${teamMembers?.length} Member(s)`}</p>
                    <Button
                      className="view-button"
                      type="text"
                      onClick={() => handleView(project)}
                    >
                      {i18n.t("accounts.view")}
                    </Button>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <div className="accounts-list-container">
          <Table columns={columns} dataSource={data} pagination={false} />
          <Pagination
            total={data?.length}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Total ${total} items`}
            className="pagination"
          />
        </div>
      )}
      {notify && <NotifyStatus status={notify} message={message} />}
    </div>
  );
};
