import "./assets/css/main.css";
import "./assets/css/user.css";
import "./assets/css/UserAdd.css";
import "./assets/css/login.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/User/Users";
import Setting from "./pages/Setting";
import UserAdd from "./pages/User/UserAdd";
import Login from "./pages/auth/Login";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={
            <>
              <Header />
              <div className="v-row container">
                <Sidebar />
                <div className="v-col content">
                  <Routes>
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                    <Route path="/admin/users" element={<Users title="users" />}/>
                    <Route path="/admin/users/add"element={<UserAdd title="add user" />}/>
                    <Route path="/admin/setting" element={<Setting />} />
                  </Routes>
                </div>
              </div>
              <Footer />
            </>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
