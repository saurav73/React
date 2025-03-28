"use client"

import { useState, useEffect, useContext } from "react"
import {
  Layout,
  Menu,
  Button,
  Typography,
  Avatar,
  Input,
  Card,
  Dropdown,
  Space,
  Divider,
  Modal,
  Form,
  Select,
  message,
  ConfigProvider,
  theme as antTheme,
  Badge,
  Drawer,
  Checkbox,
  Spin,
} from "antd"
import {
  BookOutlined,
  UserOutlined,
  HeartOutlined,
  HeartFilled,
  PlusOutlined,
  LogoutOutlined,
  BellOutlined,
  SearchOutlined,
  HomeOutlined,
  FireOutlined,
  StarOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  MenuOutlined,
  CloseOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons"
import { Link, useNavigate } from "react-router-dom"
import { UserContext } from "../../context/user.context"
import {
  createPoem,
  deletePoem,
  getPoems,
  updatePoem,
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  likePoem,
  unlikePoem,
  getPoem,
} from "../../utils/poem.util"
import { showErrorToast, showSuccessToast } from "../../utils/toastify.util"
import { getUser } from "../../utils/user.util"

const { Header, Content, Sider, Footer } = Layout
const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select

const Dashboard = () => {
  const { _user, _setUser } = useContext(UserContext)
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches,
  )
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false)
  const [isEditNotificationModalVisible, setIsEditNotificationModalVisible] = useState(false)
  const [likedPoems, setLikedPoems] = useState({})
  const [poems, setPoems] = useState([])
  const [filteredPoems, setFilteredPoems] = useState([])
  const [notifications, setNotifications] = useState([])
  const [currentPoem, setCurrentPoem] = useState(null)
  const [currentNotification, setCurrentNotification] = useState(null)
  const [user, setUser] = useState(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [isLoadingPoems, setIsLoadingPoems] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [notificationForm] = Form.useForm()
  const [editNotificationForm] = Form.useForm()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const navigate = useNavigate()

  const categories = [
    { id: "all", name: "All Poems", icon: <BookOutlined /> },
    { id: "classic", name: "Classic", icon: <StarOutlined /> },
    { id: "inspirational", name: "Inspirational", icon: <FireOutlined /> },
    { id: "love", name: "Love", icon: <HeartOutlined /> },
    { id: "nature", name: "Nature", icon: <HomeOutlined /> },
  ]

  // Fetch user data on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      const userId = parsedUser.id || parsedUser
      getUser(userId)
        .then((data) => {
          const userData = {
            id: data.id,
            name: data.fullname || data.username || "User",
            username: data.username ? `@${data.username}` : `@user${data.id}`,
            avatar: data.avatar || "https://randomuser.me/api/portraits/men/1.jpg",
          }
          setUser(userData)
          _setUser(userData)
        })
        .catch((error) => {
          console.error("Error fetching user:", error)
          message.error("Failed to fetch user data")
          setUser({
            id: userId,
            name: "User",
            username: `@user${userId}`,
            avatar: "https://randomuser.me/api/portraits/men/1.jpg",
          })
        })
        .finally(() => setIsLoadingUser(false))
    } else {
      navigate("/")
      message.error("Please log in to continue")
    }
  }, [navigate, _setUser])

  // Fetch poems on mount
  useEffect(() => {
    setIsLoadingPoems(true)
    getPoems()
      .then((data) => {
        setPoems(data)
        setFilteredPoems(data)

        // Initialize liked poems from localStorage if available
        const storedLikes = localStorage.getItem("likedPoems")
        if (storedLikes) {
          setLikedPoems(JSON.parse(storedLikes))
        }
      })
      .catch((error) => {
        console.error("Error fetching poems:", error)
        message.error("Failed to fetch poems")
      })
      .finally(() => setIsLoadingPoems(false))
  }, [])

  // Filter poems when category or search query changes
  useEffect(() => {
    if (poems.length === 0) return

    let filtered = [...poems]

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter((poem) => poem.category?.toLowerCase() === activeCategory.toLowerCase())
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (poem) =>
          poem.title?.toLowerCase().includes(query) ||
          poem.content?.toLowerCase().includes(query) ||
          poem.author?.toLowerCase().includes(query) ||
          (Array.isArray(poem.tags) && poem.tags.some((tag) => tag.toLowerCase().includes(query))),
      )
    }

    setFilteredPoems(filtered)
  }, [activeCategory, searchQuery, poems])

  // Fetch notifications on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      const userId = parsedUser.id || parsedUser
      getNotifications(userId)
        .then((data) => setNotifications(data))
        .catch((error) => {
          console.error("Error fetching notifications:", error)
          showErrorToast("Failed to fetch notifications")
        })
    }
  }, [])

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (windowWidth >= 768) setMobileMenuVisible(false)
  }, [windowWidth])

  // Save liked poems to localStorage when they change
  useEffect(() => {
    localStorage.setItem("likedPoems", JSON.stringify(likedPoems))
  }, [likedPoems])

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  const toggleLike = async (poemId) => {
    try {
      const isLiked = likedPoems[poemId]

      if (isLiked) {
        // Unlike the poem
        await unlikePoem(poemId)
        setLikedPoems((prev) => ({ ...prev, [poemId]: false }))
      } else {
        // Like the poem
        await likePoem(poemId)
        setLikedPoems((prev) => ({ ...prev, [poemId]: true }))
      }

      // Update the poems state with the new like count
      const updatedPoem = await getPoem(poemId)
      setPoems((prevPoems) => prevPoems.map((poem) => (poem.id === poemId ? updatedPoem : poem)))

      message.success(isLiked ? "Removed like" : "Added like")
    } catch (error) {
      console.error("Error toggling like:", error)
      message.error("Failed to update like")
    }
  }

  const isMobile = windowWidth < 768

  const handleSearch = (value) => {
    setSearchQuery(value)
  }

  const showModal = () => setIsModalVisible(true)
  const showEditModal = (poem) => {
    setCurrentPoem(poem)
    editForm.setFieldsValue({
      title: poem.title,
      content: poem.content,
      category: poem.category,
      tags: poem.tags,
    })
    setIsEditModalVisible(true)
  }
  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }
  const handleEditCancel = () => {
    setIsEditModalVisible(false)
    editForm.resetFields()
    setCurrentPoem(null)
  }
  const handleSubmit = (values) => {
    if (!user) {
      message.error("User not found. Please log in again.")
      return
    }
    const newPoem = {
      title: values.title,
      user_id: _user.id,
      author: _user.username,
      authorUsername: _user.username,
      authorAvatar: _user.avatar,
      content: values.content,
      timestamp: "Just now",
      likes: 0,
      category: values.category,
      tags: values.tags,
    }
    createPoem(newPoem)
      .then((data) => {
        setPoems([data, ...poems])
        setIsModalVisible(false)
        form.resetFields()
        showSuccessToast("Your poem has been published!")
      })
      .catch((error) => {
        console.error("Error creating poem:", error)
        message.error("Failed to publish poem")
      })
  }
  const handleEditSubmit = (values) => {
    if (!currentPoem) return
    const updatedPoem = {
      ...currentPoem,
      title: values.title,
      content: values.content,
      category: values.category,
      tags: values.tags,
    }
    updatePoem(currentPoem.id, updatedPoem)
      .then((data) => {
        setPoems(poems.map((poem) => (poem.id === data.id ? data : poem)))
        setIsEditModalVisible(false)
        editForm.resetFields()
        setCurrentPoem(null)
        message.success("Poem updated successfully!")
      })
      .catch((error) => {
        console.error("Error updating poem:", error)
        message.error("Failed to update poem")
      })
  }
  const handleDelete = (id) => {
    deletePoem(id)
      .then(() => {
        setPoems(poems.filter((poem) => poem.id !== id))
        message.success("Poem deleted successfully!")
      })
      .catch((error) => {
        console.error("Error deleting poem:", error)
        message.error("Failed to delete poem")
      })
  }

  // Notification Modal Handlers
  const showNotificationModal = () => setIsNotificationModalVisible(true)
  const showEditNotificationModal = (notification) => {
    setCurrentNotification(notification)
    editNotificationForm.setFieldsValue({
      message: notification.message,
      timestamp: notification.timestamp,
      read: notification.read,
    })
    setIsEditNotificationModalVisible(true)
  }
  const handleNotificationCancel = () => {
    setIsNotificationModalVisible(false)
    notificationForm.resetFields()
  }
  const handleEditNotificationCancel = () => {
    setIsEditNotificationModalVisible(false)
    editNotificationForm.resetFields()
    setCurrentNotification(null)
  }
  const handleNotificationSubmit = (values) => {
    if (!user) {
      message.error("User not found. Please log in again.")
      return
    }
    const newNotification = {
      message: values.message,
      timestamp: values.timestamp || "Just now",
      userId: user.id,
      read: values.read || false,
    }
    createNotification(newNotification)
      .then((data) => {
        setNotifications([data, ...notifications])
        setIsNotificationModalVisible(false)
        notificationForm.resetFields()
        message.success("Notification created successfully!")
      })
      .catch((error) => {
        console.error("Error creating notification:", error)
        message.error("Failed to create notification")
      })
  }
  const handleEditNotificationSubmit = (values) => {
    if (!currentNotification) return
    const updatedNotification = {
      ...currentNotification,
      message: values.message,
      timestamp: values.timestamp,
      read: values.read,
    }
    updateNotification(currentNotification.id, updatedNotification)
      .then((data) => {
        setNotifications(notifications.map((notif) => (notif.id === data.id ? data : notif)))
        setIsEditNotificationModalVisible(false)
        editNotificationForm.resetFields()
        setCurrentNotification(null)
        message.success("Notification updated successfully!")
      })
      .catch((error) => {
        console.error("Error updating notification:", error)
        message.error("Failed to update notification")
      })
  }
  const handleDeleteNotification = (id) => {
    deleteNotification(id)
      .then(() => {
        setNotifications(notifications.filter((notif) => notif.id !== id))
        message.success("Notification deleted successfully!")
      })
      .catch((error) => {
        console.error("Error deleting notification:", error)
        message.error("Failed to delete notification")
      })
  }

  const { defaultAlgorithm, darkAlgorithm } = antTheme
  const customTheme = {
    token: {
      colorPrimary: "#6d28d9",
      borderRadius: 12,
      fontFamily: "Inter, sans-serif",
      fontSize: 16,
      colorTextBase: isDarkMode ? "#e0e0e0" : "#1f2937",
    },
    components: {
      Layout: {
        bodyBg: isDarkMode ? "#0a0a0a" : "#f9fafb",
        headerBg: isDarkMode ? "#1a1a1a" : "#ffffff",
        footerBg: isDarkMode ? "#1a1a1a" : "#f3f4f6",
        siderBg: isDarkMode ? "#1a1a1a" : "#ffffff",
      },
      Card: {
        colorBgContainer: isDarkMode ? "#212121" : "#ffffff",
        boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
        borderRadiusLG: 12,
        colorBorder: isDarkMode ? "#424242" : "#e5e7eb",
      },
      Menu: {
        itemColor: isDarkMode ? "#b0b0b0" : "#4b5563",
        itemHoverColor: "#6d28d9",
        itemSelectedColor: "#6d28d9",
        itemSelectedBg: isDarkMode ? "#424242" : "#f3e8ff",
        itemHoverBg: isDarkMode ? "#333333" : "#f3f4f6",
      },
      Button: {
        colorText: "#ffffff",
        colorBgContainer: "#6d28d9",
        ghostColor: isDarkMode ? "#e0e0e0" : "#ffffff",
        ghostBorderColor: isDarkMode ? "#616161" : "rgba(255,255,255,0.7)",
      },
      Modal: {
        colorBgElevated: isDarkMode ? "#212121" : "#ffffff",
        colorText: isDarkMode ? "#e0e0e0" : "#1f2937",
        colorTextHeading: isDarkMode ? "#ffffff" : "#1f2937",
        borderRadiusLG: 12,
      },
      Input: {
        colorBgContainer: isDarkMode ? "#333333" : "#f9fafb",
        colorTextPlaceholder: isDarkMode ? "#757575" : "#6b7280",
        colorBorder: isDarkMode ? "#616161" : "#d1d5db",
      },
      Select: {
        colorBgContainer: isDarkMode ? "#333333" : "#f9fafb",
        colorTextPlaceholder: isDarkMode ? "#757575" : "#6b7280",
        colorBorder: isDarkMode ? "#616161" : "#d1d5db",
      },
      Badge: {
        colorBgBase: isDarkMode ? "#ef4444" : "#ef4444",
      },
      Drawer: {
        colorBgElevated: isDarkMode ? "#1a1a1a" : "#ffffff",
      },
    },
  }

  const userMenu = (
    <Menu
      items={[
        { key: "1", label: "Profile", icon: <UserOutlined />, onClick: () => navigate(`/users/profile/${_user.id}`) },

        {
          key: "3",
          label: "Logout",
          icon: <LogoutOutlined />,
          onClick: () => {
            localStorage.removeItem("is_login")
            localStorage.removeItem("user")
            localStorage.removeItem("auth_token")
            _setUser(null)
            navigate("/")
            message.success("You have been logged out successfully")
          },
        },
      ]}
    />
  )

  const notificationMenu = (
    <Menu style={{ width: 300, padding: "8px 0" }}>
      {notifications.length > 0 ? (
        <>
          <Menu.Item
            key="create"
            style={{ padding: "12px 16px", background: isDarkMode ? "#424242" : "#f3e8ff" }}
            onClick={showNotificationModal}
          >
            <Text style={{ color: isDarkMode ? "#e0e0e0" : "#1f2937" }}>
              <PlusOutlined /> Create New Notification
            </Text>
          </Menu.Item>
          {notifications.map((notification) => (
            <Menu.Item key={notification.id} style={{ padding: "12px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Text style={{ color: isDarkMode ? "#e0e0e0" : "#1f2937" }}>
                    {notification.message}
                    {notification.read ? "" : <Badge dot style={{ marginLeft: 8, color: "#ef4444" }} />}
                  </Text>
                  <Text style={{ color: isDarkMode ? "#757575" : "#6b7280", fontSize: "12px" }}>
                    {notification.timestamp}
                  </Text>
                </div>
                <Dropdown
                  overlay={
                    <Menu
                      items={[
                        {
                          key: "edit",
                          label: "Edit",
                          icon: <EditOutlined />,
                          onClick: () => showEditNotificationModal(notification),
                        },
                        {
                          key: "delete",
                          label: "Delete",
                          icon: <DeleteOutlined />,
                          danger: true,
                          onClick: () => handleDeleteNotification(notification.id),
                        },
                      ]}
                    />
                  }
                  trigger={["click"]}
                >
                  <Button type="text" icon={<MoreOutlined />} style={{ color: isDarkMode ? "#757575" : "#6b7280" }} />
                </Dropdown>
              </div>
            </Menu.Item>
          ))}
        </>
      ) : (
        <Menu.Item>
          <Text style={{ color: isDarkMode ? "#757575" : "#6b7280" }}>No new notifications</Text>
        </Menu.Item>
      )}
    </Menu>
  )

  return (
    <ConfigProvider theme={{ algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm, ...customTheme }}>
      <Layout style={{ minHeight: "100vh" }}>
        {!isMobile && (
          <Sider
            width={220}
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
              boxShadow: "2px 0 12px rgba(0,0,0,0.1)",
              zIndex: 1001,
              transition: "all 0.3s ease",
            }}
          >
            <div
              style={{
                height: "64px",
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                padding: collapsed ? "0" : "0 16px",
                borderBottom: `1px solid ${isDarkMode ? "#424242" : "#e5e7eb"}`,
              }}
            >
              <BookOutlined style={{ fontSize: "28px", color: "#6d28d9" }} />
              {!collapsed && (
                <Title level={4} style={{ margin: "0 0 0 12px", color: isDarkMode ? "#ffffff" : "#1f2937" }}>
                  Poem Sansar
                </Title>
              )}
            </div>
            <Menu
              theme={isDarkMode ? "dark" : "light"}
              mode="inline"
              selectedKeys={[activeCategory]}
              style={{ borderRight: 0, padding: "8px 0" }}
              onClick={({ key }) => setActiveCategory(key)}
            >
              {categories.map((category) => (
                <Menu.Item
                  key={category.id}
                  icon={category.icon}
                  style={{ margin: "4px 8px", borderRadius: "8px", padding: "10px 16px", transition: "all 0.3s ease" }}
                >
                  {category.name}
                </Menu.Item>
              ))}
            </Menu>
          </Sider>
        )}

        <Layout style={{ marginLeft: isMobile ? 0 : collapsed ? 80 : 220, transition: "all 0.3s ease" }}>
          <Header
            style={{
              padding: "0 24px",
              background: isDarkMode ? "#1a1a1a" : "#ffffff",
              boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
              position: "sticky",
              top: 0,
              zIndex: 1000,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 64,
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              {isMobile && (
                <Button
                  type="text"
                  icon={mobileMenuVisible ? <CloseOutlined /> : <MenuOutlined />}
                  onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
                  style={{ marginRight: "12px", fontSize: "18px", color: isDarkMode ? "#e0e0e0" : "#1f2937" }}
                />
              )}
              {isMobile && (
                <Link to="/" style={{ display: "flex", alignItems: "center" }}>
                  <BookOutlined style={{ fontSize: "24px", color: "#6d28d9" }} />
                  <Title level={4} style={{ margin: "0 0 0 8px", color: isDarkMode ? "#ffffff" : "#1f2937" }}>
                    Poem Sansar
                  </Title>
                </Link>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, justifyContent: "center" }}>
              <Input
                placeholder="Search poems..."
                prefix={<SearchOutlined style={{ color: "#6d28d9" }} />}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                style={{
                  width: isMobile ? "100%" : "300px",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  marginRight: "16px",
                  background: isDarkMode ? "#333333" : "#f9fafb",
                  border: `1px solid ${isDarkMode ? "#616161" : "#d1d5db"}`,
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
                onBlur={(e) => (e.target.style.borderColor = isDarkMode ? "#616161" : "#d1d5db")}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showModal}
                style={{
                  background: "linear-gradient(90deg, #6d28d9, #a78bfa)",
                  border: "none",
                  boxShadow: "0 4px 15px rgba(109, 40, 217, 0.3)",
                  borderRadius: "8px",
                  padding: "6px 16px",
                  fontSize: "14px",
                  height: "40px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                New Poem
              </Button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
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
                  background: isDarkMode ? "#facc15" : "#1f2937",
                  color: isDarkMode ? "#1f2937" : "#ffffff",
                  fontSize: "18px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              <Dropdown overlay={notificationMenu} trigger={["click"]} placement="bottomRight">
                <Badge count={notifications.filter((notif) => !notif.read).length} size="small" offset={[-4, 4]}>
                  <Button
                    type="text"
                    icon={<BellOutlined />}
                    style={{
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      fontSize: "18px",
                      color: isDarkMode ? "#e0e0e0" : "#4b5563",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </Badge>
              </Dropdown>
              <Dropdown overlay={userMenu} trigger={["click"]} placement="bottomRight">
                <div
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    padding: "8px",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? "#333333" : "#f3f4f6")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {isLoadingUser ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar size={36} style={{ backgroundColor: "#e5e7eb" }} />
                      {!isMobile && (
                        <div style={{ marginLeft: "8px", textAlign: "left" }}>
                          <Text style={{ color: isDarkMode ? "#757575" : "#6b7280" }}>Loading...</Text>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <Avatar src={user?.avatar} size={36} />
                      {!isMobile && (
                        <div style={{ marginLeft: "8px", textAlign: "left" }}>
                          <Text
                            strong
                            style={{ color: isDarkMode ? "#ffffff" : "#1f2937", display: "block", lineHeight: "1.2" }}
                          >
                            {_user?.username || "User"}
                          </Text>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Dropdown>
            </div>
          </Header>

          <Drawer
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <BookOutlined style={{ fontSize: "24px", color: "#6d28d9", marginRight: "12px" }} />
                <span style={{ color: isDarkMode ? "#ffffff" : "#1f2937" }}>Poem Sansar</span>
              </div>
            }
            placement="left"
            onClose={() => setMobileMenuVisible(false)}
            open={mobileMenuVisible}
            width={250}
            bodyStyle={{ padding: "16px" }}
          >
            <div style={{ marginBottom: "16px" }}>
              <Input
                prefix={<SearchOutlined style={{ color: "#6d28d9" }} />}
                placeholder="Search poems..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ borderRadius: "8px" }}
              />
            </div>
            <Menu
              mode="inline"
              selectedKeys={[activeCategory]}
              onClick={({ key }) => {
                setActiveCategory(key)
                setMobileMenuVisible(false)
              }}
              style={{ borderRight: 0 }}
            >
              {categories.map((category) => (
                <Menu.Item
                  key={category.id}
                  icon={category.icon}
                  style={{ margin: "4px 0", borderRadius: "8px", padding: "10px 16px", transition: "all 0.3s ease" }}
                >
                  {category.name}
                </Menu.Item>
              ))}
            </Menu>
          </Drawer>

          <Content style={{ padding: "32px 24px", overflow: "initial" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              <div style={{ marginBottom: "32px" }}>
                <Title
                  level={2}
                  style={{ color: isDarkMode ? "#ffffff" : "#1f2937", margin: 0, fontWeight: 700, fontSize: "28px" }}
                >
                  {categories.find((cat) => cat.id === activeCategory)?.name || "All Poems"}
                </Title>
                <Text style={{ color: isDarkMode ? "#757575" : "#6b7280", fontSize: "16px" }}>
                  Discover and share beautiful poetry
                </Text>
              </div>

              {isLoadingPoems ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                  <Spin size="large" />
                </div>
              ) : filteredPoems.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {filteredPoems.map((poem) => (
                    <Card
                      key={poem.id}
                      style={{
                        borderRadius: "12px",
                        border: `1px solid ${isDarkMode ? "#424242" : "#e5e7eb"}`,
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                    >
                      <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                        <Avatar src={poem.authorAvatar} size={40} />
                        <div style={{ marginLeft: "12px" }}>
                          <Text strong style={{ color: isDarkMode ? "#ffffff" : "#1f2937", display: "block" }}>
                            {poem.author}
                          </Text>
                          <Text style={{ color: isDarkMode ? "#757575" : "#6b7280", fontSize: "12px" }}>
                            {poem.authorUsername} · {poem.timestamp}
                          </Text>
                        </div>
                        {user && poem.authorUsername === user.username && (
                          <Dropdown
                            overlay={
                              <Menu
                                items={[
                                  {
                                    key: "1",
                                    label: "Edit",
                                    icon: <EditOutlined />,
                                    onClick: () => showEditModal(poem),
                                  },
                                  {
                                    key: "2",
                                    label: "Delete",
                                    icon: <DeleteOutlined />,
                                    danger: true,
                                    onClick: () => handleDelete(poem.id),
                                  },
                                ]}
                              />
                            }
                            trigger={["click"]}
                            placement="bottomRight"
                          >
                            <Button
                              type="text"
                              icon={<MoreOutlined />}
                              style={{ marginLeft: "auto", color: isDarkMode ? "#757575" : "#6b7280" }}
                            />
                          </Dropdown>
                        )}
                      </div>
                      <Title
                        level={4}
                        style={{
                          color: isDarkMode ? "#ffffff" : "#1f2937",
                          marginBottom: "12px",
                          fontWeight: 600,
                          fontSize: "20px",
                        }}
                      >
                        {poem.title}
                      </Title>
                      <Paragraph
                        style={{
                          whiteSpace: "pre-line",
                          color: isDarkMode ? "#e0e0e0" : "#4b5563",
                          fontFamily: "'Georgia', serif",
                          fontSize: "16px",
                          lineHeight: "1.8",
                          marginBottom: "16px",
                        }}
                      >
                        {poem.content}
                      </Paragraph>
                      <Divider style={{ margin: "0 0 12px 0", borderColor: isDarkMode ? "#424242" : "#e5e7eb" }} />
                      <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                        <Button
                          type="text"
                          icon={likedPoems[poem.id] ? <HeartFilled style={{ color: "#ef4444" }} /> : <HeartOutlined />}
                          onClick={() => toggleLike(poem.id)}
                          style={{ color: isDarkMode ? "#e0e0e0" : "#4b5563", transition: "all 0.3s ease" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = isDarkMode ? "#e0e0e0" : "#4b5563")}
                        >
                          {poem.likes || 0}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div style={{ margin: "40px 0", textAlign: "center" }}>
                  <Text style={{ color: isDarkMode ? "#757575" : "#6b7280" }}>
                    {searchQuery ? "No poems found matching your search" : "No poems found in this category"}
                  </Text>
                </div>
              )}
            </div>
          </Content>

          <Footer style={{ textAlign: "center", padding: "16px" }}>
            <Text style={{ color: isDarkMode ? "#757575" : "#6b7280" }}>
              © {new Date().getFullYear()} Poem Sansar. All rights reserved.
            </Text>
          </Footer>
        </Layout>

        <Modal
          title={
            <Title level={4} style={{ margin: 0, color: isDarkMode ? "#ffffff" : "#1f2937", fontWeight: 600 }}>
              Create New Poem
            </Title>
          }
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={600}
          style={{ top: 20 }}
          bodyStyle={{
            padding: "24px",
            borderRadius: "12px",
            background: isDarkMode ? "#212121" : "#ffffff",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
          transitionName="ant-fade"
        >
          <div style={{ padding: "8px 0" }}>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                name="title"
                label={
                  <Text strong style={{ color: isDarkMode ? "#e0e0e0" : "#1f2937" }}>
                    Title
                  </Text>
                }
                rules={[{ required: true, message: "Please enter a title for your poem" }]}
              >
                <Input
                  placeholder="Enter the title of your poem"
                  style={{
                    borderRadius: "8px",
                    padding: "10px 12px",
                    fontSize: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
                  onBlur={(e) => (e.target.style.borderColor = isDarkMode ? "#616161" : "#d1d5db")}
                />
              </Form.Item>
              <Form.Item
                name="content"
                label={
                  <Text strong style={{ color: isDarkMode ? "#e0e0e0" : "#1f2937" }}>
                    Content
                  </Text>
                }
                rules={[{ required: true, message: "Please enter your poem content" }]}
              >
                <TextArea
                  placeholder="Write your poem here..."
                  rows={6}
                  style={{
                    borderRadius: "8px",
                    padding: "12px",
                    fontFamily: "'Georgia', serif",
                    fontSize: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    resize: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
                  onBlur={(e) => (e.target.style.borderColor = isDarkMode ? "#616161" : "#d1d5db")}
                />
              </Form.Item>
              <Form.Item
                name="category"
                label={
                  <Text strong style={{ color: isDarkMode ? "#e0e0e0" : "#1f2937" }}>
                    Category
                  </Text>
                }
                rules={[{ required: true, message: "Please select a category" }]}
              >
                <Select
                  placeholder="Select a category"
                  style={{ borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                  dropdownStyle={{ borderRadius: "8px", background: isDarkMode ? "#333333" : "#ffffff" }}
                >
                  {categories
                    .filter((cat) => cat.id !== "all")
                    .map((category) => (
                      <Option key={category.id} value={category.name}>
                        {category.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="tags"
                label={
                  <Text strong style={{ color: isDarkMode ? "#e0e0e0" : "#1f2937" }}>
                    Tags
                  </Text>
                }
                rules={[{ required: true, message: "Please add at least one tag" }]}
              >
                <Select
                  mode="tags"
                  placeholder="Add tags (e.g., Nature, Love)"
                  style={{ borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                  dropdownStyle={{ borderRadius: "8px", background: isDarkMode ? "#333333" : "#ffffff" }}
                >
                  <Option value="Nature">Nature</Option>
                  <Option value="Love">Love</Option>
                  <Option value="Life">Life</Option>
                  <Option value="Dreams">Dreams</Option>
                  <Option value="Hope">Hope</Option>
                </Select>
              </Form.Item>
              <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
                <Space size="middle">
                  <Button
                    onClick={handleCancel}
                    style={{
                      borderRadius: "8px",
                      padding: "6px 20px",
                      fontSize: "14px",
                      color: isDarkMode ? "#e0e0e0" : "#1f2937",
                      borderColor: isDarkMode ? "#616161" : "#d1d5db",
                      background: "transparent",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#6d28d9"
                      e.currentTarget.style.color = "#6d28d9"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = isDarkMode ? "#616161" : "#d1d5db"
                      e.currentTarget.style.color = isDarkMode ? "#e0e0e0" : "#1f2937"
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      background: "linear-gradient(90deg, #6d28d9, #a78bfa)",
                      border: "none",
                      boxShadow: "0 4px 15px rgba(109, 40, 217, 0.3)",
                      borderRadius: "8px",
                      padding: "6px 20px",
                      fontSize: "14px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    Publish Poem
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </Modal>

        <Modal
          title={
            <Title level={4} style={{ margin: 0, color: isDarkMode ? "#ffffff" : "#1f2937", fontWeight: 600 }}>
              Edit Poem
            </Title>
          }
          open={isEditModalVisible}
          onCancel={handleEditCancel}
          footer={null}
          width={600}
          style={{ top: 20 }}
          bodyStyle={{
            padding: "24px",
            borderRadius: "12px",
            background: isDarkMode ? "#212121" : "#ffffff",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
          transitionName="ant-fade"
        >
          <div style={{ padding: "8px 0" }}>
            <Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
              <Form.Item
                name="title"
                label={
                  <Text strong style={{ color: isDarkMode ? "#e0e0e0" : "#1f2937" }}>
                    Title
                  </Text>
                }
                rules={[{ required: true, message: "Please enter a title for your poem" }]}
              >
                <Input
                  placeholder="Enter the title of your poem"
                  style={{
                    borderRadius: "8px",
                    padding: "10px 12px",
                    fontSize: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
                  onBlur={(e) => (e.target.style.borderColor = isDarkMode ? "#616161" : "#d1d5db")}
                />
              </Form.Item>
              <Form.Item
                name="content"
                label={
                  <Text strong style={{ color: isDarkMode ? "#e0e0e0" : "#1f2937" }}>
                    Content
                  </Text>
                }
                rules={[{ required: true, message: "Please enter your poem content" }]}
              >
                <TextArea
                  placeholder="Write your poem here..."
                  rows={6}
                  style={{
                    borderRadius: "8px",
                    padding: "12px",
                    fontFamily: "'Georgia', serif",
                    fontSize: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    resize: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
                  onBlur={(e) => (e.target.style.borderColor = isDarkMode ? "#616161" : "#d1d5db")}
                />
              </Form.Item>
              <Form.Item
                name="category"
                label={
                  <Text strong style={{ color: isDarkMode ? "#e0e0e0" : "#1f2937" }}>
                    Category
                  </Text>
                }
                rules={[{ required: true, message: "Please select a category" }]}
              >
                <Select
                  placeholder="Select a category"
                  style={{ borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                  dropdownStyle={{ borderRadius: "8px", background: isDarkMode ? "#333333" : "#ffffff" }}
                >
                  {categories
                    .filter((cat) => cat.id !== "all")
                    .map((category) => (
                      <Option key={category.id} value={category.name}>
                        {category.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="tags"
                label={
                  <Text strong style={{ color: isDarkMode ? "#e0e0e0" : "#1f2937" }}>
                    Tags
                  </Text>
                }
                rules={[{ required: true, message: "Please add at least one tag" }]}
              >
                <Select
                  mode="tags"
                  placeholder="Add tags (e.g., Nature, Love)"
                  style={{ borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                  dropdownStyle={{ borderRadius: "8px", background: isDarkMode ? "#333333" : "#ffffff" }}
                >
                  <Option value="Nature">Nature</Option>
                  <Option value="Love">Love</Option>
                  <Option value="Life">Life</Option>
                  <Option value="Dreams">Dreams</Option>
                  <Option value="Hope">Hope</Option>
                </Select>
              </Form.Item>
              <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
                <Space size="middle">
                  <Button
                    onClick={handleEditCancel}
                    style={{
                      borderRadius: "8px",
                      padding: "6px 20px",
                      fontSize: "14px",
                      color: isDarkMode ? "#e0e0e0" : "#1f2937",
                      borderColor: isDarkMode ? "#616161" : "#d1d5db",
                      background: "transparent",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#6d28d9"
                      e.currentTarget.style.color = "#6d28d9"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = isDarkMode ? "#616161" : "#d1d5db"
                      e.currentTarget.style.color = isDarkMode ? "#e0e0e0" : "#1f2937"
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      background: "linear-gradient(90deg, #6d28d9, #a78bfa)",
                      border: "none",
                      boxShadow: "0 4px 15px rgba(109, 40, 217, 0.3)",
                      borderRadius: "8px",
                      padding: "6px 20px",
                      fontSize: "14px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    Update Poem
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </Modal>

        <Modal
          title={
            <Title level={4} style={{ margin: 0, color: isDarkMode ? "#ffffff" : "#1f2937", fontWeight: 600 }}>
              Create New Notification
            </Title>
          }
          open={isNotificationModalVisible}
          onCancel={handleNotificationCancel}
          footer={null}
          width={600}
          style={{ top: 20 }}
          bodyStyle={{
            padding: "24px",
            borderRadius: "12px",
            background: isDarkMode ? "#212121" : "#ffffff",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
          transitionName="ant-fade"
        >
          <div style={{ padding: "8px 0" }}>
            <Form form={notificationForm} layout="vertical" onFinish={handleNotificationSubmit}>
              <Form.Item
                name="message"
                label={
                  <Text strong style={{ color: isDarkMode ? "#e0e0e0" : "#1f2937" }}>
                    Message
                  </Text>
                }
                rules={[{ required: true, message: "Please enter the notification message" }]}
              >
                <Input
                  placeholder="Enter the notification message"
                  style={{
                    borderRadius: "8px",
                    padding: "10px 12px",
                    fontSize: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
                  onBlur={(e) => (e.target.style.borderColor = isDarkMode ? "#616161" : "#d1d5db")}
                />
              </Form.Item>
              <Form.Item
                name="timestamp"
                label={
                  <Text strong style={{ color: isDarkMode ? "#e0e0e0" : "#1f2937" }}>
                    Timestamp
                  </Text>
                }
                initialValue="Just now"
              >
                <Input
                  placeholder="Enter the timestamp (e.g., 5 mins ago)"
                  style={{
                    borderRadius: "8px",
                    padding: "10px 12px",
                    fontSize: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
                  onBlur={(e) => (e.target.style.borderColor = isDarkMode ? "#616161" : "#d1d5db")}
                />
              </Form.Item>
              <Form.Item
                name="read"
                label={
                  <Text strong style={{ color: isDarkMode ? "#e0e0e0" : "#1f2937" }}>
                    Read Status
                  </Text>
                }
                valuePropName="checked"
              >
                <Checkbox style={{ color: isDarkMode ? "#e0e0e0" : "#1f2937" }}>Mark as Read</Checkbox>
              </Form.Item>
              <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
                <Space size="middle">
                  <Button
                    onClick={handleNotificationCancel}
                    style={{
                      borderRadius: "8px",
                      padding: "6px 20px",
                      fontSize: "14px",
                      color: isDarkMode ? "#e0e0e0" : "#1f2937",
                      borderColor: isDarkMode ? "#616161" : "#d1d5db",
                      background: "transparent",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#6d28d9"
                      e.currentTarget.style.color = "#6d28d9"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = isDarkMode ? "#616161" : "#d1d5db"
                      e.currentTarget.style.color = isDarkMode ? "#e0e0e0" : "#1f2937"
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      background: "linear-gradient(90deg, #6d28d9, #a78bfa)",
                      border: "none",
                      boxShadow: "0 4px 15px rgba(109, 40, 217, 0.3)",
                      borderRadius: "8px",
                      padding: "6px 20px",
                      fontSize: "14px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    Create Notification
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </Modal>

        <Modal
          title={
            <Title level={4} style={{ margin: 0, color: isDarkMode ? "#ffffff" : "#1f2937", fontWeight: 600 }}>
              Edit Notification
            </Title>
          }
          open={isEditNotificationModalVisible}
          onCancel={handleEditNotificationCancel}
          footer={null}
          width={600}
          style={{ top: 20 }}
          bodyStyle={{
            padding: "24px",
            borderRadius: "12px",
            background: isDarkMode ? "#212121" : "#ffffff",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
          transitionName="ant-fade"
        >
          <div style={{ padding: "8px 0" }}>
            <Form form={editNotificationForm} layout="vertical" onFinish={handleEditNotificationSubmit}>
              <Form.Item
                name="message"
                label={
                  <Text strong style={{ color: isDarkMode ? "#e0e0e0" : "#1f2937" }}>
                    Message
                  </Text>
                }
                rules={[{ required: true, message: "Please enter the notification message" }]}
              >
                <Input
                  placeholder="Enter the notification message"
                  style={{
                    borderRadius: "8px",
                    padding: "10px 12px",
                    fontSize: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
                  onBlur={(e) => (e.target.style.borderColor = isDarkMode ? "#616161" : "#d1d5db")}
                />
              </Form.Item>
              <Form.Item
                name="timestamp"
                label={
                  <Text strong style={{ color: isDarkMode ? "#e0e0e0" : "#1f2937" }}>
                    Timestamp
                  </Text>
                }
              >
                <Input
                  placeholder="Enter the timestamp (e.g., 5 mins ago)"
                  style={{
                    borderRadius: "8px",
                    padding: "10px 12px",
                    fontSize: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
                  onBlur={(e) => (e.target.style.borderColor = isDarkMode ? "#616161" : "#d1d5db")}
                />
              </Form.Item>
              <Form.Item
                name="read"
                label={
                  <Text strong style={{ color: isDarkMode ? "#e0e0e0" : "#1f2937" }}>
                    Read Status
                  </Text>
                }
                valuePropName="checked"
              >
                <Checkbox style={{ color: isDarkMode ? "#e0e0e0" : "#1f2937" }}>Mark as Read</Checkbox>
              </Form.Item>
              <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
                <Space size="middle">
                  <Button
                    onClick={handleEditNotificationCancel}
                    style={{
                      borderRadius: "8px",
                      padding: "6px 20px",
                      fontSize: "14px",
                      color: isDarkMode ? "#e0e0e0" : "#1f2937",
                      borderColor: isDarkMode ? "#616161" : "#d1d5db",
                      background: "transparent",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#6d28d9"
                      e.currentTarget.style.color = "#6d28d9"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = isDarkMode ? "#616161" : "#d1d5db"
                      e.currentTarget.style.color = isDarkMode ? "#e0e0e0" : "#1f2937"
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      background: "linear-gradient(90deg, #6d28d9, #a78bfa)",
                      border: "none",
                      boxShadow: "0 4px 15px rgba(109, 40, 217, 0.3)",
                      borderRadius: "8px",
                      padding: "6px 20px",
                      fontSize: "14px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    Update Notification
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </Layout>
    </ConfigProvider>
  )
}

export default Dashboard

