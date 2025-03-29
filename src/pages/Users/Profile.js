"use client";

import { useState, useEffect, useContext } from "react";
import {
  Layout,
  Menu,
  Button,
  Typography,
  Avatar,
  Input,
  Card,
  Tag,
  Space,
  Divider,
  Modal,
  Form,
  message,
  ConfigProvider,
  theme as antTheme,
  Dropdown,
  Select,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  LogoutOutlined,
  SettingOutlined,
  BookOutlined,
  HeartOutlined,
  HeartFilled,
  SunOutlined,
  MoonOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/user.context";
import { getPoemsByUserId, updatePoem, deletePoem } from "../../utils/poem.util";
import { getUser, updateUser } from "../../utils/user.util";
import { showSuccessToast } from "../../utils/toastify.util";
import { getUserFromStorage, setUserInStorage, clearAuthStorage } from "../../utils/storage.util"; // Import the new utilities

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Profile = () => {
   let params = useParams();
  const { userId } = useParams();
  const { _user, _setUser } = useContext(UserContext);
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [user, setUser] = useState(null);
  const [poems, setPoems] = useState([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingPoems, setIsLoadingPoems] = useState(true);
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] = useState(false);
  const [isEditPoemModalVisible, setIsEditPoemModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [poemToDelete, setPoemToDelete] = useState(null);
  const [currentPoem, setCurrentPoem] = useState(null);
  const [likedPoems, setLikedPoems] = useState({});
  const [form] = Form.useForm();
  const [editPoemForm] = Form.useForm();
  const navigate = useNavigate();

  // Handle storage events (e.g., logout from another tab)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "user" && !event.newValue) {
        navigate("/");
        message.error("Session expired. Please log in again.");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);

  // Fetch user data on mount
  useEffect(() => {
    const parsedUser = getUserFromStorage();
    if (!parsedUser) {
      navigate("/");
      message.error("Please log in to continue");
      return;
    }

    const currentUserId = parsedUser.id;

    if (currentUserId !== userId) {
      navigate("/users/dashboard");
      message.error("You can only view your own profile.");
      return;
    }

    setIsLoadingUser(true);
    getUser(userId)
      .then((data) => {
        const userData = {
          id: data.id,
          username: data.username || `user${data.id}`,
          email: data.email || "",
          avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        };
        setUser(userData);
        _setUser(userData);
        setUserInStorage(userData); // Update localStorage with the latest user data
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        message.error("Failed to fetch user data");
        setUser({
          id: userId,
          username: `user${userId}`,
          email: "",
          avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        });
      })
      .finally(() => setIsLoadingUser(false));
  }, [userId, navigate, _setUser]);

  // Fetch user's poems
  useEffect(() => {
    if (!_user?.id) return;

    setIsLoadingPoems(true);
    getPoemsByUserId(_user.id)
      .then((data) => {
        const userPoems = Array.isArray(data) ? data.filter((poem) => poem.user_id === _user.id) : [];
        setPoems(userPoems);
      })
      .catch((error) => {
        console.error("Error fetching poems:", error);
        message.error("Failed to fetch poems");
        setPoems([]);
      })
      .finally(() => setIsLoadingPoems(false));
  }, [_user?.id]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleLike = (poemId) => setLikedPoems((prev) => ({ ...prev, [poemId]: !prev[poemId] }));

  // Profile Edit Handlers
  const showEditProfileModal = () => {
    form.setFieldsValue({
      username: _user?.username || "",
      email: _user?.email || "",
    });
    setIsEditProfileModalVisible(true);
  };

  const handleEditProfileCancel = () => {
    setIsEditProfileModalVisible(false);
    form.resetFields();
  };

  const handleEditProfileSubmit = async (values) => {
    if (!user?.id) {
      message.error("No valid user found");
      return;
    }
  
    try {
      const updatedUser = await updateUser(user.id, values);
      
      if (!updatedUser) {
        throw new Error("No updated user data received");
      }
  
      // Update all states and storage
      setUser(updatedUser);
      _setUser(updatedUser);
      setUserInStorage(updatedUser);
  
      setIsEditProfileModalVisible(false);
      form.resetFields();
      showSuccessToast("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error(error.message || "Failed to update profile");
    }
  };

  // Poem Edit Handlers
  const showEditPoemModal = (poem) => {
    setCurrentPoem(poem);
    editPoemForm.setFieldsValue({
      title: poem.title,
      content: poem.content,
      category: poem.category,
      tags: Array.isArray(poem.tags) ? poem.tags : poem.tags.split(",").map((tag) => tag.trim()),
    });
    setIsEditPoemModalVisible(true);
  };

  const handleEditPoemCancel = () => {
    setIsEditPoemModalVisible(false);
    editPoemForm.resetFields();
    setCurrentPoem(null);
  };

  const handleEditPoemSubmit = (values) => {
    if (!currentPoem) return;

    const updatedPoem = {
      ...currentPoem,
      title: values.title,
      content: values.content,
      category: values.category,
      tags: Array.isArray(values.tags) ? values.tags : values.tags.split(",").map((tag) => tag.trim()),
      user_id: _user.id,
    };

    updatePoem(currentPoem.id, updatedPoem)
      .then((data) => {
        setPoems(poems.map((poem) => (poem.id === data.id ? data : poem)));
        setIsEditPoemModalVisible(false);
        editPoemForm.resetFields();
        setCurrentPoem(null);
        message.success("Poem updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating poem:", error);
        message.error("Failed to update poem");
      });
  };

  // Delete Poem Handlers
  const showDeleteConfirm = (poem) => {
    setPoemToDelete(poem);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setPoemToDelete(null);
  };

  const handleDeleteConfirm = () => {
    if (!poemToDelete) return;

    deletePoem(poemToDelete.id)
      .then(() => {
        setPoems(poems.filter((poem) => poem.id !== poemToDelete.id));
        message.success("Poem deleted successfully!");
        setIsDeleteModalVisible(false);
        setPoemToDelete(null);
      })
      .catch((error) => {
        console.error("Error deleting poem:", error);
        message.error("Failed to delete poem");
        setIsDeleteModalVisible(false);
        setPoemToDelete(null);
      });
  };

  const userMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: "Profile",
          icon: <UserOutlined />,
          onClick: () => navigate(`/users/profile/${_user?.id}`),
        },
        {
          key: "2",
          label: "Logout",
          icon: <LogoutOutlined />,
          onClick: () => {
            clearAuthStorage(); // Use the utility to clear storage
            _setUser(null);
            navigate("/");
            message.success("You have been logged out successfully");
          },
        },
      ]}
    />
  );

  const { defaultAlgorithm, darkAlgorithm } = antTheme;
  const customTheme = {
    token: {
      colorPrimary: "#6d28d9",
      borderRadius: 12,
      fontFamily: "Inter, sans-serif",
      fontSize: 16,
      colorTextBase: isDarkMode ? "#e5e7eb" : "#1f2937",
    },
    components: {
      Layout: {
        bodyBg: isDarkMode ? "#000000" : "#f9fafb",
        headerBg: isDarkMode ? "#1a1a1a" : "#ffffff",
        footerBg: isDarkMode ? "#1a1a1a" : "#f3f4f6",
      },
      Card: {
        colorBgContainer: isDarkMode ? "#1a1a1a" : "#ffffff",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        borderRadiusLG: 12,
        colorBorder: isDarkMode ? "#333333" : "#e5e7eb",
      },
      Button: {
        colorText: "#ffffff",
        colorBgContainer: "#6d28d9",
        ghostColor: isDarkMode ? "#e5e7eb" : "#ffffff",
        ghostBorderColor: isDarkMode ? "#404040" : "rgba(255,255,255,0.7)",
      },
      Tag: {
        colorBgContainer: isDarkMode ? "rgba(109, 40, 217, 0.15)" : "rgba(109, 40, 217, 0.1)",
        colorBorder: "#6d28d9",
        colorText: isDarkMode ? "#d8b4fe" : "#6d28d9",
      },
      Modal: {
        colorBgElevated: isDarkMode ? "#1a1a1a" : "#ffffff",
        colorText: isDarkMode ? "#e5e7eb" : "#1f2937",
        colorTextHeading: isDarkMode ? "#ffffff" : "#1f2937",
        borderRadiusLG: 12,
      },
      Input: {
        colorBgContainer: isDarkMode ? "#262626" : "#f9fafb",
        colorTextPlaceholder: isDarkMode ? "#808080" : "#6b7280",
        colorBorder: isDarkMode ? "#404040" : "#d1d5db",
      },
      Select: {
        colorBgContainer: isDarkMode ? "#262626" : "#f9fafb",
        colorTextPlaceholder: isDarkMode ? "#808080" : "#6b7280",
        colorBorder: isDarkMode ? "#404040" : "#d1d5db",
      },
    },
  };

  return (
    <ConfigProvider theme={{ algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm, ...customTheme }}>
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{
            padding: "0 24px",
            background: isDarkMode ? "#1a1a1a" : "#ffffff",
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <BookOutlined style={{ fontSize: "24px", color: "#6d28d9" }} />
            <Title level={4} style={{ margin: "0 0 0 8px", color: isDarkMode ? "#ffffff" : "#1f2937" }}>
              Poem Sansar
            </Title>
          </div>
          <Space>
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
            <Button
              type="primary"
              onClick={() => navigate("/users/dashboard")}
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
              Back to Dashboard
            </Button>
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
                  <Avatar size={36} style={{ backgroundColor: "#e5e7eb" }} />
                ) : (
                  <Avatar src={user?.avatar} size={36} />
                )}
              </div>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ padding: "32px 24px" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            {isLoadingUser ? (
              <div style={{ textAlign: "center", margin: "40px 0" }}>
                <Text style={{ color: isDarkMode ? "#d1d5db" : "#6b7280" }}>Loading user data...</Text>
              </div>
            ) : (
              <Card
                style={{
                  marginBottom: "32px",
                  borderRadius: "12px",
                  border: `1px solid ${isDarkMode ? "#333333" : "#e5e7eb"}`,
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar src={user?.avatar} size={64} />
                    <div style={{ marginLeft: "16px" }}>
                      <Title level={3} style={{ margin: 0, color: isDarkMode ? "#ffffff" : "#1f2937" }}>
                        {_user?.username}
                      </Title>
                      <Text style={{ color: isDarkMode ? "#d1d5db" : "#4b5563" }}>{_user?.email}</Text>
                    </div>
                  </div>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={showEditProfileModal}
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
                    Edit Profile
                  </Button>
                </div>
              </Card>
            )}

            <Title level={2} style={{ color: isDarkMode ? "#ffffff" : "#1f2937" }}>
              My Poems
            </Title>
            {isLoadingPoems ? (
              <div style={{ textAlign: "center", margin: "40px 0" }}>
                <Text style={{ color: isDarkMode ? "#d1d5db" : "#6b7280" }}>Loading poems...</Text>
              </div>
            ) : poems.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {poems.map((poem) => (
                  <Card
                    key={poem.id}
                    style={{
                      borderRadius: "12px",
                      border: `1px solid ${isDarkMode ? "#333333" : "#e5e7eb"}`,
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <Title
                          level={4}
                          style={{
                            color: isDarkMode ? "#ffffff" : "#1f2937",
                            marginBottom: "8px",
                            fontWeight: 600,
                            fontSize: "20px",
                          }}
                        >
                          {poem.title}
                        </Title>
                        <Text style={{ color: isDarkMode ? "#9ca3af" : "#6b7280", fontSize: "12px" }}>
                          {poem.timestamp}
                        </Text>
                      </div>
                      <Dropdown
                        overlay={
                          <Menu
                            items={[
                              {
                                key: "1",
                                label: "Edit",
                                icon: <EditOutlined />,
                                onClick: () => showEditPoemModal(poem),
                              },
                              {
                                key: "2",
                                label: "Delete",
                                icon: <DeleteOutlined />,
                                danger: true,
                                onClick: () => showDeleteConfirm(poem),
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
                          style={{ color: isDarkMode ? "#9ca3af" : "#6b7280" }}
                        />
                      </Dropdown>
                    </div>
                    <Text
                      style={{
                        whiteSpace: "pre-line",
                        color: isDarkMode ? "#d1d5db" : "#4b5563",
                        fontFamily: "'Georgia', serif",
                        fontSize: "16px",
                        lineHeight: "1.8",
                        marginBottom: "16px",
                      }}
                    >
                      {poem.content}
                    </Text>
                    <Space wrap style={{ marginBottom: "16px" }}>
                      {Array.isArray(poem.tags) ? (
                        poem.tags.map((tag) => (
                          <Tag
                            key={tag}
                            style={{
                              borderRadius: "12px",
                              padding: "4px 12px",
                              fontSize: "12px",
                              transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = isDarkMode ? "#6d28d9" : "#ede9fe")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = isDarkMode
                                ? "rgba(109, 40, 217, 0.15)"
                                : "rgba(109, 40, 217, 0.1)")
                            }
                          >
                            {tag}
                          </Tag>
                        ))
                      ) : (
                        <Tag
                          style={{
                            borderRadius: "12px",
                            padding: "4px 12px",
                            fontSize: "12px",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = isDarkMode ? "#6d28d9" : "#ede9fe")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = isDarkMode
                              ? "rgba(109, 40, 217, 0.15)"
                              : "rgba(109, 40, 217, 0.1)")
                          }
                        >
                          {poem.tags}
                        </Tag>
                      )}
                    </Space>
                    <Divider style={{ margin: "0 0 12px 0", borderColor: isDarkMode ? "#333333" : "#e5e7eb" }} />
                    <Button
                      type="text"
                      icon={
                        likedPoems[poem.id] ? (
                          <HeartFilled style={{ color: "#ef4444" }} />
                        ) : (
                          <HeartOutlined />
                        )
                      }
                      onClick={() => toggleLike(poem.id)}
                      style={{
                        color: isDarkMode ? "#d1d5db" : "#4b5563",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = isDarkMode ? "#d1d5db" : "#4b5563")
                      }
                    >
                      {likedPoems[poem.id] ? poem.likes + 1 : poem.likes}
                    </Button>
                  </Card>
                ))}
              </div>
            ) : (
              <div style={{ margin: "40px 0", textAlign: "center" }}>
                <Text style={{ color: isDarkMode ? "#d1d5db" : "#6b7280" }}>
                  You haven't posted any poems yet.
                </Text>
              </div>
            )}
          </div>
        </Content>

        <Footer style={{ textAlign: "center", padding: "16px" }}>
          <Text style={{ color: isDarkMode ? "#9ca3af" : "#6b7280" }}>
            © {new Date().getFullYear()} Poem Sansar. All rights reserved.
          </Text>
        </Footer>

        <Modal
          title={
            <Title
              level={4}
              style={{
                margin: 0,
                color: isDarkMode ? "#ffffff" : "#1f2937",
                fontWeight: 600,
              }}
            >
              Edit Profile
            </Title>
          }
          open={isEditProfileModalVisible}
          onCancel={handleEditProfileCancel}
          footer={null}
          width={600}
          style={{ top: 20 }}
          bodyStyle={{
            padding: "24px",
            borderRadius: "12px",
            background: isDarkMode ? "#1a1a1a" : "#ffffff",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
          transitionName="ant-fade"
        >
          <div style={{ padding: "8px 0" }}>
            <Form form={form} layout="vertical" onFinish={handleEditProfileSubmit}>
              <Form.Item
                name="username"
                label={
                  <Text strong style={{ color: isDarkMode ? "#e5e7eb" : "#1f2937" }}>
                    Username
                  </Text>
                }
                rules={[{ required: true, message: "Please enter your username" }]}
              >
                <Input
                  placeholder="Enter your username"
                  style={{
                    borderRadius: "8px",
                    padding: "10px 12px",
                    fontSize: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
                  onBlur={(e) => (e.target.style.borderColor = isDarkMode ? "#404040" : "#d1d5db")}
                />
              </Form.Item>
              <Form.Item
                name="email"
                label={
                  <Text strong style={{ color: isDarkMode ? "#e5e7eb" : "#1f2937" }}>
                    Email
                  </Text>
                }
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  placeholder="Enter your email"
                  style={{
                    borderRadius: "8px",
                    padding: "10px 12px",
                    fontSize: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
                  onBlur={(e) => (e.target.style.borderColor = isDarkMode ? "#404040" : "#d1d5db")}
                />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
                <Space size="middle">
                  <Button
                    onClick={handleEditProfileCancel}
                    style={{
                      borderRadius: "8px",
                      padding: "6px 20px",
                      fontSize: "14px",
                      color: isDarkMode ? "#e5e7eb" : "#1f2937",
                      borderColor: isDarkMode ? "#404040" : "#d1d5db",
                      background: "transparent",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#6d28d9";
                      e.currentTarget.style.color = "#6d28d9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = isDarkMode ? "#404040" : "#d1d5db";
                      e.currentTarget.style.color = isDarkMode ? "#e5e7eb" : "#1f2937";
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
                    Save Changes
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </Modal>

        <Modal
          title={
            <Title
              level={4}
              style={{
                margin: 0,
                color: isDarkMode ? "#ffffff" : "#1f2937",
                fontWeight: 600,
              }}
            >
              Edit Poem
            </Title>
          }
          open={isEditPoemModalVisible}
          onCancel={handleEditPoemCancel}
          footer={null}
          width={600}
          style={{ top: 20 }}
          bodyStyle={{
            padding: "24px",
            borderRadius: "12px",
            background: isDarkMode ? "#1a1a1a" : "#ffffff",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
          transitionName="ant-fade"
        >
          <div style={{ padding: "8px 0" }}>
            <Form form={editPoemForm} layout="vertical" onFinish={handleEditPoemSubmit}>
              <Form.Item
                name="title"
                label={
                  <Text strong style={{ color: isDarkMode ? "#e5e7eb" : "#1f2937" }}>
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
                  onBlur={(e) => (e.target.style.borderColor = isDarkMode ? "#404040" : "#d1d5db")}
                />
              </Form.Item>
              <Form.Item
                name="content"
                label={
                  <Text strong style={{ color: isDarkMode ? "#e5e7eb" : "#1f2937" }}>
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
                  onBlur={(e) => (e.target.style.borderColor = isDarkMode ? "#404040" : "#d1d5db")}
                />
              </Form.Item>
              <Form.Item
                name="category"
                label={
                  <Text strong style={{ color: isDarkMode ? "#e5e7eb" : "#1f2937" }}>
                    Category
                  </Text>
                }
                rules={[{ required: true, message: "Please select a category" }]}
              >
                <Select
                  placeholder="Select a category"
                  style={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                  dropdownStyle={{
                    borderRadius: "8px",
                    background: isDarkMode ? "#1a1a1a" : "#ffffff",
                  }}
                >
                  <Option value="Classic">Classic</Option>
                  <Option value="Inspirational">Inspirational</Option>
                  <Option value="Love">Love</Option>
                  <Option value="Nature">Nature</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="tags"
                label={
                  <Text strong style={{ color: isDarkMode ? "#e5e7eb" : "#1f2937" }}>
                    Tags
                  </Text>
                }
                rules={[{ required: true, message: "Please add at least one tag" }]}
              >
                <Select
                  mode="tags"
                  placeholder="Add tags (e.g., Nature, Love)"
                  style={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                  dropdownStyle={{
                    borderRadius: "8px",
                    background: isDarkMode ? "#1a1a1a" : "#ffffff",
                  }}
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
                    onClick={handleEditPoemCancel}
                    style={{
                      borderRadius: "8px",
                      padding: "6px 20px",
                      fontSize: "14px",
                      color: isDarkMode ? "#e5e7eb" : "#1f2937",
                      borderColor: isDarkMode ? "#404040" : "#d1d5db",
                      background: "transparent",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#6d28d9";
                      e.currentTarget.style.color = "#6d28d9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = isDarkMode ? "#404040" : "#d1d5db";
                      e.currentTarget.style.color = isDarkMode ? "#e5e7eb" : "#1f2937";
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

        {/* Delete Confirmation Modal */}
        <Modal
          open={isDeleteModalVisible}
          onCancel={handleDeleteCancel}
          footer={null}
          width={400}
          style={{ top: 20 }}
          bodyStyle={{
            padding: "24px",
            borderRadius: "12px",
            background: isDarkMode ? "#1a1a1a" : "#ffffff",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
          transitionName="ant-fade"
        >
          <div style={{ textAlign: "center" }}>
            <ExclamationCircleOutlined
              style={{
                fontSize: "48px",
                color: "#ef4444",
                marginBottom: "16px",
              }}
            />
            <Title
              level={4}
              style={{
                color: isDarkMode ? "#ffffff" : "#1f2937",
                marginBottom: "8px",
              }}
            >
              Are you sure?
            </Title>
            <Text
              style={{
                color: isDarkMode ? "#d1d5db" : "#4b5563",
                display: "block",
                marginBottom: "24px",
              }}
            >
              Do you really want to delete the poem "{poemToDelete?.title}"? This action cannot be undone.
            </Text>
            <Space size="middle">
              <Button
                onClick={handleDeleteCancel}
                style={{
                  borderRadius: "8px",
                  padding: "6px 20px",
                  fontSize: "14px",
                  color: isDarkMode ? "#e5e7eb" : "#1f2937",
                  borderColor: isDarkMode ? "#404040" : "#d1d5db",
                  background: "transparent",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#6d28d9";
                  e.currentTarget.style.color = "#6d28d9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isDarkMode ? "#404040" : "#d1d5db";
                  e.currentTarget.style.color = isDarkMode ? "#e5e7eb" : "#1f2937";
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                style={{
                  borderRadius: "8px",
                  padding: "6px 20px",
                  fontSize: "14px",
                  background: "#ef4444",
                  color: "#ffffff",
                  border: "none",
                  boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Delete
              </Button>
            </Space>
          </div>
        </Modal>
      </Layout>
    </ConfigProvider>
  );
};

export default Profile;