import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router"; 
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex } from 'antd';
import login from "../../assets/image/login.gif";


const Login = () => {
  const [users, setUser] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleusernameChange = (e) => {
    setUser({ ...users, username: e.target.value });
  }
  const handlePasswordChange = (e) => {
    setUser({ ...users, password: e.target.value });
  }
  // const handleButtonClick = () => {
  //   console.log(users);
  //   console.log(users.username , users.password);
  //   console.log("button clicked")
  //   if(users.username ==="admin" && users.password === "admin"){
  //      localStorage.setItem("is_login", "1");
  //     navigate("/admin/dashboard");
  //    alert("Login success");
  //   }
  //   else{
  //     localStorage.setItem("is_login", "0");
  //     setError("Invalid Username or Password");
  //     }
  //   }

const onFinish = (values) => {
    console.log('Received values of form: ', values.username);
    if(values.username ==="admin" && values.password === "admin"){
      localStorage.setItem("is_login", "1");
     navigate("/admin/dashboard");
    alert("Login success");
   }
   else{
     localStorage.setItem("is_login", "0");
     setError("Invalid Username or Password");
     }
  };

  return (
    <div className="login-container">
        <img src={login} alt="Logo" />
        <h1>Login</h1>
        {/* <form>
          <label style={{display: "block", marginBottom: "10px" , color: "red"}}>{error}</label>
            <label>username</label>
            <input type="username" placeholder="Enter your username" value={users.username} onChange={handleusernameChange}/>
            <label>Password</label>
            <input type="password" placeholder="Enter your password" value={users.password} onChange={handlePasswordChange} />
            <button type="button" onClick={handleButtonClick}>Submit</button>
        </form> */}
        <Form
      name="login" 
      initialValues={{
        remember: true,
      }}
      style={{
        maxWidth: 360,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Flex justify="space-between" align="center">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <a href="">Forgot password</a>
        </Flex>
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit" >
          Log in
        </Button>
        or <a href="">Register now!</a>
      </Form.Item>
    </Form>
    </div>
  )
}

export default Login;
