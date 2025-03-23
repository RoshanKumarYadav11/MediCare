// Utility function to create custom error objects
export const createError = (statusCode, message) => {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

