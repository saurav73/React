"use client"

import { useContext, useState } from "react"
import {
  Layout,
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Divider,
  message,
  ConfigProvider,
  theme as antTheme,
} from "antd"
import {
  LockOutlined,
  MailOutlined,
  BookOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons"
import { Link, useNavigate, useParams } from "react-router-dom"

import { checkLogin } from '../../utils/user.util';
import { showErrorToast, showSuccessToast } from '../../utils/toastify.util';
import { UserContext } from "../../context/user.context"



const { Header, Content, Footer } = Layout
const { Title, Text, Paragraph } = Typography

const SignIn = () => {

  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches,
  )
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)


  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const { _setUser } = useContext(UserContext);
  const onFinish = (values) => {
    console.log('Success:', values);
    checkLogin(values.email, values.password).then((data) => {
      if (data === null) {
        console.log('Incorrect username or password');
        console.log('data:', data);
        showErrorToast('Incorrect username or password');
      } else {
        showSuccessToast('Login successful');
        _setUser(data);
        localStorage.setItem('is_login', 1);
        localStorage.setItem('user', JSON.stringify(data));
        console.log('data:', JSON.stringify(data.id));
        navigate('/users/dashboard');
      }
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const { defaultAlgorithm, darkAlgorithm } = antTheme
  const customTheme = {
    token: { colorPrimary: "#722ed1", borderRadius: 12, fontFamily: "Inter, sans-serif", fontSize: 16 },
    components: {
      Layout: {
        bodyBg: isDarkMode ? "#1a1a1a" : "#fff",
        headerBg: isDarkMode ? "#2c2c2c" : "#fff",
        footerBg: isDarkMode ? "#2c2c2c" : "#fafafa",
      },
      Card: { colorBgContainer: isDarkMode ? "#2c2c2c" : "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
      Button: {
        colorText: "#fff",
        colorBgContainer: "#722ed1",
        ghostColor: "#fff",
        ghostBorderColor: "rgba(255,255,255,0.7)",
      },
    },
  }

  return (
    <ConfigProvider theme={{ algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm, ...customTheme }}>
      <Layout style={{ minHeight: "100vh" }}>
        <Header style={{ padding: "0 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <BookOutlined style={{ fontSize: "28px", color: "#722ed1" }} />
              <Title level={3} style={{ margin: 0, color: isDarkMode ? "#fff" : "#333" }}>
                Poem Sansar
              </Title>
            </Link>
            <Button
              type="text"
              icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleDarkMode}
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                background: isDarkMode ? "#f9d71c" : "#2c2c2c",
                color: isDarkMode ? "#2c2c2c" : "#fff",
              }}
            />
          </div>
        </Header>

        <Content style={{ padding: "50px 16px" }}>
          <div
            style={{
              maxWidth: "400px",
              margin: "0 auto",
              padding: "30px",
              borderRadius: "16px",
              background: isDarkMode ? "#2c2c2c" : "#fff",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              border: `1px solid ${isDarkMode ? "#3a3a3a" : "#eaeaea"}`,
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <Title level={2} style={{ color: isDarkMode ? "#fff" : "#333", fontFamily: "'Playfair Display', serif" }}>
                Welcome Back
              </Title>
              <Paragraph style={{ color: isDarkMode ? "#d9d9d9" : "#666" }}>
                Sign in to continue your poetic journey
              </Paragraph>
            </div>

            <Form
              name="signin_form"

              onFinish={onFinish}

              onFinishFailed={onFinishFailed}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: "#722ed1" }} />}
                  placeholder="Email"
                  style={{ borderRadius: "8px", height: "45px" }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "Please enter your password" }]}
                style={{ marginBottom: "12px" }}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#722ed1" }} />}
                  placeholder="Password"
                  style={{ borderRadius: "8px", height: "45px" }}
                />
              </Form.Item>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox style={{ color: isDarkMode ? "#d9d9d9" : "#666" }}>Remember me</Checkbox>
                </Form.Item>
                {/* <Link to="/forgot-password" style={{ color: "#722ed1" }}>
                  Forgot password?
                </Link> */}
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                 
                  style={{
                    height: "45px",
                    borderRadius: "8px",
                    background: "linear-gradient(90deg, #722ed1, #a855f7)",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(114, 46, 209, 0.3)",
                    fontWeight: "500",
                  }}
                >
                  Sign In
                </Button>
              </Form.Item>

              <Divider style={{ color: isDarkMode ? "#d9d9d9" : "#666" }}>-</Divider>

              
              <div style={{ textAlign: "center" }}>
                <Text style={{ color: isDarkMode ? "#d9d9d9" : "#666" }}>
                  Don't have an account?{" "}
                  <Link to="/signup" style={{ color: "#722ed1", fontWeight: "500" }}>
                    Sign Up
                  </Link>
                </Text>
              </div>
            </Form>
          </div>
        </Content>

        <Footer style={{ textAlign: "center", padding: "16px" }}>
          <Text style={{ color: isDarkMode ? "#d9d9d9" : "#666" }}>
            © {new Date().getFullYear()} Poem Sansar. All rights reserved.
          </Text>
        </Footer>
      </Layout>
    </ConfigProvider>
  )
}

export default SignIn

