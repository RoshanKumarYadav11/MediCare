export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; // Check if token exists
};

export const getRole = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Assuming user data is stored in localStorage
  return user?.role || null; // Return role (e.g., 'admin', 'doctor', 'patient')
};
