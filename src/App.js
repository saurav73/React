
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Users/Dashboard";
import Setting from "./pages/Setting";
// import Users from "./pages/Users/Usersbakup";
import UserAdd from "./pages/Users/UserAdd";
import Signup from "./pages/auth/Signup";
import Signin from "./pages/auth/Signin";
import CustomLayout from "./components/Layout";
import Antlayout from "./components/Antlayout";
import "./assets/css/main.css";
import "./assets/css/user.css";
import "./assets/css/UserAdd.css";
import "./assets/css/login.css";
import UserDetails from "./pages/Users/UserDetails";
import { useState } from "react";
import { UserContext } from "./context/user.context";
import Landing from "./pages/Landing";
import { ToastContainer } from "react-toastify";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgetPassword";
import Profile from "./pages/Users/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";  
import Poems from "./pages/admin/Poem";
import Users from "./pages/admin/User";


const App = () => {
  const [_user, _setUser] = useState(() => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Failed to parse user data:", error);
      return null; // Fallback to null if parsing fails
    }
  });
  return (
    <UserContext.Provider value={{_user, _setUser}}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />  
        <Route path="/signin" element= {<Signin/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/users" element={""} >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile/:userId" element={<Profile />} />  
        </Route>
        <Route path="/dashboard"element={<Dashboard/>}/>
        <Route path="/admin" element={<CustomLayout />}>
          <Route path="dashboard" element={<AdminDashboard/>} />
          <Route path="users" element={<Users />} />
          <Route path="users/add" element={<UserAdd />} />
          <Route path="users/edit/:userId" element={<UserAdd />} />
          <Route path="users/details/:userId" element={<UserDetails  />} />
          <Route path="setting" element={<Poems />} />
          <Route path="antdesign" element={<Antlayout />} />
        </Route>
      </Routes>
    </BrowserRouter>
    <ToastContainer />
    </UserContext.Provider>
  );
};

export default App;
