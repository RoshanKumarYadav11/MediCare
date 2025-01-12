import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to get user data
  const getUserData = () => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    return { token, userRole };
  };

  // Check for authentication and user role on mount
  useEffect(() => {
    const { token, userRole } = getUserData();

    if (!token) {
      navigate("/login"); // Redirect to login if no token
    } else {
      setRole(userRole); // Set user role
    }
    setLoading(false); // Stop loading after checking
  }, [navigate]);

  // Handle user logout
  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="flex">
      {/* Sidebar with role and logout functionality */}
      <aside className="fixed  z-20 ">
        <Sidebar role={role} onLogout={handleLogout} />
      </aside>
      {/* Main dashboard content */}
      <main className="z-10 relative flex-1  flex-col overflow-y-auto overflow-x-hidden  sm:pl-64 md:ml-4">
        <div className="flex-grow p-6">
          {loading ? (
            <p>Loading...</p> // Show loading indicator
          ) : (
            <>
              <h1 className="text-3xl font-bold text-center">
                Welcome to the{" "}
                {role ? role.charAt(0).toUpperCase() + role.slice(1) : ""}{" "}
                Dashboard!
              </h1>
              <div className="mt-4">
                {/* Render child routes here */}
                <Outlet />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

