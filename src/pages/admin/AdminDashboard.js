import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Button,
  Typography,
  Divider,
  Progress,
  List,
  Avatar,
  Space,
  Empty,
  Spin,
  message,
} from "antd";
import {
  UserOutlined,
  BookOutlined,
  HeartOutlined,
  EyeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { getPoems } from "../../utils/poem.util";
import axios from "axios";
import Header from "../../components/Header";

const { Title, Text } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPoems: 0,
    totalLikes: 0,
    totalCategories: 0,
  });
  const [recentPoems, setRecentPoems] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch poems
        const poemsData = await getPoems();
        
        // Fetch users
        const usersResponse = await axios.get('http://localhost:4000/users');
        const usersData = usersResponse.data;
        
        // Calculate statistics
        const totalLikes = poemsData.reduce((sum, poem) => sum + (poem.likes || 0), 0);
        
        // Get unique categories and count poems in each
        const categories = {};
        poemsData.forEach(poem => {
          if (poem.category) {
            categories[poem.category] = (categories[poem.category] || 0) + 1;
          }
        });
        
        // Format category data for display
        const categoryStats = Object.entries(categories).map(([name, count]) => ({
          name,
          value: Math.round((count / poemsData.length) * 100)
        }));
        
        // Sort poems by timestamp (assuming most recent first)
        const sortedPoems = [...poemsData].sort((a, b) => {
          if (a.timestamp === "Just now") return -1;
          if (b.timestamp === "Just now") return 1;
          return 0; // Simple sorting, could be improved with actual date parsing
        });
        
        // Get active users based on poem count
        const userPoemCounts = {};
        poemsData.forEach(poem => {
          if (poem.author) {
            userPoemCounts[poem.author] = (userPoemCounts[poem.author] || 0) + 1;
          }
        });
        
        const activeUsersList = Object.entries(userPoemCounts)
          .map(([name, poemCount]) => {
            // Find user avatar if available
            const userPoem = poemsData.find(poem => poem.author === name);
            return {
              id: name,
              name: name,
              avatar: userPoem?.authorAvatar || `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 50)}.jpg`,
              poemCount: poemCount,
              lastActive: "Recently active"
            };
          })
          .sort((a, b) => b.poemCount - a.poemCount)
          .slice(0, 5);
        
        // Update state with all the data
        setStats({
          totalUsers: usersData.length,
          totalPoems: poemsData.length,
          totalLikes: totalLikes,
          totalCategories: Object.keys(categories).length
        });
        
        setRecentPoems(sortedPoems.slice(0, 5));
        setActiveUsers(activeUsersList);
        setCategoryData(categoryStats);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        message.error("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => {
        let color = "green";
        if (category === "Love") {
          color = "pink";
        } else if (category === "Inspirational") {
          color = "blue";
        } else if (category === "Classic") {
          color = "purple";
        }
        return <Tag color={color}>{category}</Tag>;
      },
    },
    {
      title: "Likes",
      dataIndex: "likes",
      key: "likes",
      render: (likes) => <span><HeartOutlined style={{ color: "#ff4d4f" }} /> {likes}</span>,
    },
    {
      title: "Created",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (date) => <span><CalendarOutlined /> {date}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small">View</Button>
          <Button type="link" size="small">Edit</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
    <Header />
    <div className="dashboard-container">
     
      <Title level={2}>Dashboard</Title>
      <Text type="secondary">Welcome to the admin dashboard. Here's an overview of your platform.</Text>
      
      <Divider />
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Poems"
              value={stats.totalPoems}
              prefix={<BookOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Likes"
              value={stats.totalLikes}
              prefix={<HeartOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Categories"
              value={stats.totalCategories}
              prefix={<EyeOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card 
            title="Recent Poems" 
            extra={<Button type="link">View All</Button>}
            loading={loading}
          >
            {recentPoems.length > 0 ? (
              <Table 
                dataSource={recentPoems} 
                columns={columns} 
                rowKey="id"
                pagination={false}
                size="middle"
              />
            ) : (
              <Empty description="No poems found" />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title="Categories Distribution" 
            loading={loading}
          >
            {categoryData.length > 0 ? (
              categoryData.map(item => (
                <div key={item.name} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>{item.name}</Text>
                    <Text>{item.value}%</Text>
                  </div>
                  <Progress 
                    percent={item.value} 
                    showInfo={false} 
                    strokeColor={
                      item.name === "Nature" ? "#52c41a" :
                      item.name === "Love" ? "#ff4d4f" :
                      item.name === "Inspirational" ? "#1890ff" :
                      item.name === "Classic" ? "#722ed1" : "#faad14"
                    }
                  />
                </div>
              ))
            ) : (
              <Empty description="No category data available" />
            )}
          </Card>
          
          <Card 
            title="Active Users" 
            style={{ marginTop: 16 }}
            loading={loading}
          >
            {activeUsers.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={activeUsers}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={item.avatar} />}
                      title={<a>{item.name}</a>}
                      description={`${item.poemCount} poems • ${item.lastActive}`}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No active users found" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
    </>
  );
};

export default Dashboard;
