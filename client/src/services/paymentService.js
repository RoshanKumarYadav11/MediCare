import apiRequest from "./api"

export const initiatePayment = async (appointmentData) => {
  return apiRequest("/payment/initiate-payment", {
    method: "POST",
    body: JSON.stringify(appointmentData),
  })
}

// Simplified to just pass the pidx to the backend
export const verifyPayment = async (pidx, appointmentId) => {
  try {
    console.log("Sending verification request to backend:", { pidx, appointmentId })

    // Add a small delay to prevent multiple rapid requests
    await new Promise((resolve) => setTimeout(resolve, 500))

    const response = await apiRequest("/payment/verify-payment", {
      method: "POST",
      body: JSON.stringify({ pidx, appointmentId }),
    })
    console.log("Backend verification response:", response)
    return response
  } catch (error) {
    console.error("Error in verifyPayment service:", error)
    return {
      success: false,
      error: error.message || "Payment verification failed",
    }
  }
}

export const getPaymentStatus = async (appointmentId) => {
  try {
    const response = await apiRequest(`/payment/status/${appointmentId}`)
    return response
  } catch (error) {
    console.error("Error in getPaymentStatus service:", error)
    return {
      success: false,
      error: error.message || "Failed to get payment status",
    }
  }
}
