import React from "react"
import { Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  SettingOutlined,

} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";

const { Header, Sider, Content } = Layout;




const CustomLayout = () => {

  const navigate = useNavigate();
  useEffect(() => {
    const isLogin = localStorage.getItem("is_login");
    if (isLogin!=="1") {
      navigate("/");
    }
  }, 
  []);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
  //   <>
  //   <Header />
  //   <div className="v-row container">
  //     <Sidebar />
  //     <div className="v-col content">
  //       <Outlet />
  //     </div>
  //   </div>
  //   <Footer />
  // </>
  
  <Layout>
    
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
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
              icon: <SettingOutlined />,
              label: "Setting",
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
      <Layout>
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
  )
}

export default CustomLayout;
