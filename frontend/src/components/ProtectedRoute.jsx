import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated, getRole } from "../utils/auth";

const ProtectedRoute = ({ allowedRoles }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchRole = async () => {
      if (!isAuthenticated()) {
        setLoading(false);
        return;
      }
      const userRole = await getRole();
      setRole(userRole);
      setLoading(false);
    };

    fetchRole();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} />;
  }

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;
