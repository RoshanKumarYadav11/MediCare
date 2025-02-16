import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null); // State to store user role
  const [userName, setUserName] = useState(""); // State for storing user name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to get user data from the API
  const getUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found.");
      }

      const response = await fetch("http://localhost:4000/api/v1/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data.");
      }

      const data = await response.json();
      const { role, fullName } = data.user; // Assuming the API returns a user object with role and fullName
      return { role, fullName };
    } catch (err) {
      setError(err.message);
      throw err; // Rethrow the error after setting it in the state
    }
  };

  // Check for authentication and user role on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { role, fullName } = await getUserData();
        setRole(role); // Set the role from the API
        setUserName(fullName); // Set the user name from the API
        setLoading(false); // Stop loading after data is fetched
      } catch (err) {
        setLoading(false);
        navigate("/login"); // Redirect to login if there's an error
        setError(err.message);
        throw err; 
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle user logout
  const handleLogout = async () => {
   
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out!",
    });

    if (!result.isConfirmed) {
      return; 
    }else{
      localStorage.clear();
      setRole(null);
      setUserName(""); 
      navigate("/login");
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Show loading indicator
  }

  if (error) {
    return <p>Error: {error}</p>; // Show error if there was an issue fetching the user data
  }

  return (
    <div className="flex">
      {/* Sidebar with role and logout functionality */}
      <aside className="fixed z-20">
        <Sidebar role={role} onLogout={handleLogout} />
      </aside>
      {/* Main dashboard content */}
      <main className="z-10 relative flex-1 flex-col overflow-y-auto overflow-x-hidden sm:pl-64 md:ml-4">
        <div className="flex-grow p-6">
          <h1 className="text-3xl font-bold text-center">
            Welcome{" "}
            {userName
              ? userName.charAt(0).toUpperCase() + userName.slice(1)
              : ""}{" "}
            to the {role ? role.charAt(0).toUpperCase() + role.slice(1) : ""}{" "}
            Dashboard!
          </h1>

          <div className="mt-[7rem]">
            {/* Render child routes here */}
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
