import axios from "axios"

// Fetch all poems
export const getPoems = () => {
  return new Promise((resolve, reject) => {
    axios
      .get("http://localhost:4000/poems")
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// Fetch a single poem by ID
export const getPoem = async (id) => {
  try {
    const response = await axios.get(`http://localhost:4000/poems/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const getPoemsByUserId = async (user_id) => {
  try {
    const response = await axios.get(`http://localhost:4000/poems?user_id=${user_id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching poems for user:", error)
    throw new Error("Unable to fetch poems. Please try again later.")
  }
}

// Create a new poem
export const createPoem = async (data) => {
  try {
    const response = await axios.post(`http://localhost:4000/poems`, data)
    return response.data
  } catch (error) {
    throw error
  }
}

// Update an existing poem
export const updatePoem = async (id, data) => {
  try {
    const response = await axios.patch(`http://localhost:4000/poems/${id}`, data)
    return response.data
  } catch (error) {
    throw error
  }
}

// Delete a poem
export const deletePoem = async (id) => {
  try {
    await axios.delete(`http://localhost:4000/poems/${id}`)
  } catch (error) {
    throw error
  }
}

// Like a poem
export const likePoem = async (id) => {
  try {
    // First get the current poem
    const poem = await getPoem(id)

    // Increment the likes count
    const updatedPoem = {
      ...poem,
      likes: (poem.likes || 0) + 1,
    }

    // Update the poem
    const response = await updatePoem(id, updatedPoem)
    return response
  } catch (error) {
    console.error("Error liking poem:", error)
    throw error
  }
}

// Unlike a poem
export const unlikePoem = async (id) => {
  try {
    // First get the current poem
    const poem = await getPoem(id)

    // Decrement the likes count, but ensure it doesn't go below 0
    const updatedPoem = {
      ...poem,
      likes: Math.max(0, (poem.likes || 0) - 1),
    }

    // Update the poem
    const response = await updatePoem(id, updatedPoem)
    return response
  } catch (error) {
    console.error("Error unliking poem:", error)
    throw error
  }
}

// Fetch all notifications for a user
export const getNotifications = (userId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://localhost:4000/notifications?userId=${userId}`)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// Create a new notification
export const createNotification = async (data) => {
  try {
    const response = await axios.post(`http://localhost:4000/notifications`, data)
    return response.data
  } catch (error) {
    throw error
  }
}

// Update an existing notification
export const updateNotification = async (id, data) => {
  try {
    const response = await axios.patch(`http://localhost:4000/notifications/${id}`, data)
    return response.data
  } catch (error) {
    throw error
  }
}

// Delete a notification
export const deleteNotification = async (id) => {
  try {
    await axios.delete(`http://localhost:4000/notifications/${id}`)
  } catch (error) {
    throw error
  }
}

// Search poems
export const searchPoems = async (query) => {
  try {
    const allPoems = await getPoems()

    if (!query) return allPoems

    const lowercaseQuery = query.toLowerCase()

    return allPoems.filter(
      (poem) =>
        poem.title?.toLowerCase().includes(lowercaseQuery) ||
        poem.content?.toLowerCase().includes(lowercaseQuery) ||
        poem.author?.toLowerCase().includes(lowercaseQuery) ||
        (Array.isArray(poem.tags) && poem.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))),
    )
  } catch (error) {
    console.error("Error searching poems:", error)
    throw error
  }
}

