// poemApi.js
import axios from 'axios';

// Fetch all poems
export const getPoems = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:4000/poems')
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

// Fetch a single poem by ID
export const getPoem = async (user_id) => {
  try {
    const response = await axios.get(`http://localhost:4000/poems/${user_id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getPoemsByUserId = async (user_id) => {
  try {
    const response = await axios.get(`http://localhost:4000/poems?user_id=${user_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching poems for user:", error);
    throw new Error("Unable to fetch poems. Please try again later.");
  }
};

// Create a new poem
export const createPoem = async (data) => {
  try {
    const response = await axios.post(`http://localhost:4000/poems`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update an existing poem
export const updatePoem = async (id, data) => {
  try {
    const response = await axios.patch(`http://localhost:4000/poems/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a poem
export const deletePoem = async (id) => {
  try {
    await axios.delete(`http://localhost:4000/poems/${id}`);
  } catch (error) {
    throw error;
  }
};




// Fetch all notifications for a user
export const getNotifications = (userId) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:4000/notifications?userId=${userId}`)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

// Create a new notification
export const createNotification = async (data) => {
  try {
    const response = await axios.post(`http://localhost:4000/notifications`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update an existing notification
export const updateNotification = async (id, data) => {
  try {
    const response = await axios.patch(`http://localhost:4000/notifications/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a notification
export const deleteNotification = async (id) => {
  try {
    await axios.delete(`http://localhost:4000/notifications/${id}`);
  } catch (error) {
    throw error;
  }
};