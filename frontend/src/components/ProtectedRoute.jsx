import PropTypes from "prop-types";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated, getRole } from "../utils/auth";

// Define PropTypes for `allowedRoles`
const ProtectedRoute = ({ allowedRoles }) => {
  const role = getRole();
  const location = useLocation();

  // If the user is not authenticated, redirect to login page
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // If allowedRoles is provided and the user's role is not in allowedRoles, redirect to unauthorized page
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} />;
  }

  // If the user is authenticated and their role is allowed, render the requested route
  return <Outlet />;
};

// Ensure `allowedRoles` is an array and is required
ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired, // allowedRoles must be an array of strings
};

export default ProtectedRoute;
