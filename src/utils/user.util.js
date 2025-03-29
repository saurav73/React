import axios from 'axios';

export const getUsers = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:4000/users')
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}


// export const getUser = async(id) =>{
//   await axios.get(`http://localhost:4000/users/${id}`)
// }

export const getUser = async (id) => {
  try {
    const response = await axios.get(`http://localhost:4000/users/${id}`);
    return response.data; // Return the user data
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export const createUser = async (data) => {
  await axios.post(`http://localhost:4000/users`, data)
}

// export const updateUser = async (id, data) => {
//   await axios.patch(`http://localhost:4000/users/${id}`, data)
// }


export const updateUser = async (id, data) => {
  try {
    const response = await axios.patch(`http://localhost:4000/users/${id}`, data);
    return response.data; // Make sure to return the updated user data
  } catch (error) {
    console.error("Error updating user:", error);
    throw error; // Re-throw the error to handle it in the component
  }
}
export const deleteUser = async (id) => {
  await axios.delete(`http://localhost:4000/users/${id}`)
}


export const checkLogin = async (email, password) => {
  const response = await axios.get(`http://localhost:4000/users/?email=${email}&password=${password}`);
  if (response.data.length === 0) {
    return null;
  }
  return response.data[0];
}