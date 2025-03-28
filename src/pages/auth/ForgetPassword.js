"use client"

import { useState } from "react"
import { Layout, Form, Input, Button, Typography, message, Result, ConfigProvider, theme as antTheme } from "antd"
import { MailOutlined, BookOutlined, MoonOutlined, SunOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import { Link, useNavigate } from "react-router-dom"

const { Header, Content, Footer } = Layout
const { Title, Text, Paragraph } = Typography

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches,
  )
  const navigate = useNavigate()

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  const onFinish = (values) => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setEmailSent(true)
      message.success("Password reset email sent!")
    }, 1500)
  }

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
            {!emailSent ? (
              <>
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <Title
                    level={2}
                    style={{ color: isDarkMode ? "#fff" : "#333", fontFamily: "'Playfair Display', serif" }}
                  >
                    Forgot Password
                  </Title>
                  <Paragraph style={{ color: isDarkMode ? "#d9d9d9" : "#666" }}>
                    Enter your email and we'll send you a link to reset your password
                  </Paragraph>
                </div>

                <Form name="forgot_password_form" onFinish={onFinish} layout="vertical" size="large">
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

                  <Form.Item style={{ marginBottom: "16px" }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      loading={loading}
                      style={{
                        height: "45px",
                        borderRadius: "8px",
                        background: "linear-gradient(90deg, #722ed1, #a855f7)",
                        border: "none",
                        boxShadow: "0 4px 15px rgba(114, 46, 209, 0.3)",
                        fontWeight: "500",
                      }}
                    >
                      Send Reset Link
                    </Button>
                  </Form.Item>

                  <div style={{ textAlign: "center" }}>
                    <Button
                      type="link"
                      icon={<ArrowLeftOutlined />}
                      onClick={() => navigate("/signin")}
                      style={{ color: "#722ed1" }}
                    >
                      Back to Sign In
                    </Button>
                  </div>
                </Form>
              </>
            ) : (
              <Result
                status="success"
                title="Email Sent!"
                subTitle="We've sent a password reset link to your email. Please check your inbox and follow the instructions."
                extra={[
                  <Button
                    type="primary"
                    key="signin"
                    onClick={() => navigate("/signin")}
                    style={{
                      background: "linear-gradient(90deg, #722ed1, #a855f7)",
                      border: "none",
                      boxShadow: "0 4px 15px rgba(114, 46, 209, 0.3)",
                    }}
                  >
                    Back to Sign In
                  </Button>,
                  <Button key="resend" onClick={() => setEmailSent(false)}>
                    Resend Email
                  </Button>,
                ]}
              />
            )}
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

export default ForgotPassword

