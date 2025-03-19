import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from 'axios';
import { Card, Descriptions, Tag } from 'antd';

const UserDetails = (props) => {
  let params = useParams();
  const [users, setUser] = useState({
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
    
    <Card title="users Details" bordered={false} style={{ width: 800, margin: '0 auto' }}>
      <Descriptions bordered layout="horizontal">
        <Descriptions.Item label="First Name" span={3}>{users.firstName}</Descriptions.Item>
        <Descriptions.Item label="Last Name" span={3}>{users.lastName}</Descriptions.Item>
        <Descriptions.Item label="Age" span={3}>{users.age}</Descriptions.Item>
        <Descriptions.Item label="Address" span={3}>{users.address}</Descriptions.Item>

        <Descriptions.Item label="Role" span={3}>{users.role}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
}

export default UserDetails;