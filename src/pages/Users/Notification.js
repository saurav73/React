// Notification.js
import {
  Layout,
  Menu,
  Button,
  Typography,
  Avatar,
  Input,
  Card,
  Tag,
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
} from "antd"
import React, { useState } from 'react'
import { createNotification, deleteNotification, updateNotification } from "../../utils/poem.util"

const Notification = ({ 
  notifications, 
  setNotifications, 
  user, 
  isDarkMode, 
  onShowNotificationModal, 
  onShowEditNotificationModal, 
  onDeleteNotification 
}) => {
  const { Header, Content, Sider, Footer } = Layout
  const { Title, Text, Paragraph } = Typography
  const { TextArea } = Input
  const { Option } = Select

  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false)
  const [isEditNotificationModalVisible, setIsEditNotificationModalVisible] = useState(false)
  const [currentNotification, setCurrentNotification] = useState(null)

  const [notificationForm] = Form.useForm()
  const [editNotificationForm] = Form.useForm()

  // Notification Modal Handlers
  const showNotificationModal = () => {
    setIsNotificationModalVisible(true);
    if (onShowNotificationModal) onShowNotificationModal(); // Notify parent
  };

  const showEditNotificationModal = (notification) => {
    setCurrentNotification(notification);
    editNotificationForm.setFieldsValue({
      message: notification.message,
      timestamp: notification.timestamp,
      read: notification.read,
    });
    setIsEditNotificationModalVisible(true);
    if (onShowEditNotificationModal) onShowEditNotificationModal(notification); // Notify parent
  };

  const handleNotificationCancel = () => {
    setIsNotificationModalVisible(false);
    notificationForm.resetFields();
  };

  const handleEditNotificationCancel = () => {
    setIsEditNotificationModalVisible(false);
    editNotificationForm.resetFields();
    setCurrentNotification(null);
  };

  const handleNotificationSubmit = (values) => {
    if (!user) {
      message.error("User not found. Please log in again.");
      return;
    }

    const newNotification = {
      message: values.message,
      timestamp: values.timestamp || "Just now",
      userId: user.id,
      read: values.read || false,
    };

    createNotification(newNotification)
      .then((data) => {
        setNotifications([data, ...notifications]);
        setIsNotificationModalVisible(false);
        notificationForm.resetFields();
        message.success("Notification created successfully!");
      })
      .catch((error) => {
        console.error("Error creating notification:", error);
        message.error("Failed to create notification");
      });
  };

  const handleEditNotificationSubmit = (values) => {
    if (!currentNotification) return;

    const updatedNotification = {
      ...currentNotification,
      message: values.message,
      timestamp: values.timestamp,
      read: values.read,
    };

    updateNotification(currentNotification.id, updatedNotification)
      .then((data) => {
        setNotifications(notifications.map((notif) => (notif.id === data.id ? data : notif)));
        setIsEditNotificationModalVisible(false);
        editNotificationForm.resetFields();
        setCurrentNotification(null);
        message.success("Notification updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating notification:", error);
        message.error("Failed to update notification");
      });
  };

  const handleDeleteNotification = (id) => {
    deleteNotification(id)
      .then(() => {
        setNotifications(notifications.filter((notif) => notif.id !== id));
        message.success("Notification deleted successfully!");
        if (onDeleteNotification) onDeleteNotification(id); // Notify parent
      })
      .catch((error) => {
        console.error("Error deleting notification:", error);
        message.error("Failed to delete notification");
      });
  };

  return (
    <>
      {/* New Notification Modal */}
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
          background: isDarkMode ? "#1f2937" : "#ffffff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }}
        transitionName="ant-fade"
      >
        <div style={{ maxHeight: "70vh", overflowY: "auto", padding: "8px 0" }}>
          <Form form={notificationForm} layout="vertical" onFinish={handleNotificationSubmit}>
            <Form.Item
              name="message"
              label={
                <Text strong style={{ color: isDarkMode ? "#e5e7eb" : "#1f2937" }}>
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
                onBlur={(e) => (e.target.style.borderColor = isDarkMode ? "#4b5563" : "#d1d5db")}
              />
            </Form.Item>

            <Form.Item
              name="timestamp"
              label={
                <Text strong style={{ color: isDarkMode ? "#e5e7eb" : "#1f2937" }}>
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
                onBlur={(e) => (e.target.style.borderColor = isDarkMode ? "#4b5563" : "#d1d5db")}
              />
            </Form.Item>

            <Form.Item
              name="read"
              label={
                <Text strong style={{ color: isDarkMode ? "#e5e7eb" : "#1f2937" }}>
                  Read Status
                </Text>
              }
              valuePropName="checked"
            >
              <Checkbox>Mark as Read</Checkbox>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
              <Space size="middle">
                <Button
                  onClick={handleNotificationCancel}
                  style={{
                    borderRadius: "8px",
                    padding: "6px 20px",
                    fontSize: "14px",
                    color: isDarkMode ? "#e5e7eb" : "#1f2937",
                    borderColor: isDarkMode ? "#4b5563" : "#d1d5db",
                    background: "transparent",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#6d28d9";
                    e.currentTarget.style.color = "#6d28d9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isDarkMode ? "#4b5563" : "#d1d5db";
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
                  Create Notification
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* Edit Notification Modal */}
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
          background: isDarkMode ? "#1f2937" : "#ffffff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }}
        transitionName="ant-fade"
      >
        <div style={{ maxHeight: "70vh", overflowY: "auto", padding: "8px 0" }}>
          <Form form={editNotificationForm} layout="vertical" onFinish={handleEditNotificationSubmit}>
            <Form.Item
              name="message"
              label={
                <Text strong style={{ color: isDarkMode ? "#e5e7eb" : "#1f2937" }}>
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
                onBlur={(e) => (e.target.style.borderColor = isDarkMode ? "#4b5563" : "#d1d5db")}
              />
            </Form.Item>

            <Form.Item
              name="timestamp"
              label={
                <Text strong style={{ color: isDarkMode ? "#e5e7eb" : "#1f2937" }}>
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
                onBlur={(e) => (e.target.style.borderColor = isDarkMode ? "#4b5563" : "#d1d5db")}
              />
            </Form.Item>

            <Form.Item
              name="read"
              label={
                <Text strong style={{ color: isDarkMode ? "#e5e7eb" : "#1f2937" }}>
                  Read Status
                </Text>
              }
              valuePropName="checked"
            >
              <Checkbox>Mark as Read</Checkbox>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
              <Space size="middle">
                <Button
                  onClick={handleEditNotificationCancel}
                  style={{
                    borderRadius: "8px",
                    padding: "6px 20px",
                    fontSize: "14px",
                    color: isDarkMode ? "#e5e7eb" : "#1f2937",
                    borderColor: isDarkMode ? "#4b5563" : "#d1d5db",
                    background: "transparent",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#6d28d9";
                    e.currentTarget.style.color = "#6d28d9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isDarkMode ? "#4b5563" : "#d1d5db";
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
                  Update Notification
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  )
}

export default Notification;