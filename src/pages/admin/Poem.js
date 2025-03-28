"use client"

import { useState, useEffect } from "react"
import {
  Table,
  Card,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  Form,
  Select,
  Typography,
  Divider,
  Avatar,
  Tooltip,
  Popconfirm,
  message,
  Tabs,
  Switch,
} from "antd"
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons"
import { getPoems, createPoem, updatePoem, deletePoem } from "../../utils/poem.util"
import axios from "axios"

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { TextArea } = Input
const { TabPane } = Tabs

const Poems = () => {
  const [loading, setLoading] = useState(true)
  const [poems, setPoems] = useState([])
  const [users, setUsers] = useState([])
  const [searchText, setSearchText] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isViewModalVisible, setIsViewModalVisible] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentPoem, setCurrentPoem] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [form] = Form.useForm()
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // Get current user from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setCurrentUser(parsedUser)
      } catch (e) {
        console.error("Error parsing user from localStorage:", e)
      }
    }

    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch poems
      const poemsData = await getPoems()

      // Fetch users for the dropdown
      const usersResponse = await axios.get("http://localhost:4000/users")
      setUsers(usersResponse.data)

      // Enhance poems with status and featured flags (mock data since they're not in your schema)
      const enhancedPoems = poemsData.map((poem) => ({
        ...poem,
        status: "published", // Assuming all poems are published by default
        featured: poem.likes > 200, // Just an example condition
      }))

      setPoems(enhancedPoems)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      message.error("Failed to fetch data")
      setLoading(false)
    }
  }

  const showModal = (poem = null) => {
    if (poem) {
      setIsEditMode(true)
      setCurrentPoem(poem)
      form.setFieldsValue({
        title: poem.title,
        content: poem.content,
        category: poem.category,
        tags: Array.isArray(poem.tags) ? poem.tags : [poem.tags],
        status: poem.status || "published",
        featured: poem.featured || false,
      })
    } else {
      setIsEditMode(false)
      setCurrentPoem(null)
      form.resetFields()
    }
    setIsModalVisible(true)
  }

  const showViewModal = (poem) => {
    setCurrentPoem(poem)
    setIsViewModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  const handleViewCancel = () => {
    setIsViewModalVisible(false)
  }

  const handleSubmit = async (values) => {
    try {
      if (isEditMode && currentPoem) {
        // Update existing poem
        const updatedPoem = await updatePoem(currentPoem.id, {
          ...currentPoem,
          ...values,
        })

        // Update local state
        setPoems(poems.map((poem) => (poem.id === currentPoem.id ? updatedPoem : poem)))

        message.success("Poem updated successfully")
      } else {
        // Add new poem
        const newPoem = {
          ...values,
          user_id: currentUser?.id || "",
          author: currentUser?.username || "Admin",
          authorUsername: currentUser?.username || "admin",
          authorAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
          timestamp: "Just now",
          likes: 0,
        }

        const createdPoem = await createPoem(newPoem)

        // Add to local state with enhanced fields
        const enhancedNewPoem = {
          ...createdPoem,
          status: "published",
          featured: false,
        }

        setPoems([enhancedNewPoem, ...poems])
        message.success("Poem added successfully")
      }

      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error("Error saving poem:", error)
      message.error("Failed to save poem")
    }
  }

  const handleDelete = async (poemId) => {
    try {
      await deletePoem(poemId)
      setPoems(poems.filter((poem) => poem.id !== poemId))
      message.success("Poem deleted successfully")
    } catch (error) {
      console.error("Error deleting poem:", error)
      message.error("Failed to delete poem")
    }
  }

  const handleFeaturedChange = (checked, poemId) => {
    const updatedPoems = poems.map((poem) => (poem.id === poemId ? { ...poem, featured: checked } : poem))
    setPoems(updatedPoems)
    message.success(`Poem ${checked ? "featured" : "unfeatured"} successfully`)
  }

  const handleStatusChange = (status, poemId) => {
    const updatedPoems = poems.map((poem) => (poem.id === poemId ? { ...poem, status } : poem))
    setPoems(updatedPoems)
    message.success(`Poem status changed to ${status}`)
  }

  const filteredPoems = poems.filter((poem) => {
    const matchesSearch =
      poem.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      poem.author?.toLowerCase().includes(searchText.toLowerCase()) ||
      poem.content?.toLowerCase().includes(searchText.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "published") return matchesSearch && poem.status === "published"
    if (activeTab === "drafts") return matchesSearch && poem.status === "draft"
    if (activeTab === "featured") return matchesSearch && poem.featured

    return matchesSearch
  })

  const columns = [
    {
      title: "Title & Author",
      key: "titleAuthor",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: "bold", fontSize: "16px" }}>{record.title}</div>
          <div style={{ display: "flex", alignItems: "center", marginTop: "4px" }}>
            <Avatar src={record.authorAvatar} size="small" />
            <Text style={{ marginLeft: "8px", color: "#8c8c8c" }}>{record.author}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => {
        let color = "green"
        if (category === "Love") {
          color = "pink"
        } else if (category === "Inspirational") {
          color = "blue"
        } else if (category === "Classic") {
          color = "purple"
        }
        return <Tag color={color}>{category}</Tag>
      },
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => (
        <>
          {Array.isArray(tags) ? (
            tags.map((tag) => (
              <Tag key={tag} color="default" style={{ marginBottom: "4px" }}>
                {tag}
              </Tag>
            ))
          ) : (
            <Tag color="default">{tags}</Tag>
          )}
        </>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Tag color={record.status === "published" ? "success" : "default"}>
            {record.status === "published" ? (
              <>
                <CheckCircleOutlined /> Published
              </>
            ) : (
              <>
                <CloseCircleOutlined /> Draft
              </>
            )}
          </Tag>
          {record.featured && (
            <Tag color="gold" style={{ marginTop: "4px" }}>
              Featured
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Date",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) => (
        <div>
          <CalendarOutlined /> {timestamp}
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Poem">
            <Button
              type="primary"
              shape="circle"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => showViewModal(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Poem">
            <Button shape="circle" icon={<EditOutlined />} size="small" onClick={() => showModal(record)} />
          </Tooltip>
          <Tooltip title="Toggle Featured">
            <Switch
              size="small"
              checked={record.featured}
              onChange={(checked) => handleFeaturedChange(checked, record.id)}
              checkedChildren="Featured"
              unCheckedChildren="Regular"
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this poem?"
            description="This action cannot be undone."
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Poem">
              <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="poems-container">
      <Title level={2}>Poem Management</Title>
      <Text type="secondary">Manage all poems on the platform.</Text>

      <Divider />

      <Card>
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
          <Input
            placeholder="Search poems..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
            Add Poem
          </Button>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
          <TabPane tab={<span>All Poems</span>} key="all" />
          <TabPane tab={<span>Published</span>} key="published" />
          <TabPane tab={<span>Drafts</span>} key="drafts" />
          <TabPane tab={<span>Featured</span>} key="featured" />
        </Tabs>

        <Table
          columns={columns}
          dataSource={filteredPoems}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={isEditMode ? "Edit Poem" : "Add New Poem"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please enter poem title" }]}>
            <Input placeholder="Enter poem title" />
          </Form.Item>

          <Form.Item name="content" label="Content" rules={[{ required: true, message: "Please enter poem content" }]}>
            <TextArea placeholder="Enter poem content" rows={10} style={{ fontFamily: "Georgia, serif" }} />
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please select a category" }]}>
            <Select placeholder="Select a category">
              <Option value="Nature">Nature</Option>
              <Option value="Love">Love</Option>
              <Option value="Inspirational">Inspirational</Option>
              <Option value="Classic">Classic</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="tags" label="Tags" rules={[{ required: true, message: "Please add at least one tag" }]}>
            <Select mode="tags" placeholder="Add tags">
              <Option value="Nature">Nature</Option>
              <Option value="Love">Love</Option>
              <Option value="Life">Life</Option>
              <Option value="Dreams">Dreams</Option>
              <Option value="Hope">Hope</Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select a status" }]}>
            <Select placeholder="Select a status">
              <Option value="published">Published</Option>
              <Option value="draft">Draft</Option>
            </Select>
          </Form.Item>

          <Form.Item name="featured" label="Featured" valuePropName="checked">
            <Switch checkedChildren="Featured" unCheckedChildren="Regular" />
          </Form.Item>

          <Form.Item>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button style={{ marginRight: 8 }} onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {isEditMode ? "Update" : "Add"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={currentPoem?.title}
        open={isViewModalVisible}
        onCancel={handleViewCancel}
        footer={[
          <Button key="back" onClick={handleViewCancel}>
            Close
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              handleViewCancel()
              showModal(currentPoem)
            }}
          >
            Edit
          </Button>,
        ]}
        width={700}
      >
        {currentPoem && (
          <div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
              <Avatar src={currentPoem.authorAvatar} size={40} />
              <div style={{ marginLeft: "12px" }}>
                <Text strong>{currentPoem.author}</Text>
                <div>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    <CalendarOutlined /> {currentPoem.timestamp}
                  </Text>
                </div>
              </div>
            </div>

            <Paragraph
              style={{
                whiteSpace: "pre-line",
                fontFamily: "Georgia, serif",
                fontSize: "16px",
                lineHeight: "1.8",
                marginBottom: "24px",
              }}
            >
              {currentPoem.content}
            </Paragraph>

            <Divider />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <Tag
                  color={
                    currentPoem.category === "Love"
                      ? "pink"
                      : currentPoem.category === "Inspirational"
                        ? "blue"
                        : currentPoem.category === "Classic"
                          ? "purple"
                          : "green"
                  }
                >
                  {currentPoem.category}
                </Tag>
                {Array.isArray(currentPoem.tags) ? (
                  currentPoem.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)
                ) : (
                  <Tag>{currentPoem.tags}</Tag>
                )}
              </div>

              <div></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Poems

