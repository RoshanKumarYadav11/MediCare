import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../services/authService";
import { toast } from "react-hot-toast";

export const useAuth = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password, role) => {
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(email, password, role);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userEmail", email);

      // Redirect based on role
      if (data.role === "admin") {
        navigate("/admin");
      } else if (data.role === "doctor") {
        navigate("/doctor");
      } else {
        navigate("/patient");
      }

      return true;
    } catch (error) {
      setError(error.message);
      toast.error("An error occurred. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      await signupUser(userData);
      navigate("/login");
      return true;
    } catch (error) {
      setError(error.message);
      toast.error("An error occurred. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  return {
    login,
    signup,
    logout,
    error,
    loading,
  };
};
