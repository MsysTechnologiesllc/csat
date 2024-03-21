import React, { useEffect, useState } from "react";
import { Button, Form, Input, Table } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { GetService } from "../../../services/get";

export const AddProjectMembersAndStakeholders = ({
  setIsModalOpen,
  isModalOpen,
}) => {
  console.log(setIsModalOpen);
  const [form] = Form.useForm();
  const [disable, setDisable] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [data, setData] = useState([]);
  const [projectMembersData, setProjetcMembersData] = useState([]);
  useEffect(() => {
    new GetService().getTeamList(1, (result) => {
      if (result?.status === 200) {
        console.log(result?.data?.data);
        setData(result?.data?.data?.clients);
        setProjetcMembersData(result?.data?.data?.users);
      }
    });
  }, []);
  const cancel = (record) => {
    if (!record?.name && !record?.email) {
      const filteredData = data.filter((item) => item?.key !== record?.key);
      setData(filteredData);
    }
    setEditingKey("");
    setDisable(false);
  };
  const save = async (key) => {
    if (isModalOpen === "stakeholders") {
      try {
        const row = await form.validateFields();
        const newData = [...data];
        const index = newData.findIndex((item) => key === item.key);
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          setData(newData);
          setDisable(false);
          setEditingKey("");
        } else {
          newData.push(row);
          setData(newData);
          setEditingKey("");
        }
      } catch (errInfo) {
        console.log("Validate Failed:", errInfo);
      }
    } else {
      try {
        const row = await form.validateFields();
        const newData = [...projectMembersData];
        const index = newData.findIndex((item) => key === item.key);
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          setProjetcMembersData(newData);
          setDisable(false);
          setEditingKey("");
        } else {
          projectMembersData.push(row);
          setProjetcMembersData(newData);
          setEditingKey("");
        }
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
  const EditableCell = ({
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
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isUserEditing(record),
      }),
    };
  });
  const modifiedData = data?.map((item) => ({
    ...item,
    key: item.ID,
  }));
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
  // const EditableCell = ({
  //   editing,
  //   dataIndex,
  //   title,
  //   children,
  //   ...restProps
  // }) => {
  //   return (
  //     <td {...restProps}>
  //       {editing ? (
  //         <Form.Item
  //           name={dataIndex}
  //           style={{
  //             margin: 0,
  //           }}
  //           rules={[
  //             {
  //               required: true,
  //               message: `Please Input ${title}!`,
  //             },
  //           ]}
  //         >
  //           <Input />
  //         </Form.Item>
  //       ) : (
  //         children
  //       )}
  //     </td>
  //   );
  // };

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
            <CheckOutlined onClick={() => save(record.key)} />
            <CloseOutlined onClick={() => cancel(record)} />
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
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
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
      setEditingKey(newData.key);
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

  return (
    <>
      <Button onClick={handleAdd} type="primary" disabled={disable}>
        Add stakeholder
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={
            isModalOpen === "stakeholders"
              ? modifiedData
              : modifiedProjectMembersData
          }
          columns={
            isModalOpen === "stakeholders"
              ? mergedColumns
              : mergedProjectMembersColumns
          }
          rowClassName="editable-row"
          pagination={false}
        />
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
  setIsModalOpen: PropTypes.string.isRequired,
};
