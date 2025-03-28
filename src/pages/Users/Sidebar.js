import { Menu, Button, Typography } from "antd"
import { BookOutlined, PlusOutlined } from "@ant-design/icons"

const { Title } = Typography

const Sidebar = ({ isDarkMode, collapsed, activeCategory, setActiveCategory, categories, showModal }) => {
  return (
    <>
      <div style={{ height: "64px", display: "flex", alignItems: "center", padding: collapsed ? "0" : "0 16px" }}>
        <BookOutlined style={{ fontSize: "24px", color: "#722ed1" }} />
        {!collapsed && (
          <Title level={4} style={{ margin: "0 0 0 12px", color: isDarkMode ? "#fff" : "#333" }}>
            Poem Sansar
          </Title>
        )}
      </div>

      <Menu
        theme={isDarkMode ? "dark" : "light"}
        mode="inline"
        selectedKeys={[activeCategory]}
        onClick={({ key }) => setActiveCategory(key)}
      >
        {categories.map((category) => (
          <Menu.Item key={category.id} icon={category.icon}>
            {category.name}
          </Menu.Item>
        ))}
      </Menu>

      <div style={{ padding: "16px", textAlign: "center", marginTop: "auto" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showModal}
          style={{
            width: collapsed ? "80%" : "100%",
            background: "linear-gradient(90deg, #722ed1, #a855f7)",
            border: "none",
          }}
        >
          {collapsed ? "" : "New Poem"}
        </Button>
      </div>
    </>
  )
}

export default Sidebar