import { Card, Typography, Tag, Divider, Button, Space, Dropdown, Menu, Avatar } from "antd"
import { HeartOutlined, HeartFilled, CommentOutlined, ShareAltOutlined, MoreOutlined } from "@ant-design/icons"

const { Title, Text, Paragraph } = Typography

const PoemCard = ({ poem, isDarkMode, likedPoems, toggleLike }) => {
  return (
    <Card style={{ borderRadius: "12px", marginBottom: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
        <Avatar src={poem.authorAvatar} size={40} />
        <div style={{ marginLeft: "12px" }}>
          <Text strong style={{ color: isDarkMode ? "#fff" : "#333", display: "block" }}>
            {poem.author}
          </Text>
          <Text style={{ color: isDarkMode ? "#d9d9d9" : "#666", fontSize: "12px" }}>
            {poem.authorUsername} · {poem.timestamp}
          </Text>
        </div>
        <Dropdown overlay={renderMenu()} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} style={{ marginLeft: "auto" }} />
        </Dropdown>
      </div>

      <Title level={4} style={{ color: isDarkMode ? "#fff" : "#333", marginBottom: "12px" }}>
        {poem.title}
      </Title>

      <Paragraph style={{ whiteSpace: "pre-line", color: isDarkMode ? "#d9d9d9" : "#666" }}>
        {poem.content}
      </Paragraph>

      <Space wrap style={{ marginBottom: "16px" }}>
        {poem.tags.map((tag) => (
          <Tag key={tag} style={{ borderRadius: "12px" }}>
            {tag}
          </Tag>
        ))}
      </Space>

      <Divider style={{ margin: "0 0 12px 0" }} />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          type="text"
          icon={likedPoems[poem.id] ? <HeartFilled style={{ color: "#f5222d" }} /> : <HeartOutlined />}
          onClick={() => toggleLike(poem.id)}
        >
          {likedPoems[poem.id] ? poem.likes + 1 : poem.likes}
        </Button>
        <Button type="text" icon={<CommentOutlined />}>
          {poem.comments}
        </Button>
        <Button type="text" icon={<ShareAltOutlined />}>
          Share
        </Button>
      </div>
    </Card>
  )
}

const renderMenu = () => (
  <Menu
    items={[
      { key: "1", label: "Edit", icon: <EditOutlined /> },
      { key: "2", label: "Delete", icon: <DeleteOutlined />, danger: true },
    ]}
  />
)

export default PoemCard