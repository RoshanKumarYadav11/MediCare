import { Doctor } from "../models/doctorSchema.js";
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

// Middleware to authenticate any user
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token =
    req.cookies.authToken || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new ErrorHandler("User is not authenticated!", 400));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id);
  if (!req.user) {
    req.user = await Doctor.findById(decoded.id);
  }


  if (!req.user) {
    return next(new ErrorHandler("User not found!", 404));
  }

  next();
});

// Middleware to check roles
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} is not authorized to access this resource!`,
          403
        )
      );
    }
    next();
  };
};
