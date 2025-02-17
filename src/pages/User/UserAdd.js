import React, { useState } from 'react';


const UserAdd = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setName(value);
    }
    if (name === "age") {
      setAge(value);
    }
    if (name === "address") {
      setAddress(value);
    }
    if (name === "phone") {
      setPhone(value);
    }
    if (name === "email") {
      setEmail(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Name: ", name);
    console.log("Age: ", age);
    console.log("Address: ", address);
    console.log("Phone: ", phone);
    console.log("Email: ", email);

    if (name && age && address && phone && email) {
      alert("User profile created successfully!");
      setError("");
    } else {
      let errorMessage = "Please fill out the following fields: ";
      if (!name) errorMessage += "Name, ";
      if (!age) errorMessage += "Age, ";
      if (!address) errorMessage += "Address, ";
      if (!phone) errorMessage += "Phone, ";
      if (!email) errorMessage += "Email, ";
      setError(errorMessage.slice(0, -2) + "!");
    }
  };

  return (
    <div className="user-add-form">
      <h3>Create New User Profile</h3>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="name"><i className="fas fa-user"></i> Full Name:</label>
          <input type="text" id="name" name="name" value={name} onChange={handleChange} placeholder="Enter full name"  />
        </div>
        <div className="form-group">
          <label htmlFor="age"><i className="fas fa-birthday-cake"></i> Age:</label>
          <input type="number" id="age" name="age" value={age} onChange={handleChange} placeholder="Enter age" required />
        </div>
        <div className="form-group">
          <label htmlFor="address"><i className="fas fa-home"></i> Address:</label>
          <input type="text" id="address" name="address" value={address} onChange={handleChange} placeholder="Enter address" required />
        </div>
        <div className="form-group">
          <label htmlFor="phone"><i className="fas fa-phone"></i> Phone:</label>
          <input type="tel" id="phone" name="phone" value={phone} onChange={handleChange} placeholder="Enter phone number" required />
        </div>
        <div className="form-group">
          <label htmlFor="email"><i className="fas fa-envelope"></i> Email:</label>
          <input type="email" id="email" name="email" value={email} onChange={handleChange} placeholder="Enter email address" required />
        </div>
        <button type="submit" className="button-add">Submit</button>
      </form>
    </div>
  );
};

export default UserAdd;
