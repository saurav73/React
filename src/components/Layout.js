import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  SettingOutlined,
  BookOutlined,
  AdminOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Typography } from "antd";
import { UserContext } from "../context/user.context";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const CustomLayout = () => {
  const { _user } = useContext(UserContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    const isLogin = localStorage.getItem("is_login");
    if (isLogin !== "1") {
      navigate("/");
    }
  }, []);
  
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',  // Makes the sidebar sticky
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="logo" style={{ padding: collapsed ? "16px 0" : "16px", textAlign: "center" }}>
          {collapsed ? (
            <BookOutlined style={{ fontSize: 24, color: "white" }} />
          ) : (
            <Title level={4} style={{ color: "white", margin: "16px 0" }}>
            <BookOutlined style={{ marginRight: 8 }} />
            </Title>
          )}
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <DashboardOutlined />,
              label: "Dashboard",
              onClick: () => navigate("/admin/dashboard"),
            },
            {
              key: "2",
              icon: <UserOutlined />,
              label: "Users",
              onClick: () => navigate("/admin/users"),
            },
            {
              key: "4",
              icon: <BookOutlined />,
              label: "Poems",
              onClick: () => navigate("/admin/setting"),
            },
            {
              key: "5",
              icon: <LogoutOutlined />,
              label: "Logout",
              onClick: () => {
                localStorage.setItem("is_login", "0");
                navigate("/");
              }
            },
          ]}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200, // Adjust content margin based on sidebar width
          transition: 'margin-left 0.2s', // Smooth transition when collapsing
        }}
      >
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default CustomLayout;