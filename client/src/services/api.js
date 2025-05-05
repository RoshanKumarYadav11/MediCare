import { BASE_URL } from "../constants/constants";

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  console.log(`API Request: ${endpoint}`, {
    hasToken: !!token,
    method: options.method || "GET",
  });

  // Don't set Content-Type for FormData
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  // If body is an object and not FormData, stringify it
  if (options.body && typeof options.body === "object" && !isFormData) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    console.log(`API Response status: ${response.status} for ${endpoint}`);

    // Try to parse the response as JSON
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.warn("Response is not JSON:", text);
      data = { message: text };
    }

    if (!response.ok) {
      console.error(`API Error for ${endpoint}:`, data);
      throw new Error(data.error || data.message || "An error occurred");
    }

    return data;
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
};

export default apiRequest;
