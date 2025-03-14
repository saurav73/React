import React, { useState } from "react";
import "../../assets/css/user.css"; // Ensure this path is correct

const UserAdd = () => {
  const [user, setUser] = useState({
    name: "",
    age: 0,
    email: "",
    phone: "",
    address: "",
    role: ""
  });
  const [error, setError] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    address: "",
    role: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    setError({ ...error, [name]: "" });
  };

  const handleError = (e) => {
    e.preventDefault();

    let hasError = false;
    let newError = { name: "", age: "", email: "", phone: "", address: "", role: "" };

    if (!user.name) {
      newError.name = "Please enter your name";
      hasError = true;
    }
    if (!user.age) {
      newError.age = "Please enter your age";
      hasError = true;
    }
    if (!user.email) {
      newError.email = "Please enter your email";
      hasError = true;
    }
    if (!user.phone) {
      newError.phone = "Please enter your phone number";
      hasError = true;
    }
    if (!user.address) {
      newError.address = "Please enter your address";
      hasError = true;
    }
    if (!user.role) {
      newError.role = "Please enter your role";
      hasError = true;
    }

    setError(newError);

    if (!hasError) {
      alert("User profile created successfully!");
      console.log(user);
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
  };

  return (
    <div className="user-add-form">
      <h3>Create New User Profile</h3>
      <form >
        <div className="form-group">
          <label htmlFor="name"><i className="fas fa-user"></i> Full Name:</label>
          <input type="text" id="name" name="name" value={user.name} onChange={handleChange} placeholder="Enter full name" />
          {error.name && <div className="error-message">{error.name}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="age"><i className="fas fa-birthday-cake"></i> Age:</label>
          <input type="number" id="age" name="age" value={user.age} onChange={handleChange} placeholder="Enter age" />
          {error.age && <div className="error-message">{error.age}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="address"><i className="fas fa-home"></i> Address:</label>
          <input type="text" id="address" name="address" value={user.address} onChange={handleChange} placeholder="Enter address" />
          {error.address && <div className="error-message">{error.address}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="phone"><i className="fas fa-phone"></i> Phone:</label>
          <input type="tel" id="phone" name="phone" value={user.phone} onChange={handleChange} placeholder="Enter phone number" />
          {error.phone && <div className="error-message">{error.phone}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="role"><i className="fas fa-user-tag"></i> Role:</label>
          <input type="text" id="role" name="role" value={user.role} onChange={handleChange} placeholder="Enter role" />
          {error.role && <div className="error-message">{error.role}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="email"><i className="fas fa-envelope"></i> Email:</label>
          <input type="email" id="email" name="email" value={user.email} onChange={handleChange} placeholder="Enter email address" />
          {error.email && <div className="error-message">{error.email}</div>}
        </div>
        <button type="button" className="button-add" onClick={handleError}>Submit</button>
      </form>
    </div>
  );
};

export default UserAdd;
