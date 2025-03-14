import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import { NavLink, useNavigate } from 'react-router';
import { Space, Table, Tag, Button } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';

const { Column, ColumnGroup } = Table;

const Users = (props) => {
  let param = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/users')
      .then(response => {
        setData(response.data);
        console.log(response);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  const handleAddUser = () => {
    navigate("/admin/users/add");
  };

  return (
    <div>
      <div className="v-row dashboard-row">
        <div className="v-col dashboard-col dashboard-col-1">
          <h2>Hello, Admin!</h2>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={handleAddUser}
          >
            Add User
          </Button>
          <Table dataSource={data} rowKey="id">
            <ColumnGroup title="Name">
              <Column title="First Name" dataIndex="firstName" key="firstName"
               render={(_, item) => <NavLink to={`/admin/users/details/${item.id}`}>{item.firstName}</NavLink>}/>
              <Column title="Last Name" dataIndex="lastName" key="lastName"
               render={(_, item) => <NavLink to={`/admin/users/details/${item.id}`}>{item.lastName}</NavLink>}/>

            </ColumnGroup>
            <Column title="Age" dataIndex="age" key="age" />
            <Column title="Address" dataIndex="address" key="address" />
            <Column
              title="Tags"
              dataIndex="tags"
              key="tags"
              render={(tags) => (
                <>
                  {tags.map((tag) => {
                    let color = tag.length > 5 ? 'geekblue' : 'green';
                    if (tag === 'loser') {
                      color = 'volcano';
                    }
                    return (
                      <Tag color={color} key={tag}>
                        {tag.toUpperCase()}
                      </Tag>
                    );
                  })}
                </>
              )}
            />
            <Column
              title="Action"
              key="action"
              render={(_, record) => (
                <Space size="middle">
                  <a>Invite {record.lastName}</a>
                  <a>Delete</a>
                </Space>
              )}
            />
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Users;
