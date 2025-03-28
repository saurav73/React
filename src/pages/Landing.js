"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layout,
  Menu,
  Button,
  Card,
  Tabs,
  Typography,
  Row,
  Col,
  Space,
  ConfigProvider,
  theme as antTheme,
  FloatButton,
  Tag,
  Image,
  Tooltip,
} from "antd";
import {
  BookOutlined,
  HeartOutlined,
  HeartFilled,
  ArrowRightOutlined,
  MenuOutlined,
  CloseOutlined,
  MoonOutlined,
  SunOutlined,
  LeftOutlined,
  RightOutlined,
  UserOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  EyeOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

export default function PoemSansarLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePoem, setActivePoem] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [likedPoems, setLikedPoems] = useState({});
  const [activeCategory, setActiveCategory] = useState("classic");
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [visiblePoems, setVisiblePoems] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check for user's preferred color scheme on initial load
  useEffect(() => {
    const prefersDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDarkMode);

    // Add listener for changes to color scheme preference
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleDarkModeChange = (e) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener("change", handleDarkModeChange);

    return () => darkModeMediaQuery.removeEventListener("change", handleDarkModeChange);
  }, []);

  useEffect(() => {
    // Apply dark class to body when dark mode is active
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleLike = (poemId) => setLikedPoems((prev) => ({ ...prev, [poemId]: !prev[poemId] }));
  const togglePoemVisibility = (poemId) => setVisiblePoems((prev) => ({ ...prev, [poemId]: !prev[poemId] }));

  const poems = [
    {
      id: 1,
      title: "The Road Not Taken",
      author: "Robert Frost",
      previewText: "Two roads diverged in a yellow wood...",
      fullText: "Two roads diverged in a yellow wood,\nAnd sorry I could not travel both...",
      likes: 245,
      category: "Classic",
      tags: ["Nature", "Life Choices"],
      image: "https://via.placeholder.com/300x200?text=Road+Not+Taken",
    },
    {
      id: 2,
      title: "Fire and Ice",
      author: "Robert Frost",
      previewText: "Some say the world will end in fire...",
      fullText: "Some say the world will end in fire,\nSome say in ice...",
      likes: 189,
      category: "Classic",
      tags: ["Apocalypse", "Desire"],
      image: "https://via.placeholder.com/300x200?text=Fire+and+Ice",
    },
    {
      id: 3,
      title: "Hope is the thing with feathers",
      author: "Emily Dickinson",
      previewText: '"Hope" is the thing with feathers...',
      fullText: '"Hope" is the thing with feathers -\nThat perches in the soul -...',
      likes: 312,
      category: "Inspirational",
      tags: ["Hope", "Resilience"],
      image: "https://via.placeholder.com/300x200?text=Hope+Feathers",
    },
    {
      id: 4,
      title: "Dreams",
      author: "Langston Hughes",
      previewText: "Hold fast to dreams...",
      fullText: "Hold fast to dreams\nFor if dreams die...",
      likes: 276,
      category: "Inspirational",
      tags: ["Dreams", "Aspiration"],
      image: "https://via.placeholder.com/300x200?text=Dreams",
    },
    {
      id: 5,
      title: "Sonnet 18",
      author: "William Shakespeare",
      previewText: "Shall I compare thee to a summer's day?...",
      fullText: "Shall I compare thee to a summer's day?\nThou art more lovely and more temperate...",
      likes: 423,
      category: "Love",
      tags: ["Romance", "Beauty"],
      image: "https://via.placeholder.com/300x200?text=Sonnet+18",
    },
  ];

  const categories = [
    { id: "classic", name: "Classic", icon: <BookOutlined /> },
    { id: "inspirational", name: "Inspirational", icon: <UserOutlined /> },
    { id: "love", name: "Love", icon: <HeartOutlined /> },
  ];

  const menuItems = [
    { key: "home", label: "Home", path: "/" },
    { key: "featured", label: "Featured", path: "/#featured" },
    { key: "explore", label: "Explore", path: "/#explore" },
    { key: "contact", label: "Contact", path: "/#contact" },
  ];

  const { defaultAlgorithm, darkAlgorithm } = antTheme;
  const customTheme = {
    token: { colorPrimary: "#722ed1", borderRadius: 12, fontFamily: "Inter, sans-serif", fontSize: 16 },
    components: {
      Layout: {
        bodyBg: isDarkMode ? "#1a1a1a" : "#fff",
        headerBg: isDarkMode ? "#2c2c2c" : "#fff",
        footerBg: isDarkMode ? "#2c2c2c" : "#fafafa",
      },
      Card: { colorBgContainer: isDarkMode ? "#2c2c2c" : "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
      Menu: {
        itemColor: isDarkMode ? "#e0e0e0" : "#333",
        itemHoverColor: "#722ed1",
        itemSelectedColor: "#fff",
        itemSelectedBg: "#722ed1",
        horizontalItemSelectedColor: "#722ed1",
      },
      Button: {
        colorText: "#fff",
        colorBgContainer: "#722ed1",
        ghostColor: "#fff",
        ghostBorderColor: "rgba(255,255,255,0.7)",
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };
  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };
  const getPoemsByCategory = (categoryId) =>
    poems.filter((poem) => poem.category.toLowerCase() === categoryId.toLowerCase());
  const isMobile = windowWidth < 768;

  return (
    <ConfigProvider theme={{ algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm, ...customTheme }}>
      <Layout className="min-h-screen">
        {/* Navbar */}
        <Header
          style={{
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 1000,
            padding: isMobile ? "0 16px" : "0 40px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Row align="middle" justify="space-between" style={{ height: "100%" }}>
            <Col>
              <Space align="center">
                <BookOutlined style={{ fontSize: "28px", color: "#722ed1" }} />
                <Title
                  level={3}
                  style={{ margin: 0, color: isDarkMode ? "#fff" : "#333", fontSize: isMobile ? "20px" : "24px" }}
                >
                  Poem Sansar
                </Title>
              </Space>
            </Col>
            {!isMobile && (
              <Col flex="auto">
                <Menu
                  mode="horizontal"
                  items={menuItems.map((item) => ({
                    key: item.key,
                    label: <Link to={item.path}>{item.label}</Link>,
                  }))}
                  selectedKeys={[
                    menuItems.find((item) => item.path === location.pathname + location.hash)?.key || "home",
                  ]}
                  style={{ border: "none", background: "transparent", justifyContent: "center", fontSize: "16px" }}
                />
              </Col>
            )}
            <Col>
              <Space size="middle">
                {/* Removed Dark Mode Toggle Button from Navbar */}
                {!isMobile && (
                  <Button type="primary" icon={<UserOutlined />} onClick={() => navigate("/signin")}>
                    Sign In
                  </Button>
                )}
                {isMobile && (
                  <Button
                    type="text"
                    icon={isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  />
                )}
              </Space>
            </Col>
          </Row>
        </Header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && isMobile && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{
                background: isDarkMode ? "#2c2c2c" : "#fff",
                position: "fixed",
                top: "64px",
                width: "100%",
                zIndex: 999,
              }}
            >
              <Menu
                mode="vertical"
                items={menuItems.map((item) => ({ key: item.key, label: <Link to={item.path}>{item.label}</Link> }))}
                selectedKeys={[
                  menuItems.find((item) => item.path === location.pathname + location.hash)?.key || "home",
                ]}
                style={{ border: "none", padding: "16px" }}
              />
              <div style={{ display: "flex", gap: "10px", padding: "16px" }}>
                {/* Removed Dark Mode Toggle Button from Mobile Menu */}
                <Button type="primary" block icon={<UserOutlined />} onClick={() => navigate("/signin")}>
                  Sign In
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Content style={{ marginTop: "64px" }}>
          {/* Hero Section with Background Image and Poem */}
          <section
            style={{
              padding: isMobile ? "60px 16px" : "120px 40px",
              textAlign: "center",
              backgroundImage: `url("https://plus.unsplash.com/premium_photo-1672116453000-c31b150f48ef?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              minHeight: "600px",
            }}
          >
            {/* Gradient Overlay for readability */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: isDarkMode
                  ? "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3))"
                  : "linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0.3))",
                zIndex: 1,
              }}
            />
            <Row gutter={[32, 32]} align="middle" style={{ position: "relative", zIndex: 2, minHeight: "100%" }}>
              {/* Left Side: Title, Description, Buttons */}
              <Col xs={24} lg={12} style={{ textAlign: isMobile ? "center" : "left" }}>
                <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                  <Title
                    style={{
                      fontSize: isMobile ? "32px" : "48px",
                      fontWeight: 700,
                      color: isDarkMode ? "#fff" : "#333",
                      textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    Discover the Art of <span style={{ color: "#722ed1" }}>Poetry</span>
                  </Title>
                  <Paragraph
                    style={{
                      fontSize: isMobile ? "16px" : "18px",
                      maxWidth: "600px",
                      margin: isMobile ? "20px auto" : "20px 0",
                      color: isDarkMode ? "#e0e0e0" : "#666",
                      textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                    }}
                  >
                    Immerse yourself in a world of verses, from timeless classics to modern masterpieces.
                  </Paragraph>
                  <Space size="large" wrap>
                    <Button
                      type="primary"
                      size="large"
                      icon={<ArrowRightOutlined />}
                      onClick={() => navigate("/#explore")}
                      style={{
                        background: "#722ed1",
                        border: "none",
                        fontWeight: "bold",
                        transition: "all 0.3s ease",
                        boxShadow: "0 0 15px rgba(114, 46, 209, 0.5)",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.05)";
                        e.target.style.boxShadow = "0 0 20px rgba(114, 46, 209, 0.8)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                        e.target.style.boxShadow = "0 0 15px rgba(114, 46, 209, 0.5)";
                      }}
                    >
                      Explore Now
                    </Button>
                    <Button
                      size="large"
                      style={{
                        background: "transparent",
                        color: isDarkMode ? "#fff" : "#722ed1",
                        borderColor: isDarkMode ? "#fff" : "#722ed1",
                        fontWeight: "bold",
                        transition: "all 0.3s ease",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(114,46,209,0.1)";
                        e.target.style.transform = "scale(1.05)";
                        e.target.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "transparent";
                        e.target.style.transform = "scale(1)";
                        e.target.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
                      }}
                    >
                      Submit Your Poem
                    </Button>
                  </Space>
                </motion.div>
              </Col>

              {/* Right Side: Poem Card */}
              <Col xs={24} lg={12} style={{ display: "flex", justifyContent: isMobile ? "center" : "flex-end" }}>
                <motion.div initial="hidden" animate="visible" variants={fadeInRight}>
                  <Card
                    style={{
                      maxWidth: "400px",
                      background: isDarkMode ? "rgba(44, 44, 44, 0.9)" : "rgba(255, 245, 200, 0.9)",
                      borderRadius: "16px",
                      border: "2px solid #722ed1",
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                      padding: "20px",
                      textAlign: "center",
                    }}
                  >
                    <Title
                      level={4}
                      style={{
                        color: isDarkMode ? "#fff" : "#333",
                        fontFamily: "'Playfair Display', serif",
                        marginBottom: "16px",
                      }}
                    >
                      Begin with Verse
                    </Title>
                    <Paragraph
                      style={{
                        fontSize: "16px",
                        fontStyle: "italic",
                        color: isDarkMode ? "#e0e0e0" : "#555",
                        fontFamily: "'Georgia', serif",
                        whiteSpace: "pre-line",
                        marginBottom: "16px",
                      }}
                    >
                      Welcome, dear poet, to our sacred space, Where words weave magic in a warm embrace. Let your heart
                      sing, let your verses bloom, In Poem Sansar, find your poetic home.
                    </Paragraph>
                    <Text type="secondary" style={{ fontSize: "14px", color: isDarkMode ? "#b0b0b0" : "#777" }}>
                      — The Poem Sansar Team
                    </Text>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </section>

          {/* Featured Poems */}
          <section id="featured" style={{ padding: isMobile ? "40px 16px" : "60px 40px" }}>
            <Title
              level={2}
              style={{
                textAlign: "center",
                fontSize: isMobile ? "28px" : "36px",
                marginBottom: "20px", // Reduced margin
                color: isDarkMode ? "#fff" : "#333",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Featured Poems
            </Title>

            <div
              style={{
                maxWidth: "800px",
                margin: "0 auto 20px auto", // Reduced margin
                textAlign: "center",
              }}
            >
              <Tabs
                activeKey={activeCategory}
                centered
                size="large"
                onChange={setActiveCategory}
                tabBarStyle={{
                  borderBottom: "none",
                  marginBottom: "15px", // Reduced margin
                  display: "inline-flex",
                  justifyContent: "center",
                }}
                tabBarGutter={20} // Reduced gap between tabs
              >
                {categories.map((category) => (
                  <TabPane
                    tab={
                      <span
                        style={{
                          fontSize: "16px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "0 8px", // Reduced padding
                        }}
                      >
                        {category.icon} {category.name}
                      </span>
                    }
                    key={category.id}
                  />
                ))}
              </Tabs>
            </div>

            <Row gutter={[16, 16]} justify="center"> {/* Reduced gutter from [32, 32] to [16, 16] */}
              {getPoemsByCategory(activeCategory).map((poem) => (
                <Col xs={24} md={12} lg={8} key={poem.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card
                      hoverable
                      style={{
                        borderRadius: "12px",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        background: isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)",
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                        border: `1px solid ${isDarkMode ? "#3a3a3a" : "#eaeaea"}`,
                        overflow: "hidden",
                        position: "relative",
                      }}
                      bodyStyle={{
                        padding: "16px", // Reduced padding
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* Decorative accent line at top of card */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "4px",
                          background: "linear-gradient(90deg, #722ed1, #a855f7)",
                        }}
                      />

                      <div style={{ flex: 1 }}>
                        <Title
                          level={4}
                          style={{
                            marginBottom: "6px", // Reduced margin
                            color: isDarkMode ? "#fff" : "#333",
                            fontFamily: "'Playfair Display', serif",
                          }}
                        >
                          {poem.title}
                        </Title>

                        <Text
                          type="secondary"
                          style={{
                            display: "block",
                            marginBottom: "12px", // Reduced margin
                            fontStyle: "italic",
                            fontSize: "14px",
                          }}
                        >
                          By {poem.author}
                        </Text>

                        <Paragraph
                          style={{
                            margin: "0 0 12px 0", // Reduced margin
                            whiteSpace: "pre-line",
                            color: isDarkMode ? "#d9d9d9" : "#666",
                            fontFamily: "'Georgia', serif",
                            fontSize: "15px",
                            lineHeight: "1.6",
                            flex: 1,
                            position: "relative",
                            overflow: "hidden",
                            maxHeight: visiblePoems[poem.id] ? "none" : "80px",
                          }}
                        >
                          {visiblePoems[poem.id] ? poem.fullText : poem.previewText}

                          {!visiblePoems[poem.id] && (
                            <div
                              style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: "40px",
                                background: `linear-gradient(to bottom, transparent, ${isDarkMode ? "rgba(44, 44, 44, 0.9)" : "rgba(255, 255, 255, 0.9)"})`,
                              }}
                            />
                          )}
                        </Paragraph>
                      </div>

                      <Space wrap style={{ marginBottom: "12px" }}> {/* Reduced margin */}
                        {poem.tags.map((tag) => (
                          <Tag
                            key={tag}
                            style={{
                              borderRadius: "12px",
                              padding: "2px 8px", // Reduced padding
                              background: isDarkMode ? "rgba(114, 46, 209, 0.2)" : "rgba(114, 46, 209, 0.1)",
                              border: "1px solid #722ed1",
                              color: isDarkMode ? "#d9b6ff" : "#722ed1",
                            }}
                          >
                            {tag}
                          </Tag>
                        ))}
                      </Space>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "auto",
                          paddingTop: "12px", // Reduced padding
                          borderTop: `1px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"}`,
                        }}
                      >
                        <Button
                          type="text"
                          icon={<EyeOutlined />}
                          onClick={() => togglePoemVisibility(poem.id)}
                          style={{
                            color: "#722ed1",
                            padding: "4px 0",
                            fontWeight: "500",
                          }}
                        >
                          {visiblePoems[poem.id] ? "Show Less" : "Read More"}
                        </Button>

                        <Button
                          type="text"
                          icon={likedPoems[poem.id] ? <HeartFilled style={{ color: "#f5222d" }} /> : <HeartOutlined />}
                          onClick={() => toggleLike(poem.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            color: isDarkMode ? "#d9d9d9" : "#666",
                          }}
                        >
                          {likedPoems[poem.id] ? poem.likes + 1 : poem.likes}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>

            {getPoemsByCategory(activeCategory).length === 0 && (
              <div style={{ textAlign: "center", padding: "20px 0" }}> {/* Reduced padding */}
                <Text type="secondary" style={{ fontSize: "16px" }}>
                  No poems found in this category.
                </Text>
              </div>
            )}

            <div style={{ textAlign: "center", marginTop: "20px" }}> {/* Reduced margin */}
              <Button
                type="primary"
                size="large"
                style={{
                  background: "linear-gradient(90deg, #722ed1, #a855f7)",
                  border: "none",
                  boxShadow: "0 4px 15px rgba(114, 46, 209, 0.3)",
                  padding: "0 30px",
                  height: "44px",
                  borderRadius: "22px",
                  fontWeight: "500",
                }}
              >
                View All Poems
              </Button>
            </div>
          </section>

          {/* Explore Section */}
          <section
            id="explore"
            style={{ padding: isMobile ? "40px 16px" : "60px 40px", background: isDarkMode ? "#1a1a1a" : "#f9f9f9" }}
          >
            <Title
              level={2}
              style={{
                textAlign: "center",
                fontSize: isMobile ? "28px" : "36px",
                marginBottom: "20px", // Reduced margin
                color: isDarkMode ? "#fff" : "#333",
              }}
            >
              Experience Poetry
            </Title>
            <Row gutter={[16, 16]} align="middle"> {/* Reduced gutter */}
              <Col xs={24} lg={12}>
                <Image
                  src={poems[activePoem].image || "/placeholder.svg"}
                  alt={poems[activePoem].title}
                  style={{ borderRadius: "12px", width: "100%", maxHeight: "350px", objectFit: "cover" }}
                />
              </Col>
              <Col xs={24} lg={12}>
                <Card style={{ borderRadius: "12px", padding: "16px", background: isDarkMode ? "#2c2c2c" : "#fff" }}> {/* Reduced padding */}
                  <motion.div
                    key={activePoem}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Title level={3} style={{ color: isDarkMode ? "#fff" : "#333" }}>
                      {poems[activePoem].title}
                    </Title>
                    <Text type="secondary">By {poems[activePoem].author}</Text>
                    <Paragraph style={{ marginTop: "12px", color: isDarkMode ? "#d9d9d9" : "#666" }}> {/* Reduced margin */}
                      {poems[activePoem].fullText}
                    </Paragraph>
                  </motion.div>
                  <Space style={{ marginTop: "16px" }}> {/* Reduced margin */}
                    <Button
                      shape="circle"
                      icon={<LeftOutlined />}
                      onClick={() => setActivePoem((prev) => (prev === 0 ? poems.length - 1 : prev - 1))}
                    />
                    <Button
                      shape="circle"
                      icon={<RightOutlined />}
                      onClick={() => setActivePoem((prev) => (prev === poems.length - 1 ? 0 : prev + 1))}
                    />
                  </Space>
                </Card>
              </Col>
            </Row>
          </section>

          {/* Community Call-to-Action */}
          <section
            style={{
              padding: isMobile ? "40px 16px" : "60px 40px", // Reduced padding
              background: "#722ed1",
              color: "#fff",
              textAlign: "center",
            }}
          >
            <Title level={2} style={{ color: "#fff", fontSize: isMobile ? "28px" : "36px" }}>
              Join Our Poetry Community
            </Title>
            <Paragraph style={{ color: "rgba(255,255,255,0.9)", maxWidth: "600px", margin: "16px auto" }}> {/* Reduced margin */}
              Share your verses, connect with fellow poets, and inspire the world.
            </Paragraph>
            <Button
              size="large"
              type="primary"
              onClick={() => navigate("/signup")}
              style={{
                background: "#fff",
                color: "#722ed1",
                border: "none",
                fontWeight: "bold",
                transition: "all 0.3s ease",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#f0f0f0";
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#fff";
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
              }}
            >
              Sign Up Now
            </Button>
          </section>
        </Content>

        {/* Footer with Contact Details */}
        <Footer id="contact" style={{ padding: isMobile ? "30px 16px" : "40px 40px" }}> {/* Reduced padding */}
          <Row gutter={[16, 16]}> {/* Reduced gutter */}
            <Col xs={24} md={8}>
              <Space align="center">
                <BookOutlined style={{ fontSize: "24px", color: "#722ed1" }} />
                <Title level={4} style={{ margin: 0, color: isDarkMode ? "#fff" : "#333" }}>
                  Poem Sansar
                </Title>
              </Space>
              <Paragraph type="secondary" style={{ marginTop: "12px" }}> {/* Reduced margin */}
                A sanctuary for poetry lovers to explore, create, and connect.
              </Paragraph>
            </Col>
            <Col xs={12} md={4}>
              <Title level={5} style={{ color: isDarkMode ? "#fff" : "#333" }}>
                Explore
              </Title>
              <Menu mode="vertical" style={{ border: "none", background: "transparent" }}>
                {menuItems.slice(1).map((item) => (
                  <Menu.Item key={item.key}>
                    <Link to={item.path}>{item.label}</Link>
                  </Menu.Item>
                ))}
              </Menu>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5} style={{ color: isDarkMode ? "#fff" : "#333" }}>
                Contact Us
              </Title>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Text style={{ color: isDarkMode ? "#e0e0e0" : "#666" }}>
                  <MailOutlined style={{ marginRight: "8px", color: "#722ed1" }} />
                  Email:{" "}
                  <a href="mailto:support@poemsansar.com" style={{ color: "#722ed1" }}>
                    support@poemsansar.com
                  </a>
                </Text>
                <Text style={{ color: isDarkMode ? "#e0e0e0" : "#666" }}>
                  <BookOutlined style={{ marginRight: "8px", color: "#722ed1" }} />
                  Phone:{" "}
                  <a href="tel:+1234567890" style={{ color: "#722ed1" }}>
                    +1 (234) 567-890
                  </a>
                </Text>
                <Space size="middle">
                  <Button type="text" shape="circle" icon={<FacebookOutlined />} style={{ color: "#722ed1" }} />
                  <Button type="text" shape="circle" icon={<TwitterOutlined />} style={{ color: "#722ed1" }} />
                  <Button type="text" shape="circle" icon={<InstagramOutlined />} style={{ color: "#722ed1" }} />
                  <Button type="text" shape="circle" icon={<LinkedinOutlined />} style={{ color: "#722ed1" }} />
                </Space>
              </Space>
              <Text type="secondary" style={{ display: "block", marginTop: "12px" }}> {/* Reduced margin */}
                © {new Date().getFullYear()} Poem Sansar. All rights reserved.
              </Text>
            </Col>
          </Row>
        </Footer>

        {/* Floating Theme Toggle Button */}
        <FloatButton
          icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleDarkMode}
          tooltip={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{
            right: 24,
            bottom: 80,
            width: 50,
            height: 50,
            background: isDarkMode ? "#f9d71c" : "#2c2c2c",
            color: isDarkMode ? "#2c2c2c" : "#fff",
            border: "none",
            boxShadow: isDarkMode ? "0 0 10px rgba(249, 215, 28, 0.6)" : "0 0 10px rgba(0, 0, 0, 0.3)",
            zIndex: 1000,
          }}
        />

        <FloatButton.BackTop />
      </Layout>
    </ConfigProvider>
  );
}