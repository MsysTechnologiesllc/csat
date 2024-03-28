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
  Avatar,
} from "antd";
import React, { useEffect, useState } from "react";
import i18n from "../../../locales/i18next";
import { GoDotFill } from "react-icons/go";
import {
  TableOutlined,
  BarsOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate, useOutletContext } from "react-router";
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
import "./projects-list.scss";
import { ShimmerSimpleGallery } from "react-shimmer-effects";
import { useDetectMobileOrDesktop } from "../../../hooks/useDetectMobileOrDesktop";

export const ProjectsList = () => {
  const { isMobile, isTablet } = useDetectMobileOrDesktop();
  const { NoData } = plLibComponents.components;
  const [tenantId] = useOutletContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { state } = useLocation();
  const [form] = Form.useForm();
  const [selectedItems, setSelectedItems] = useState([]);
  const [breadcrumbList, setBreadcrumbList] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState("Grid");
  const [deleteModal, setDeleteModal] = useState(false);
  const [eachProject, setEachProject] = useState({});
  const [projectsList, setProjectsList] = useState({});
  const [notify, setNotify] = useState("");
  const [message, setMessage] = useState("");
  const [addProject, setAddProject] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [removedItems, setRemovedItems] = useState([]);
  useEffect(() => {
    setSelectedItems([]);
  }, []);
  useEffect(() => {
    if (search?.length >= 3) {
      new GetService().getAccountOwners(search, (result) => {
        if (result?.status === 200) {
          const data = [
            ...(result?.data?.data?.db_users || []),
            ...(result?.data?.data?.gsuit_users || []),
          ];
          const filteredData = data.filter(
            (item, index, self) =>
              index === self.findIndex((obj) => obj.email === item.email)
          );
          setDropdownOptions(filteredData);
        } else {
          setDropdownOptions([]);
        }
      });
    } else {
      setDropdownOptions([]);
    }
  }, [search]);
  const projectsApi = () => {
    new GetService().getAccountsList(tenantId, (result) => {
      if (result?.status === 200) {
        setIsLoading(false);
        const filteredAccount =
          result?.data?.data?.tenant?.tenant_accounts.filter(
            (account) => account?.ID === state?.accountId
          );
        setProjectsList(...filteredAccount);
      }
    });
  };
  useEffect(() => {
    setIsLoading(true);
    if (tenantId) {
      projectsApi();
    }
  }, [tenantId, addProject]);
  const onClose = () => {
    setAddProject("");
    form.resetFields();
    setSelectedItems([]);
  };
  const handleFinish = (values) => {
    const pointOfContactSelectedEmails = values?.pointOfContact?.map((name) => {
      const parts = name.split("-");
      return parts[0];
    });
    const pmoSelectedEmails = values?.pmo?.map((name) => {
      const parts = name.split("-");
      return parts[0];
    });
    const leadSelectedEmails = values?.lead?.map((name) => {
      const parts = name.split("-");
      return parts[0];
    });
    const scrumTeamSelectedEmails = values?.scrumTeam?.map((name) => {
      const parts = name.split("-");
      return parts[0];
    });
    const formattedDate = moment(values?.startDate).format(
      "YYYY-MM-DDTHH:mm:ss.SSSZ"
    );
    const payload = {
      Project_name: values?.projectName,
      Start_Date: formattedDate,
      team_member: [
        ...formatTreeData(
          pointOfContactSelectedEmails,
          selectedItems,
          "client"
        ),
        ...formatTreeData(pmoSelectedEmails, selectedItems, "manager"),
        ...formatTreeData(leadSelectedEmails, selectedItems, "lead"),
        ...formatTreeData(scrumTeamSelectedEmails, selectedItems, "member"),
      ],
      removed_user: removedItems,
    };
    console.log(payload);
    new PutService().addUpdateProject(
      addProject === "add" ? 0 : eachProject?.ID,
      state?.accountId,
      payload,
      (result) => {
        if (result?.status === 200) {
          console.log(eachProject?.name);
          form.resetFields();
          setSelectedItems([]);
          setNotify("success");
          addProject === "add"
            ? setMessage(
                i18n.t("addProjects.addSuccess", {
                  prjName: values?.projectName,
                })
              )
            : setMessage(
                i18n.t("addProjects.updateSuccess", {
                  prjName: eachProject?.name,
                })
              );
          setAddProject("");
          setTimeout(() => {
            setNotify("");
            setTimeout("");
          }, 1000);
        }
      }
    );
  };
  const formatTreeData = (selectedValues, treeData, role) =>
    Array.isArray(selectedValues)
      ? selectedValues
          .map((value) => {
            const node = treeData?.find(
              (node) => node?.name === value || node?.email === value
            );
            return node
              ? { email: node?.email, name: node?.name, role: role }
              : null;
          })
          .filter(Boolean)
      : [];
  const handleonCancel = () => {
    setDeleteModal(false);
    setEachProject({});
    setAddProject("");
  };
  const handleonOk = (project) => {
    const payload = {
      Project_name: project?.name,
      active: false,
    };
    new PutService().updateProject(
      project?.ID,
      projectsList?.ID,
      payload,
      (result) => {
        if (result?.status === 200) {
          projectsApi();
          setNotify("success");
          setMessage(
            i18n.t("addProjects.deletedMessage", {
              prjName: project?.name,
            })
          );
          setDeleteModal(false);
          setEachProject({});
          setSelectedItems([]);
          setTimeout(() => {
            setNotify("");
            setMessage("");
          }, 2000);
        }
      }
    );
  };
  const handleOnClickMore = (option, project) => {
    setEachProject(project);
    if (option === "Delete") {
      setDeleteModal(true);
    } else {
      setAddProject("edit");
    }
  };
  const handleView = (project) => {
    navigate(
      `/accounts/${state?.accountId}/projects/${project?.ID}/formatlist`,
      {
        state: {
          accOwner: state?.accOwner,
          prjCreatedDate: project?.CreatedAt,
          prjLogo: project?.logo,
          prjId: project?.ID,
          accountName: projectsList?.name,
          accountId: projectsList.ID,
          projectsList: projectsList?.account_projects,
          projectName: project?.name,
          status: true,
          tenantId: tenantId,
        },
      }
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
  let deliveryHeadName = [];
  projectsList?.account_owner?.map((each) => deliveryHeadName.push(each.name));
  const columns = [
    {
      title: i18n.t("addProjects.project"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: i18n.t("addProjects.projectOwner"),
      dataIndex: "projectOwner",
      key: "projectOwner",
      render: () => (
        <p className="client-name" title={deliveryHeadName}>
          {projectsList?.account_owner?.length > 0 &&
            (projectsList?.account_owner?.length === 1
              ? projectsList?.account_owner[0]?.name
              : `${projectsList?.account_owner[0]?.name}`)}
          {projectsList?.account_owner?.length > 1 && (
            <Avatar className="delivery-head-length">
              +{projectsList?.account_owner?.length - 1}
            </Avatar>
          )}
        </p>
      ),
    },
    {
      title: i18n.t("addProjects.members"),
      dataIndex: "members",
      key: "members",
    },
    {
      title: i18n.t("addProjects.actions"),
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
      title: i18n.t("addProjects.view"),
      dataIndex: "view",
      key: "view",
      render: (text, record) => (
        <EyeOutlined className="view" onClick={() => handleView(record)} />
      ),
    },
  ];
  const data = [];
  projectsList?.account_projects?.map((project, index) => {
    const teamMembers = project?.Users?.filter(
      (user) => user?.role === "member"
    );
    data.push({
      key: index + 1,
      name: project?.name,
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
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            removedItems={removedItems}
            setRemovedItems={setRemovedItems}
          />
        </div>
      </div>
      {isLoading ? (
        isMobile ? (
          <ShimmerSimpleGallery col={1} card imageHeight={150} />
        ) : isTablet ? (
          <ShimmerSimpleGallery col={2} card imageHeight={150} />
        ) : (
          <ShimmerSimpleGallery card imageHeight={150} />
        )
      ) : selectedSegment === "Grid" ? (
        <Row gutter={[20, 20]} className="project-list-wrapper">
          {projectsList?.account_projects?.length > 0 ? (
            projectsList?.account_projects?.map((project) => {
              const teamMembers = project?.Users?.filter(
                (user) => user?.role === "member"
              );
              return (
                <Col xs={24} md={12} lg={8} xxl={6} key={project.ID}>
                  <Card className="project-wrapper">
                    <div className="project-client-context-day-container">
                      <div className="avatar-project-client-context-container">
                        <p className="avatar">
                          {`${project?.name
                            .split(" ")
                            .map((word) => word.charAt(0).toUpperCase())
                            .join("")}`}
                        </p>
                        <div className="project-client-container">
                          <h4 className="project-name" title={project?.name}>
                            {project?.name}
                          </h4>
                          <p className="client-name" title={deliveryHeadName}>
                            {projectsList?.account_owner?.length > 0 &&
                              (projectsList?.account_owner?.length === 1
                                ? projectsList?.account_owner[0]?.name
                                : `${projectsList?.account_owner[0]?.name}`)}
                            {projectsList?.account_owner?.length > 1 && (
                              <Avatar className="delivery-head-length">
                                +{projectsList?.account_owner?.length - 1}
                              </Avatar>
                            )}
                          </p>
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
                        arrow={false}
                        placement="bottomRight"
                        overlayStyle={{ padding: 0 }}
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
                        {i18n.t("addProjects.view")}
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
