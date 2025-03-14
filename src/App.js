
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Setting from "./pages/Setting";
import Users from "./pages/User/Users";
import UserAdd from "./pages/User/UserAdd";
import Login from "./pages/auth/Login";
import CustomLayout from "./components/Layout";
import Antlayout from "./components/Antlayout";
import "./assets/css/main.css";
import "./assets/css/user.css";
import "./assets/css/UserAdd.css";
import "./assets/css/login.css";
import UserDetails from "./pages/User/UserDetails";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Login />} />
      
        <Route path="/admin" element={<CustomLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users  />} />
          <Route path="users/add" element={<UserAdd />} />
          <Route path="users/details/:userId" element={<UserDetails  />} />
          <Route path="setting" element={<Setting />} />
          <Route path="antdesign" element={<Antlayout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
