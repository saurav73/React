import "./assets/css/main.css";
import "./assets/css/user.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/User/Users";
import Setting from "./pages/Setting";

const App = () => {
  return (
    <BrowserRouter>
      <Header />

      <div className="v-row container">
        <Sidebar />
        <div className="v-col content">
          
          <Routes>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/users" element={<Users title="users"/>} />
            <Route path="/admin/setting" element={<Setting />} />
          </Routes>
        </div>
      </div>

      <Footer />
    </BrowserRouter>
  );
};

export default App;
