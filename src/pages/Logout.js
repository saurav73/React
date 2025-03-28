import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { showSuccessToast } from "../utils/toastify.util";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    showSuccessToast("Logout successful");
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
