class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  // Set default message and status code
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Handle MongoDB duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400); // Don't reassign `err` with `const`
  }

  // Handle invalid JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, try again!`;
    err = new ErrorHandler(message, 400);
  }

  // Handle expired JWT error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, try again!`;
    err = new ErrorHandler(message, 400);
  }

  // Handle invalid cast error (e.g., MongoDB)
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // If validation errors exist, join them and set them as the message
  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage, // Use the error message
  });
};

export default ErrorHandler;
