import React, { useEffect, useState } from "react";
import { Button, Form, Input, Table, Select, Pagination } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { GetService } from "../../../../services/get";
import { PutService } from "../../../../services/put";
import "./add-stakeholders-project-members.scss";
import i18n from "../../../../locales/i18next";

export const AddProjectMembersAndStakeholders = ({
  setIsModalOpen,
  isModalOpen,
  account_id,
  prj_id,
}) => {
  const [form] = Form.useForm();
  const [disable, setDisable] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [data, setData] = useState([]);
  const [modifiedData, setModifiedData] = useState([]);
  const [projectMembersData, setProjetcMembersData] = useState([]);
  const [called, setCalled] = useState(false);
  const [dropDownData, setDropDownData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProjectMembersData, setFilterProjectsMembersData] = useState(
    [],
  );
  const { Search } = Input;
  const { Option } = Select;
  const limit = 5;
  useEffect(() => {
    new GetService().getTeamList(prj_id, (result) => {
      if (result?.status === 200) {
        let roleOptions = [];
        setData(result?.data?.data?.clients);
        setProjetcMembersData(result?.data?.data?.users);
        result?.data?.data?.users?.map((role) => {
          roleOptions.push(role.role);
        });
        setRoleData([...new Set(roleOptions)]);
      }
    });
  }, [called]);
  const cancel = (record) => {
    if (!record?.name && !record?.email) {
      const filteredData = data.filter((item) => item?.ID !== record?.key);
      setData(filteredData);
    }
    setEditingKey("");
    setDisable(false);
  };
  const dropDown = (data) => {
    setDropDownData(data);
  };
  const handleSearch = (value) => {
    if (value.length >= 3) {
      new GetService().getAccountOwners(value, (result) => {
        if (result?.status === 200) {
          const data = [
            ...(result?.data?.data?.db_users || []),
            ...(result?.data?.data?.gsuit_users || []),
          ];
          console.log(data);
          const filteredData = data.filter((item) => {
            return (
              (item.name && item.name.toLowerCase().includes(value)) ||
              (item.email && item.email.toLowerCase().includes(value))
            );
          });
          dropDown(filteredData);
          // setDropDownData(filteredData);
        }
      });
    }
  };
  const save = async () => {
    if (isModalOpen === "stakeholders") {
      try {
        const row = await form.validateFields();
        const payload = {
          team_member: [{ name: row.name, email: row.email, role: "client" }],
        };
        console.log(payload, "payload");
        new PutService().addUpdateProject(
          prj_id,
          account_id,
          payload,
          (result) => {
            if (result?.status === 200) {
              setDisable(false);
              setEditingKey("");
              setCalled(true);
              setTimeout(() => {
                setCalled(false);
              }, 500);
            }
          },
        );
      } catch (errInfo) {
        console.log("Validate Failed:", errInfo);
      }
    } else {
      try {
        const row = await form.validateFields();
        const payload = {
          team_member: [{ name: row.name, email: row.email, role: row.role }],
        };
        console.log(payload, "payload");
        new PutService().addUpdateProject(
          prj_id,
          account_id,
          payload,
          (result) => {
            if (result?.status === 200) {
              setDisable(false);
              setEditingKey("");
              setCalled(true);
              setTimeout(() => {
                setCalled(false);
                setIsModalOpen("");
              }, 1000);
            }
          },
        );
      } catch (errInfo) {
        console.log("Validate Failed:", errInfo);
      }
    }
  };
  const modifiedProjectMembersData = projectMembersData?.map((item) => ({
    ...item,
    key: item.ID,
  }));
  const isUserEditing = (record) => record.key === editingKey;
  const editProjectMember = (record) => {
    form.setFieldsValue({
      name: "",
      email: "",
      role: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const deleteProjectMember = (record) => {
    console.log(record);
  };
  const handleChange = (value, options) => {
    console.log(options);
    form.setFieldsValue({
      email: options.value,
    });
  };
  const ProjectMemberEditableCell = ({
    editing,
    dataIndex,
    title,
    children,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {title === "Name" && (
              <Select
                showSearch
                suffixIcon=""
                onSearch={(value) => handleSearch(value)}
                onChange={handleChange}
                optionLabelProp="label"
              >
                {dropDownData?.map((option, index) => (
                  <Option key={index} value={option.email} label={option.name}>
                    <p>{option.name}</p>
                    <p>{option.email}</p>
                  </Option>
                ))}
              </Select>
            )}
            {title === "Email" && <Input />}
            {title === "Role" && (
              <Select
                showSearch
                suffixIcon=""
                onSearch={(value) => handleSearch(value)}
                optionLabelProp="label"
              >
                {roleData?.map((option) => (
                  <Option key={option} value={option} label={option}>
                    <p>{option}</p>
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    children,
    // record,
    ...restProps
  }) => {
    const validateEmail = (_, value) => {
      const allowedDomains = ["gmail.com", "msystechnologies.com"];
      const [, domain] = value.split("@"); // Extract domain part from email
      if (!value || allowedDomains.includes(domain)) {
        return Promise.resolve();
      }
      return Promise.reject("Please enter a valid email address");
    };
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
              {
                validator: title === "Email" && validateEmail,
              },
            ]}
            // key={title}
          >
            <Input />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  const projectMemberColumns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "30%",
      editable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "40%",
      editable: true,
    },
    {
      title: "Role",
      dataIndex: "role",
      width: "45%",
      editable: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => {
        const editable = isUserEditing(record);
        return editable ? (
          <span>
            <CheckOutlined onClick={() => save(record.key)} />
            <CloseOutlined onClick={() => cancel(record)} />
          </span>
        ) : (
          <div>
            <EditOutlined
              className="edit"
              disabled={editingKey !== ""}
              onClick={() => editProjectMember(record)}
            />
            <DeleteOutlined
              className="delete"
              onClick={() => deleteProjectMember(record)}
            />
          </div>
        );
      },
    },
  ];
  const mergedProjectMembersColumns = projectMemberColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isUserEditing(record),
      }),
    };
  });
  useEffect(() => {
    const modified = data?.map((item) => ({
      ...item,
      key: item.ID,
    }));
    setModifiedData(modified);
  }, [data]);

  const isEditing = (record) => record.key === editingKey;
  const editStakeholder = (record) => {
    form.setFieldsValue({
      name: "",
      email: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const deleteStakeholder = (record) => {
    console.log(record);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "35%",
      editable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "45%",
      editable: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <CheckOutlined className="save" onClick={() => save(record.key)} />
            <CloseOutlined className="cancel" onClick={() => cancel(record)} />
          </span>
        ) : (
          <div>
            <EditOutlined
              className="edit"
              disabled={editingKey !== ""}
              onClick={() => editStakeholder(record)}
            />
            <DeleteOutlined
              className="delete"
              onClick={() => deleteStakeholder(record)}
            />
          </div>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: col.editable ? isEditing(record) : false,
        save: save,
      }),
    };
  });
  const handleAdd = () => {
    if (isModalOpen === "stakeholders") {
      const newData = {
        key: modifiedData.length + 1,
        name: "",
        email: "",
      };
      setEditingKey(modifiedData.length + 1);
      setData([...data, newData]);
      setDisable(true);
    } else {
      const newUser = {
        key: modifiedProjectMembersData.length + 1,
        name: "",
        email: "",
        role: "",
      };
      setEditingKey(newUser.key);
      setProjetcMembersData([...projectMembersData, newUser]);
      setDisable(true);
    }
  };

  useEffect(() => {
    const pageNumber = (currentPage - 1) * limit;
    const filterArray = modifiedProjectMembersData?.slice(
      pageNumber,
      pageNumber + limit,
    );
    setFilterProjectsMembersData(filterArray);
  }, [modifiedProjectMembersData, currentPage]);

  return (
    <>
      <div className="add-projectmember-header">
        <h3>
          {isModalOpen === "stakeholders"
            ? i18n.t("projectMembers.stakeholderTitle", {
                count: modifiedData.length,
              })
            : i18n.t("projectMembers.projectTitle", {
                count: modifiedProjectMembersData.length,
              })}
        </h3>
        <div className="search-add-member-wrapper">
          <Search />
          <Button
            onClick={handleAdd}
            type="primary"
            disabled={disable}
            className="add-button"
          >
            {isModalOpen === "stakeholders"
              ? i18n.t("projectMembers.addStakeholder")
              : i18n.t("projectMembers.addNewMember")}
          </Button>
        </div>
      </div>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell:
                isModalOpen === "stakeholders"
                  ? EditableCell
                  : ProjectMemberEditableCell,
            },
          }}
          rowKey="key"
          bordered
          dataSource={
            isModalOpen === "stakeholders"
              ? modifiedData
              : filteredProjectMembersData
          }
          columns={
            isModalOpen === "stakeholders"
              ? mergedColumns
              : mergedProjectMembersColumns
          }
          rowClassName="editable-row"
          pagination={false}
        />
        {isModalOpen === "projectMembers" && (
          <Pagination
            current={currentPage}
            total={modifiedProjectMembersData?.length}
            pageSize={limit}
            onChange={(page) => setCurrentPage(page)}
            className="project-members-pagination"
            showSizeChanger={false}
          />
        )}
      </Form>
    </>
  );
};

AddProjectMembersAndStakeholders.propTypes = {
  editing: PropTypes.bool.isRequired,
  dataIndex: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isModalOpen: PropTypes.string.isRequired,
  record: PropTypes.object.isRequired,
  setIsModalOpen: PropTypes.string.isRequired,
  account_id: PropTypes.number.isRequired,
  prj_id: PropTypes.number.isRequired,
};
