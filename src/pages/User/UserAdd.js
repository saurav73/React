import React, { useState } from 'react';


const UserAdd = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
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
    if (name === "role") {
      setRole(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name="")
    {
      nameError("Please enter name");
      return;
    }
    if (age="")
    {
      ageError("Please enter age");
      return;
    }
    if (address="")
    {
      addressError("Please enter address");
      return;
    }
    if (phone="")
    {
      phoneError("Please enter phone number");
      return;
    }
    if (email="")
    {
      emailError("Please enter email address");
      return;
    }
    if (role="")
    {
      roleError("Please select role");
      return;
    }

    const savingData ={
      name: name,
      age: age,
      address: address,
      phone: phone,
      email: email,
      role: role
    }
    console.log(savingData);
  };

  return (
    <div className="user-add-form">
      <h3>Create New User Profile</h3>
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label htmlFor="name"><i className="fas fa-user"></i> Full Name:</label>
          <input type="text" id="name" name="name" value={name} onChange={handleChange} placeholder="Enter full name"  />
          <div className="error-message">{nameError}</div>
        </div>
        <div className="form-group">
          <label htmlFor="age"><i className="fas fa-birthday-cake"></i> Age:</label>
          <input type="number" id="age" name="age" value={age} onChange={handleChange} placeholder="Enter age" />
          <div className="error-message">{ageError}</div>
        </div>
        <div className="form-group">
          <label htmlFor="address"><i className="fas fa-home"></i> Address:</label>
          <input type="text" id="address" name="address" value={address} onChange={handleChange} placeholder="Enter address" />
          <div className="error-message">{addressError}</div>
        </div>
        <div className="form-group">
          <label htmlFor="phone"><i className="fas fa-phone"></i> Phone:</label>
          <input type="tel" id="phone" name="phone" value={phone} onChange={handleChange} placeholder="Enter phone number"/>
          <div className="error-message">{phoneError}</div>
        </div>
        <div className="form-group">
          <lebel></lebel>
          <select id="email" name="role" value={role} onChange={(e) => handleChange(e)} >
            <option value="">Select Role</option>
            <option value="admin" selected={role=="admin"}>Admin</option>
            <option value="user" selected={role == "user"}>User</option>
          </select>
          <div className="error-message">{roleError}</div>
        </div>
        <div className="form-group">
          <label htmlFor="email"><i className="fas fa-envelope"></i> Email:</label>
          <input type="email" id="email" name="email" value={email} onChange={handleChange} placeholder="Enter email address"/>
          <div className="error-message">{emailError}</div>
          <button type="submit" className="button-add">Submit</button>
        </div>
        
      </form>
    </div>
  );
};

export default UserAdd;
