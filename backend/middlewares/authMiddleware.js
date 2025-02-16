import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

// Generic Middleware to Authenticate Users
const authenticateUser = (tokenName) =>
  catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies[tokenName];
    if (!token) {
      return next(new ErrorHandler("User is not authenticated!", 400));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorHandler("User not found!", 404));
    }

    next();
  });

// Role-based Authorization Middleware
const authorizeRoles = (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} not authorized for this resource!`,
          403
        )
      );
    }
    next();
  };

// Exporting Middleware
export const isAdminAuthenticated = authenticateUser("adminToken");
export const isPatientAuthenticated = authenticateUser("patientToken");
export const isDoctorAuthenticated = authenticateUser("doctorToken");
export const isAuthorized = authorizeRoles;
