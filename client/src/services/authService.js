import apiRequest from "./api"

export const loginUser = async (email, password, role) => {
  return apiRequest("/login", {
    method: "POST",
    body: JSON.stringify({ email, password, role }),
  })
}

export const signupUser = async (userData) => {
  return apiRequest("/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  })
}

