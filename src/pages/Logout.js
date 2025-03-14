import React, { useEffect } from "react";
import { useNavigate } from "react-router";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logout");
    navigate("/login");
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <div>
      Logging out...
    </div>
  );
};

export default Logout;
