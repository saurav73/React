import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from 'axios';
import { Card, Descriptions, Tag } from 'antd';

const UserDetails = (props) => {
  let params = useParams();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    age: '',
    address: '',
    tags: [],
    role: '',
  });

  useEffect(() => {
    axios.get(`http://localhost:4000/users/${params.userId}`)
      .then(function (response) {
        // handle success
        setUser(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, [params.userId]);

  return (
    <Card title="User Details" bordered={false} style={{ width: 800, margin: '0 auto' }}>
      <Descriptions bordered layout="horizontal">
        <Descriptions.Item label="First Name" span={3}>{user.firstName}</Descriptions.Item>
        <Descriptions.Item label="Last Name" span={3}>{user.lastName}</Descriptions.Item>
        <Descriptions.Item label="Age" span={3}>{user.age}</Descriptions.Item>
        <Descriptions.Item label="Address" span={3}>{user.address}</Descriptions.Item>
        <Descriptions.Item label="Tags" span={3}>
          {user.tags.map(tag => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </Descriptions.Item>
        <Descriptions.Item label="Role" span={3}>{user.role}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
}

export default UserDetails;