"use client";

import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, FileText, Loader } from "lucide-react";
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

const AppointmentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const confirmationRef = useRef(null);

  useEffect(() => {
    // Get appointment details from location state
    if (location.state?.appointmentDetails) {
      setAppointmentDetails(location.state.appointmentDetails);
    } else {
      // If no appointment details, redirect to dashboard
      navigate("/patient", { state: { activeTab: "Dashboard" } });
    }
  }, [location, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  if (!appointmentDetails) {
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              Loading Appointment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader className="h-16 w-16 text-blue-600 animate-spin mb-4" />
            <p className="text-center text-gray-600">Please wait...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-green-600 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 mr-2" />
            Appointment Confirmed
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <p className="text-center text-green-800">
              Your appointment has been successfully booked!
            </p>
          </div>

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
                Rs. {appointmentDetails.doctorId?.appointmentFee || 0}
              </p>

              <p className="text-gray-600">Status:</p>
              <p className="font-medium text-green-600">Confirmed</p>
            </div>
          </div>
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
                  appointmentSuccess: true,
                },
              })
            }>
            Go to Dashboard <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AppointmentConfirmation;
