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

export const ProjectsList = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
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
    setDropdownOptions([]);
    if (search?.length >= 3) {
      new GetService().getAccountOwners(search, (result) => {
        const updatedArray = [];
        if (result?.status === 200) {
          result?.data?.data?.db_users?.map((option) => {
            updatedArray.push({ title: option.Email, value: option?.Name });
          });
          result?.data?.data?.gsuit_users?.map((option) => {
            updatedArray.push({ title: option.Email, value: option?.Name });
          });
          console.log(updatedArray);
          setDropdownOptions(updatedArray);
        } else {
          setDropdownOptions([]);
        }
      });
    } else {
      setDropdownOptions([]);
    }
  }, [search]);
  useEffect(() => {
    setDropdownOptionsData((prevData) => [...prevData, ...dropdownOptions]);
  }, [dropdownOptions]);
  console.log(dropdownOptionsData, "options");
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
  const onClose = () => {
    setAddProject("");
  };
  const handleFinish = (values) => {
    const { $y, $M, $D, $H, $m, $s, $SSS, $Z } = values.startDate;
    const formattedDate = moment(
      `${$y}-${$M + 1}-${$D} ${$H}:${$m}:${$s}.${$SSS}${$Z}`,
      "YYYY-MM-DD HH:mm:ss.SSSZZ",
    ).format("YYYY-MM-DD HH:mm:ss.SSSSSSZ");
    const payload = {
      Project_name: values.projectName,
      Start_Date: formattedDate,
      team_member: [
        ...formatTreeData(values.pointOfContact, dropdownOptionsData, "client"),
        ...formatTreeData(values.pmo, dropdownOptionsData, "manager"),
        ...formatTreeData(values.lead, dropdownOptionsData, "lead"),
        ...formatTreeData(values.scrumTeam, dropdownOptionsData, "member"),
      ],
    };
    // new PutService().addUpdateProject(
    //   addProject === "add" ? "" : projectId,
    //   state?.accountId,
    //   payload,
    //   (result) => {
    //     if (result?.status === 200) {
    //       console.log("added");
    //     }
    //   },
    // );
    console.log("Form values:", payload);
  };
  const formatTreeData = (selectedValues, treeData, role) =>
    Array.isArray(selectedValues)
      ? selectedValues
          .map((value) => {
            const node = treeData.find((node) => node.value === value);
            return node
              ? { email: node.title, name: node.value, role: role }
              : null;
          })
          .filter(Boolean)
      : [];
  // const treeData1 = [
  //   {
  //     title: "Node1",
  //     value: "name1",
  //   },
  //   {
  //     title: "Node2",
  //     value: "name2",
  //   },
  //   {
  //     title: "Node3",
  //     value: "name3",
  //   },
  // ];
  // const treeData2 = [
  //   {
  //     title: "Node4",
  //     value: "name4",
  //   },
  //   {
  //     title: "Node5",
  //     value: "name5",
  //   },
  //   {
  //     title: "Node6",
  //     value: "name6",
  //   },
  // ];
  // const treeData3 = [
  //   {
  //     title: "Node7",
  //     value: "name7",
  //   },
  //   {
  //     title: "Node8",
  //     value: "name8",
  //   },
  //   {
  //     title: "Node9",
  //     value: "name9",
  //   },
  // ];
  // const treeData4 = [
  //   {
  //     title: "NodeA",
  //     value: "nameA",
  //   },
  //   {
  //     title: "NodeB",
  //     value: "nameB",
  //   },
  //   {
  //     title: "NodeC",
  //     value: "nameC",
  //   },
  // ];
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
        setEachProject({});
        setAddProject("");
        setPopId("");
        setTimeout(() => {
          setNotify("");
          setMessage("");
        }, 2000);
      }
    });
  };
  const handleOnClickMore = (option, project) => {
    if (option === "Delete") {
      setDeleteModal(true);
      setEachProject(project);
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
            onClick={() => setAddProject("edit")}
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
            ADD PROJECTS
          </Button>
          <AddEditProjects
            handleFinish={handleFinish}
            onClose={onClose}
            addProject={addProject}
            setSearch={setSearch}
            dropdownOptions={dropdownOptions}
            setDropdownOptions={setDropdownOptions}
          />
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
                              setAddProject("edit");
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
