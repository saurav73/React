
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Setting from "./pages/Setting";
import Users from "./pages/User/Users";
import UserAdd from "./pages/User/UserAdd";
import Login from "./pages/auth/Login";
import Layout from "./components/Layout";
import Antlayout from "./components/Antlayout";
import "./assets/css/main.css";
import "./assets/css/user.css";
import "./assets/css/UserAdd.css";
import "./assets/css/login.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Antlayout />} />

        <Route path="/admin" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users title="users" />} />
          <Route path="users/add" element={<UserAdd title="add user" />} />
          <Route path="setting" element={<Setting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
