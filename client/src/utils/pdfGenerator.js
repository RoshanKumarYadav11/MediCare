import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Function to generate PDF from a DOM element
export const generatePDF = async (
  element,
  filename = "appointment-confirmation.pdf"
) => {
  if (!element) {
    console.error("Element not found");
    return;
  }

  try {
    // Create a canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    // Calculate dimensions to maintain aspect ratio
    const imgWidth = 210; // A4 width in mm (210mm)
    // const pageHeight = 297; // A4 height in mm (297mm)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF instance (A4 format)
    const pdf = new jsPDF("p", "mm", "a4");

    // Add image to PDF
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    // Save the PDF
    pdf.save(filename);

    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};

// Function to generate a styled PDF with appointment details
export const generateAppointmentPDF = (
  appointmentDetails,
  filename = "appointment-confirmation.pdf"
) => {
  if (!appointmentDetails) {
    console.error("Appointment details not provided");
    return;
  }

  try {
    // Create PDF instance (A4 format)
    const pdf = new jsPDF("p", "mm", "a4");

    // Add hospital logo/name
    pdf.setFontSize(22);
    pdf.setTextColor(0, 87, 183); // Blue color
    pdf.text("MediCare", 105, 20, { align: "center" });

    // Add title
    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Appointment Confirmation", 105, 35, { align: "center" });

    // Add confirmation message
    pdf.setFontSize(12);
    pdf.setTextColor(34, 139, 34); // Green color
    pdf.text("Your appointment has been successfully booked!", 105, 45, {
      align: "center",
    });

    // Add horizontal line
    pdf.setDrawColor(220, 220, 220);
    pdf.line(20, 55, 190, 55);

    // Format date
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    // Add appointment details
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);

    const startY = 65;
    const lineHeight = 10;

    // Doctor details
    pdf.setFont(undefined, "bold");
    pdf.text("Doctor:", 20, startY);
    pdf.setFont(undefined, "normal");
    pdf.text(
      `Dr. ${appointmentDetails.doctorId?.firstName} ${appointmentDetails.doctorId?.lastName}`,
      70,
      startY
    );

    // Specialty
    pdf.setFont(undefined, "bold");
    pdf.text("Specialty:", 20, startY + lineHeight);
    pdf.setFont(undefined, "normal");
    pdf.text(
      `${appointmentDetails.doctorId?.specialty || "N/A"}`,
      70,
      startY + lineHeight
    );

    // Date
    pdf.setFont(undefined, "bold");
    pdf.text("Date:", 20, startY + lineHeight * 2);
    pdf.setFont(undefined, "normal");
    pdf.text(
      `${formatDate(appointmentDetails.date)}`,
      70,
      startY + lineHeight * 2
    );

    // Time
    pdf.setFont(undefined, "bold");
    pdf.text("Time:", 20, startY + lineHeight * 3);
    pdf.setFont(undefined, "normal");
    pdf.text(`${appointmentDetails.time}`, 70, startY + lineHeight * 3);

    // Reason
    pdf.setFont(undefined, "bold");
    pdf.text("Reason:", 20, startY + lineHeight * 4);
    pdf.setFont(undefined, "normal");
    pdf.text(`${appointmentDetails.reason}`, 70, startY + lineHeight * 4);

    // Fee
    pdf.setFont(undefined, "bold");
    pdf.text("Fee:", 20, startY + lineHeight * 5);
    pdf.setFont(undefined, "normal");
    pdf.text(
      `Rs. ${appointmentDetails.doctorId?.appointmentFee || 0}`,
      70,
      startY + lineHeight * 5
    );

    // Status
    pdf.setFont(undefined, "bold");
    pdf.text("Status:", 20, startY + lineHeight * 6);
    pdf.setFont(undefined, "normal");
    pdf.setTextColor(34, 139, 34); // Green color
    pdf.text("Confirmed", 70, startY + lineHeight * 6);

    // Add horizontal line
    pdf.setDrawColor(220, 220, 220);
    pdf.setTextColor(0, 0, 0);
    pdf.line(20, startY + lineHeight * 7, 190, startY + lineHeight * 7);

    // Add footer
    pdf.setFontSize(10);
    pdf.text(
      "Please arrive 15 minutes before your scheduled appointment time.",
      105,
      startY + lineHeight * 8,
      {
        align: "center",
      }
    );
    pdf.text(
      "For any changes or cancellations, please contact us at least 24 hours in advance.",
      105,
      startY + lineHeight * 9,
      { align: "center" }
    );
    pdf.text(
      "Contact: +977-1-4XXXXXX | Email: info@medicare.com",
      105,
      startY + lineHeight * 10,
      { align: "center" }
    );

    // Add current date at the bottom
    pdf.setFontSize(8);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 105, 280, {
      align: "center",
    });

    // Save the PDF
    pdf.save(filename);

    return true;
  } catch (error) {
    console.error("Error generating appointment PDF:", error);
    return false;
  }
};
