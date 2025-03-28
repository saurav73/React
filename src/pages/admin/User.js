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
  Switch,
  Popconfirm,
  message,
} from "antd"
import {
  SearchOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons"
import axios from "axios"

const { Title, Text } = Typography
const { Option } = Select

const Users = () => {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [searchText, setSearchText] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:4000/users")

      // Fetch poems to get poem counts for each user
      const poemsResponse = await axios.get("http://localhost:4000/poems")
      const poems = poemsResponse.data

      // Enhance user data with additional information
      const enhancedUsers = response.data.map((user) => {
        // Count poems by this user
        const userPoems = poems.filter(
          (poem) => poem.user_id === user.id || poem.author?.toLowerCase() === user.username?.toLowerCase(),
        )

        return {
          ...user,
          poemCount: userPoems.length,
          status: "active", // Assuming all users are active by default
          role: user.id === "09b5" ? "admin" : "user", // Just an example, adjust as needed
          avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? "men" : "women"}/${Math.floor(Math.random() * 50)}.jpg`,
          lastLogin: "Recently",
        }
      })

      setUsers(enhancedUsers)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching users:", error)
      message.error("Failed to fetch users")
      setLoading(false)
    }
  }

  const showModal = (user = null) => {
    if (user) {
      setIsEditMode(true)
      setCurrentUser(user)
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        role: user.role || "user",
        status: user.status || "active",
      })
    } else {
      setIsEditMode(false)
      setCurrentUser(null)
      form.resetFields()
    }
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  const handleSubmit = async (values) => {
    try {
      if (isEditMode && currentUser) {
        // Update existing user
        await axios.patch(`http://localhost:4000/users/${currentUser.id}`, values)
        message.success("User updated successfully")

        // Update local state
        const updatedUsers = users.map((user) => (user.id === currentUser.id ? { ...user, ...values } : user))
        setUsers(updatedUsers)
      } else {
        // Add new user
        const newUser = {
          ...values,
          agreement: true, // Required field in your schema
        }

        const response = await axios.post("http://localhost:4000/users", newUser)
        message.success("User added successfully")

        // Add to local state with enhanced fields
        const enhancedNewUser = {
          ...response.data,
          poemCount: 0,
          status: "active",
          role: values.role || "user",
          avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? "men" : "women"}/${Math.floor(Math.random() * 50)}.jpg`,
          lastLogin: "Just now",
        }

        setUsers([...users, enhancedNewUser])
      }

      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error("Error saving user:", error)
      message.error("Failed to save user")
    }
  }

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:4000/users/${userId}`)
      setUsers(users.filter((user) => user.id !== userId))
      message.success("User deleted successfully")
    } catch (error) {
      console.error("Error deleting user:", error)
      message.error("Failed to delete user")
    }
  }

  const handleStatusChange = (checked, userId) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, status: checked ? "active" : "inactive" } : user,
    )
    setUsers(updatedUsers)
    message.success(`User ${checked ? "activated" : "deactivated"} successfully`)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchText.toLowerCase()),
  )

  const columns = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar src={record.avatar} size={40} />
          <div style={{ marginLeft: 12 }}>
            <div style={{ fontWeight: "bold" }}>{record.username}</div>
            <div style={{ color: "#8c8c8c", fontSize: "12px" }}>ID: {record.id}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <div>
          <MailOutlined /> {email}
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        let color = "blue"
        if (role === "admin") {
          color = "red"
        } else if (role === "editor") {
          color = "green"
        }
        return <Tag color={color}>{role?.toUpperCase() || "USER"}</Tag>
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Switch
          checked={status === "active"}
          onChange={(checked) => handleStatusChange(checked, record.id)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: "Poems",
      dataIndex: "poemCount",
      key: "poemCount",
      render: (count) => <Tag color="purple">{count}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit User">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              size="small"
              onClick={() => showModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            description="This action cannot be undone."
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete User">
              <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="users-container">
      <Title level={2}>User Management</Title>
      <Text type="secondary">Manage all users of the platform.</Text>

      <Divider />

      <Card>
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
          <Input
            placeholder="Search users..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<UserAddOutlined />} onClick={() => showModal()}>
            Add User
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={isEditMode ? "Edit User" : "Add New User"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="username" label="Username" rules={[{ required: true, message: "Please enter username" }]}>
            <Input prefix={<UserOutlined />} placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Enter email" />
          </Form.Item>

          {!isEditMode && (
            <>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please enter password" }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Enter password" />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error("The two passwords do not match"))
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Confirm password" />
              </Form.Item>
            </>
          )}

          <Form.Item name="role" label="Role" rules={[{ required: true, message: "Please select a role" }]}>
            <Select placeholder="Select a role">
              <Option value="admin">Admin</Option>
              <Option value="editor">Editor</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select a status" }]}>
            <Select placeholder="Select a status">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
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
    </div>
  )
}

export default Users

