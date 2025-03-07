import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router'; 
import login from '../../assets/image/login.gif';


const Login = () => {
  const [user, setUser] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleusernameChange = (e) => {
    setUser({ ...user, username: e.target.value });
  }
  const handlePasswordChange = (e) => {
    setUser({ ...user, password: e.target.value });
  }
  const handleButtonClick = () => {
    console.log(user);
    console.log(user.username , user.password);
    console.log("button clicked")
    if(user.username ==="admin" && user.password === "admin"){
       localStorage.setItem("is_login", "1");
      navigate("/admin/dashboard");
     alert("Login success");
    }
    else{
      localStorage.setItem("is_login", "0");
      setError("Invalid Username or Password");
      }
    }

  return (
    <div className="login-container">
        <img src={login} alt="Logo" />
        <h1>Login</h1>
        <form>
          <label style={{display: "block", marginBottom: "10px" , color: "red"}}>{error}</label>
            <label>username</label>
            <input type="username" placeholder="Enter your username" value={user.username} onChange={handleusernameChange}/>
            <label>Password</label>
            <input type="password" placeholder="Enter your password" value={user.password} onChange={handlePasswordChange} />
            <button type="button" onClick={handleButtonClick}>Submit</button>
        </form>
    </div>
  )
}

export default Login;
