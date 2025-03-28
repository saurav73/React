"use client";

import { Layout, Button, Space } from "antd";

// Custom CSS for the sticky header
const customStyles = `
  .custom-header {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    padding: 0 24px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .custom-header__logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .custom-header__logo h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #1f1f1f;
  }
  .custom-header__actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }
`;

const { Header: AntHeader } = Layout;

const Header = () => {
  return (
    <>
      <style>{customStyles}</style>
      <AntHeader className="custom-header">
        <div className="custom-header__logo">
          {/* Poem Admin Icon - Using a simple book emoji as an example */}
          <span style={{ fontSize: "24px" }}>📖</span>
          <h1>Poem Admin</h1>
        </div>
        <div className="custom-header__actions">
          <Space size="middle">
            {/* Removed notification, setting, and user buttons */}
          </Space>
        </div>
      </AntHeader>
    </>
  );
};

export default Header;