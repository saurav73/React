// storage.util.js

// Safely set user in localStorage
export const setUserInStorage = (user) => {
    if (!user || typeof user !== "object" || !user.id) {
      console.error("Invalid user data for storage:", user);
      return false;
    }
    try {
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    } catch (error) {
      console.error("Error setting user in localStorage:", error);
      return false;
    }
  };
  
  // Safely get user from localStorage
  export const getUserFromStorage = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined" || storedUser.trim() === "") {
      return null;
    }
    try {
      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser || typeof parsedUser !== "object" || !parsedUser.id) {
        console.warn("Invalid user data structure in localStorage:", parsedUser);
        return null;
      }
      return parsedUser;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  };
  
  // Clear authentication-related localStorage items
  export const clearAuthStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("is_login");
    localStorage.removeItem("auth_token");
  };