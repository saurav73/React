import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Space, Table, Button, Popconfirm, Card } from "antd";
import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { deleteUser, getUsers } from "../../utils/user.util";

const { Column, ColumnGroup } = Table;

const Users = (props) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const users = await getUsers();
      setData(users);
    };

    fetchData();
   
  }, []);

  const handleAddUser = () => {
    navigate("/admin/users/add");
  };

  const handleDelete = async(id) => {
    await deleteUser(id);
    navigate('/admin/dashboard');
  };

  return (
    <div>
      <div className="v-row dashboard-row">
        <div className="v-col dashboard-col dashboard-col-1">
          <Card
            style={{
              marginTop: 16,
            }}
            type="inner"
            title="Users"
            extra={
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={handleAddUser}
              >
                Add User
              </Button>
            }
          >
            <Table dataSource={data} rowKey="id">
              
                <Column
                  title="Full Name"
                  dataIndex="fullname"
                  key="fullname"
                  render={(_, item) => (
                    <NavLink to={`/admin/users/details/${item.id}`}>
                      {item.fullname}
                    </NavLink>
                  )}
                />
              <Column
                title="email"
                dataIndex="email"
                key="email"
              />
            
              <Column title="Age" dataIndex="age" key="age" />
              <Column title="Address" dataIndex="address" key="address" />
              <Column
                title="Action"
                key="action"
                render={(_, item) => (
                  <Space size="middle">
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => navigate(`/admin/users/edit/${item.id}`)}
                    >
                      Edit
                    </Button>
                    <Popconfirm
                      title="Are you sure you want to delete this user?"
                      onConfirm={() => handleDelete(item.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="link" danger icon={<DeleteOutlined />}>
                        Delete
                      </Button>
                    </Popconfirm>
                  </Space>
                )}
              />
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Users;
