import { Button } from "antd"
import { MoonOutlined, SunOutlined } from "@ant-design/icons"

const ThemeToggle = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <Button
      type="text"
      icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
      onClick={toggleDarkMode}
      style={{
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        background: isDarkMode ? "#f9d71c" : "#2c2c2c",
        color: isDarkMode ? "#2c2c2c" : "#fff",
      }}
    />
  )
}

export default ThemeToggle