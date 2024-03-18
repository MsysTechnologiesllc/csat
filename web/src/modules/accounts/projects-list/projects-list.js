import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Modal,
  Pagination,
  Popover,
  Row,
  Segmented,
  Table,
  Form,
} from "antd";
import React, { useEffect, useState } from "react";
import i18n from "../../../locales/i18next";
import { GoDotFill } from "react-icons/go";
import "./projects-list.scss";
import {
  TableOutlined,
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
import { AddEditProjects } from "./add-edit-projects";
import moment from "moment";
import { plLibComponents } from "../../../context-provider/component-provider";

export const ProjectsList = () => {
  const { NoData } = plLibComponents.components;
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form] = Form.useForm();
  const [breadcrumbList, setBreadcrumbList] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState("Grid");
  const [deleteModal, setDeleteModal] = useState(false);
  const [eachProject, setEachProject] = useState({});
  const [isPopover, setIsPopover] = useState(false);
  const [popId, setPopId] = useState("");
  const [projectsList, setProjectsList] = useState({});
  const [notify, setNotify] = useState("");
  const [message, setMessage] = useState("");
  const [addProject, setAddProject] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [dropdownOptionsData, setDropdownOptionsData] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    if (search?.length >= 3) {
      new GetService().getAccountOwners(search, (result) => {
        const updatedArray = [];
        if (result?.status === 200) {
          result?.data?.data?.db_users?.map((option) => {
            updatedArray.push({ title: option?.email, value: option?.name });
          });
          result?.data?.data?.gsuit_users?.map((option) => {
            updatedArray.push({ title: option?.email, value: option?.name });
          });
          setDropdownOptions(updatedArray);
        }
      });
    }
  }, [search]);
  useEffect(() => {
    setDropdownOptionsData((prevData) => [...prevData, ...dropdownOptions]);
  }, [dropdownOptions]);
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
  }, [state?.tenantId, addProject]);
  const onClose = () => {
    setAddProject("");
    form.resetFields();
  };
  const handleFinish = (values) => {
    const formattedDate = moment(values?.startDate).format(
      "YYYY-MM-DDTHH:mm:ss.SSSZ",
    );
    const payload = {
      Project_name: values?.projectName,
      Start_Date: formattedDate,
      team_member: [
        ...formatTreeData(
          values?.pointOfContact,
          dropdownOptionsData,
          "client",
        ),
        ...formatTreeData(values?.pmo, dropdownOptionsData, "manager"),
        ...formatTreeData(values?.lead, dropdownOptionsData, "lead"),
        ...formatTreeData(values?.scrumTeam, dropdownOptionsData, "member"),
      ],
    };
    new PutService().addUpdateProject(
      addProject === "add" ? 0 : eachProject?.ID,
      state?.accountId,
      payload,
      (result) => {
        if (result?.status === 200) {
          form.resetFields();
          setDropdownOptionsData([]);
          setAddProject("");
        }
      },
    );
  };
  const formatTreeData = (selectedValues, treeData, role) =>
    Array.isArray(selectedValues)
      ? selectedValues
          .map((value) => {
            const node = treeData.find(
              (node) => node.value === value || node.title === value,
            );
            return node
              ? { email: node.title, name: node.value, role: role }
              : null;
          })
          .filter(Boolean)
      : [];
  const handleOnOpenChange = (id) => {
    if (id !== popId) {
      setPopId(id);
      setIsPopover(true);
    }
  };
  const handleonCancel = () => {
    setDeleteModal(false);
    setEachProject({});
    setPopId("");
    setAddProject("");
  };
  const handleonOk = (project) => {
    const payload = {
      Project_name: project?.name,
      active: false,
    };
    new PutService().updateProject(
      project.ID,
      projectsList.ID,
      payload,
      (result) => {
        if (result.status === 200) {
          projectsApi();
          setNotify("success");
          setMessage("Project Deleted Successfully");
          setDeleteModal(false);
          setEachProject({});
          setPopId("");
          setTimeout(() => {
            setNotify("");
            setMessage("");
          }, 2000);
        }
      },
    );
  };
  const handleOnClickMore = (option, project) => {
    setEachProject(project);
    if (option === "Delete") {
      setDeleteModal(true);
      setIsPopover(false);
    } else {
      setAddProject("edit");
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
          tenantId: state?.tenantId,
        },
      },
    );
  };
  const handleBreadCrumb = () => {
    navigate("/accounts");
  };
  const addNewProject = () => {
    setAddProject("add");
  };
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
      dataIndex: "name",
      key: "name",
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
      render: (text, record) => (
        <div>
          <EditOutlined
            className="edit"
            onClick={() => {
              handleOnClickMore("Edit", record);
            }}
          />
          <DeleteOutlined
            className="delete"
            onClick={() => handleOnClickMore("Delete", record)}
          />
        </div>
      ),
    },
    {
      title: "View",
      dataIndex: "view",
      key: "view",
      render: (text, record) => (
        <EyeOutlined className="view" onClick={() => handleView(record)} />
      ),
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
      name: project?.name,
      projectOwner: prjManager[0]?.name,
      members: `${teamMembers?.length} Member(s)`,
      ID: project?.ID,
      Users: project?.Users,
      start_date: project?.start_date,
    });
  });
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
                icon: <TableOutlined />,
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
            {i18n.t("addAccount.addPrj")}
          </Button>
          <AddEditProjects
            handleFinish={handleFinish}
            onClose={onClose}
            addProject={addProject}
            setSearch={setSearch}
            dropdownOptions={dropdownOptions}
            setDropdownOptions={setDropdownOptions}
            eachProject={eachProject}
            form={form}
          />
        </div>
      </div>
      {selectedSegment === "Grid" ? (
        <Row gutter={[20, 20]} className="project-list-wrapper">
          {projectsList?.account_projects?.length > 0 ? (
            projectsList?.account_projects?.map((project) => {
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
                                handleOnClickMore("Edit", project);
                              }}
                            >
                              <AiOutlineEdit className="icon" />
                              {i18n.t("common.edit")}
                            </span>
                            <span
                              onClick={(event) => {
                                event.stopPropagation();
                                handleOnClickMore("Delete", project);
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
            })
          ) : (
            <NoData
              heading={i18n.t("addAccount.noPrj")}
              descriptionLine1=""
              descriptionLine2=""
            />
          )}
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
      <Modal
        open={deleteModal}
        closable={false}
        okText="Delete"
        onCancel={handleonCancel}
        onOk={() => handleonOk(eachProject)}
        className="modal"
        centered
      >
        <div className="model-content-container">
          <AiOutlineExclamationCircle className="excalamation-icon" />
          <div className="content-wrapper">
            <h3 className="title">
              {i18n.t("deleteModal.projectsTitle", {
                projectName: eachProject?.name,
              })}
            </h3>
            <p className="context">{i18n.t("deleteModal.context")}</p>
          </div>
        </div>
      </Modal>
      {notify && <NotifyStatus status={notify} message={message} />}
    </div>
  );
};
