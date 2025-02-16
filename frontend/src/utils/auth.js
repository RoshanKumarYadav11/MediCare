export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; // Check if token exists
};

export const getRole = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await fetch(`http://localhost:4000/api/v1/user/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Error fetching user role. Status:", response.status);
      return null;
    }

    const data = await response.json();
    const role = data?.user?.role || null; // Correctly extract the role

    return role;
  } catch (error) {
    console.error("❌ Failed to fetch user role:", error);
    return null;
  }
};

