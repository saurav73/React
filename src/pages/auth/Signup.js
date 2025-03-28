"use client"

import { useState } from "react"
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
  UserOutlined,
  LockOutlined,
  MailOutlined,
  BookOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons"
import { Link, useNavigate, useParams } from "react-router-dom"
import { showSuccessToast } from "../../utils/toastify.util"
import { createUser } from "../../utils/user.util"

const { Header, Content, Footer } = Layout
const { Title, Text, Paragraph } = Typography

const SignUp = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches,
  )
  const navigate = useNavigate()
    let params = useParams();
    

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)
    const onFinish = async (values) => {
      console.log('Received values of form: ', values);
      if(!params.userId) {
        await createUser(values);
      } 
      showSuccessToast('Account Create Successful');
      navigate('/signin');
    };

  // const onFinish = (values) => {
  //   setLoading(true)
  //   // Simulate API call
  //   setTimeout(() => {
  //     setLoading(false)
  //     message.success("Account created successfully!")
  //     navigate("/dashboard")
  //   }, 1500)
  // }

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
                Join Poem Sansar
              </Title>
              <Paragraph style={{ color: isDarkMode ? "#d9d9d9" : "#666" }}>
                Create an account to start your poetic journey
              </Paragraph>
            </div>

            <Form name="signup_form" onFinish={onFinish} layout="vertical" size="large">
              <Form.Item name="username" rules={[{ required: true, message: "Please enter your username" }]}>
                <Input
                  prefix={<UserOutlined style={{ color: "#722ed1" }} />}
                  placeholder="Username"
                  style={{ borderRadius: "8px", height: "45px" }}
                />
              </Form.Item>

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
                rules={[
                  { required: true, message: "Please enter your password" },
                  { min: 8, message: "Password must be at least 8 characters" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#722ed1" }} />}
                  placeholder="Password"
                  style={{ borderRadius: "8px", height: "45px" }}
                />
              </Form.Item>

              <Form.Item
                name="confirm"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error("The two passwords do not match"))
                    },
                  }),
                ]}
                style={{ marginBottom: "16px" }}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#722ed1" }} />}
                  placeholder="Confirm Password"
                  style={{ borderRadius: "8px", height: "45px" }}
                />
              </Form.Item>

              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error("Please accept the terms and conditions")),
                  },
                ]}
                style={{ marginBottom: "24px" }}
              >
                <Checkbox style={{ color: isDarkMode ? "#d9d9d9" : "#666" }}>
                  I agree to the{" "}
                  <Link to="/terms" style={{ color: "#722ed1" }}>
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" style={{ color: "#722ed1" }}>
                    Privacy Policy
                  </Link>
                </Checkbox>
              </Form.Item>

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
                  Sign Up
                </Button>
              </Form.Item>

              <Divider style={{ color: isDarkMode ? "#d9d9d9" : "#666" }}>--</Divider>

              
              <div style={{ textAlign: "center" }}>
                <Text style={{ color: isDarkMode ? "#d9d9d9" : "#666" }}>
                  Already have an account?{" "}
                  <Link to="/signin" style={{ color: "#722ed1", fontWeight: "500" }}>
                    Sign In
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

export default SignUp

