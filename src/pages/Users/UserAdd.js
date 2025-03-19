import React, { useEffect, useState } from "react";
import "../../assets/css/user.css"; // Ensure this path is correct
import { useNavigate, useParams } from "react-router";
import axios from "axios";

const UserAdd = () => {
    let param = useParams();
    const navigate = useNavigate();
  const [users, setUser] = useState({
    firstName: "",
    lastname: "",
    age: 0,
    email: "",
    phone: "",
    address: "",
    role: ""
  });
  const [error, setError] = useState({
    firstName: "",
    lastname: "",
    age: "",
    email: "",
    phone: "",
    address: "",
    role: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...users, [name]: value });
    setError({ ...error, [name]: "" });
  };

  const handleError = (e) => {
    e.preventDefault();

    let hasError = false;
    let newError = { name: "", age: "", email: "", phone: "", address: "", role: "" };

    if (!users.name) {
      newError.name = "Please enter your name";
      hasError = true;
    }
    if (!users.age) {
      newError.age = "Please enter your age";
      hasError = true;
    }
    if (!users.email) {
      newError.email = "Please enter your email";
      hasError = true;
    }
    if (!users.phone) {
      newError.phone = "Please enter your phone number";
      hasError = true;
    }
    if (!users.address) {
      newError.address = "Please enter your address";
      hasError = true;
    }
    if (!users.role) {
      newError.role = "Please enter your role";
      hasError = true;
    }

    setError(newError);

    if (!hasError) {
      alert("users profile created successfully!");
      console.log(users);
      setUser({
        name: "",
        age: 0,
        email: "",
        phone: "",
        address: "",
        role: ""
      });
      setError({
        name: "",
        age: "",
        email: "",
        phone: "",
        address: "",
        role: ""
      });
    }

    if(!param.userId){
      axios.post('http://localhost:4000/users', users)
      .then(response => {
        
        navigate("/admin/users");
        console.log(response);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
      
    }else{
      axios.patch(`http://localhost:4000/users/${param.userId}`, users)
      .then(response => {
        
        navigate("/admin/users");
        console.log(response);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
      }
  };




    useEffect(() => {
      axios.get(`http://localhost:4000/users/${param.userId}`)
        .then(response => {
          setUser(response.data);
          console.log(response);
        })
        .catch(error => {
          console.error("There was an error fetching the data!", error);
        });
    }, []);

  return (
    <div className="users-add-form">
      <h3>{!param.userId ? "Create New users":"Edit"} Profile</h3>
      <form >
        <div className="form-group">
          <label htmlFor="name"><i className="fas fa-users"></i> Full Name:</label>
          <input type="text" id="firstName" name="firstName" value={users.firstName} onChange={handleChange} placeholder="Enter full name" />
          {error.name && <div className="error-message">{error.name}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="age"><i className="fas fa-birthday-cake"></i> Age:</label>
          <input type="number" id="age" name="age" value={users.age} onChange={handleChange} placeholder="Enter age" />
          {error.age && <div className="error-message">{error.age}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="address"><i className="fas fa-home"></i> Address:</label>
          <input type="text" id="address" name="address" value={users.address} onChange={handleChange} placeholder="Enter address" />
          {error.address && <div className="error-message">{error.address}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="phone"><i className="fas fa-phone"></i> Phone:</label>
          <input type="tel" id="phone" name="phone" value={users.phone} onChange={handleChange} placeholder="Enter phone number" />
          {error.phone && <div className="error-message">{error.phone}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="role"><i className="fas fa-users-tag"></i> Role:</label>
          <input type="text" id="role" name="role" value={users.role} onChange={handleChange} placeholder="Enter role" />
          {error.role && <div className="error-message">{error.role}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="email"><i className="fas fa-envelope"></i> Email:</label>
          <input type="email" id="email" name="email" value={users.email} onChange={handleChange} placeholder="Enter email address" />
          {error.email && <div className="error-message">{error.email}</div>}
        </div>
        <button type="button" className="button-add" onClick={handleError}>Submit</button>
      </form>
    </div>
  );
};

export default UserAdd;
