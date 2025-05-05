"use client";

import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Loader,
  ArrowRight,
  FileText,
} from "lucide-react";
import { usePatient } from "../hooks/usePatient";
import Button from "../components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/Card";
import { generateAppointmentPDF } from "../utils/pdfGenerator";
import { toast } from "react-hot-toast";

const PaymentCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyPayment } = usePatient();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [error, setError] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const confirmationRef = useRef(null);

  useEffect(() => {
    const processPayment = async () => {
      setLoading(true);
      try {
        // Get query parameters from URL
        const params = new URLSearchParams(location.search);
        const pidx = params.get("pidx");
        const status = params.get("status"); // Khalti returns a status parameter
        const appointmentId = localStorage.getItem("pendingAppointmentId");

        console.log("Payment callback received:", {
          pidx,
          status,
          appointmentId,
        });

        // If we don't have pidx or appointmentId, but we have a status of "Completed"
        // This could be a successful payment where the user is returning to the app
        if ((!pidx || !appointmentId) && status === "Completed") {
          setPaymentStatus("success");
          // Clear the pending appointment ID from localStorage
          localStorage.removeItem("pendingAppointmentId");
          return;
        }

        if (!pidx || !appointmentId) {
          console.error("Missing pidx or appointmentId", {
            pidx,
            appointmentId,
          });
          setError("Missing payment information");
          setPaymentStatus("error");
          return;
        }

        // Send the pidx to our backend for verification
        // The backend will verify with Khalti and update the appointment status
        const response = await verifyPayment(pidx, appointmentId);
        console.log("Backend verification response:", response);

        if (response.success) {
          setPaymentStatus("success");
          setAppointmentDetails(response.appointment);
          // Clear the pending appointment ID from localStorage
          localStorage.removeItem("pendingAppointmentId");
        } else {
          setPaymentStatus("pending");
          setAppointmentDetails(response.appointment);
          setError(response.message || "Payment verification failed");
        }
      } catch (error) {
        console.error("Error processing payment:", error);
        setPaymentStatus("error");
        setError(
          error.message || "An error occurred while processing your payment"
        );
      } finally {
        setLoading(false);
      }
    };

    // Only process payment once when component mounts
    const shouldProcessPayment =
      location.search.includes("pidx=") || location.search.includes("status=");
    if (shouldProcessPayment) {
      processPayment();
    } else {
      // If no payment parameters, redirect to booking page
      navigate("/patient", { state: { activeTab: "Appointment Booking" } });
    }
  }, [location, verifyPayment, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleRetryPayment = () => {
    // Redirect to appointment booking page
    navigate("/patient", { state: { activeTab: "Appointment Booking" } });
  };

  const handleDownloadPDF = async () => {
    if (!appointmentDetails) return;

    setGeneratingPdf(true);
    try {
      // Generate PDF with appointment details
      const success = await generateAppointmentPDF(
        appointmentDetails,
        `appointment-${appointmentDetails._id}.pdf`
      );

      if (success) {
        toast.success("Appointment confirmation downloaded successfully");
      } else {
        toast.error("Failed to download appointment confirmation");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download appointment confirmation");
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Processing Payment</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader className="h-16 w-16 text-blue-600 animate-spin mb-4" />
            <p className="text-center text-gray-600">
              Please wait while we verify your payment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-green-600 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 mr-2" />
              Payment Successful
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-center text-green-800">
                Your appointment has been successfully booked!
              </p>
            </div>

            {appointmentDetails && (
              <div className="space-y-4 mt-6" ref={confirmationRef}>
                <h3 className="font-semibold text-lg">Appointment Details</h3>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-600">Doctor:</p>
                  <p className="font-medium">
                    Dr. {appointmentDetails.doctorId?.firstName}{" "}
                    {appointmentDetails.doctorId?.lastName}
                  </p>

                  <p className="text-gray-600">Specialty:</p>
                  <p className="font-medium">
                    {appointmentDetails.doctorId?.specialty}
                  </p>

                  <p className="text-gray-600">Date:</p>
                  <p className="font-medium">
                    {formatDate(appointmentDetails.date)}
                  </p>

                  <p className="text-gray-600">Time:</p>
                  <p className="font-medium">{appointmentDetails.time}</p>

                  <p className="text-gray-600">Reason:</p>
                  <p className="font-medium">{appointmentDetails.reason}</p>

                  <p className="text-gray-600">Fee:</p>
                  <p className="font-medium">
                    Rs. {appointmentDetails.doctorId?.appointmentFee}
                  </p>

                  <p className="text-gray-600">Status:</p>
                  <p className="font-medium text-green-600">Confirmed</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              className="w-full flex items-center justify-center"
              variant="outline"
              onClick={handleDownloadPDF}
              disabled={generatingPdf}>
              {generatingPdf ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Download Confirmation
                </>
              )}
            </Button>
            <Button
              className="w-full"
              onClick={() =>
                navigate("/patient", {
                  state: {
                    activeTab: "Dashboard",
                    paymentSuccess: true,
                  },
                })
              }>
              Go to Dashboard <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (paymentStatus === "pending") {
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-yellow-600 flex items-center justify-center">
              <XCircle className="h-8 w-8 mr-2" />
              Payment Incomplete
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              <p className="text-center text-yellow-800">
                Your payment is not complete. Please complete the payment to
                confirm your appointment.
              </p>
            </div>

            {appointmentDetails && (
              <div className="space-y-4 mt-6">
                <h3 className="font-semibold text-lg">Appointment Details</h3>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-600">Doctor:</p>
                  <p className="font-medium">
                    Dr. {appointmentDetails.doctorId?.firstName}{" "}
                    {appointmentDetails.doctorId?.lastName}
                  </p>

                  <p className="text-gray-600">Specialty:</p>
                  <p className="font-medium">
                    {appointmentDetails.doctorId?.specialty}
                  </p>

                  <p className="text-gray-600">Date:</p>
                  <p className="font-medium">
                    {formatDate(appointmentDetails.date)}
                  </p>

                  <p className="text-gray-600">Time:</p>
                  <p className="font-medium">{appointmentDetails.time}</p>

                  <p className="text-gray-600">Fee:</p>
                  <p className="font-medium">
                    Rs. {appointmentDetails.doctorId?.appointmentFee}
                  </p>

                  <p className="text-gray-600">Status:</p>
                  <p className="font-medium text-yellow-600">Payment Pending</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" onClick={handleRetryPayment}>
              Try Again
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/patient")}>
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-red-600 flex items-center justify-center">
            <XCircle className="h-8 w-8 mr-2" />
            Payment Error
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-red-50 p-4 rounded-lg mb-4">
            <p className="text-center text-red-800">
              {error ||
                "There was an error processing your payment. Please try again."}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={handleRetryPayment}>
            Try Again
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/patient")}>
            Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentCallback;
