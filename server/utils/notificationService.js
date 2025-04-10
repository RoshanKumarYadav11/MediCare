import Notification from "../models/Notification.js";

export const createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

export const createAppointmentNotifications = async (appointmentData) => {
  try {
    const { patientId, doctorId, date, time, _id } = appointmentData;

    // Format date for display
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Create notification for doctor
    const doctorNotification = await createNotification({
      recipient: doctorId,
      sender: patientId,
      senderModel: "User",
      type: "appointment",
      title: "New Appointment Scheduled",
      message: `You have a new appointment scheduled on ${formattedDate} at ${time}.`,
      relatedId: _id,
      relatedModel: "Appointment",
    });

    // Create notification for patient
    const patientNotification = await createNotification({
      recipient: patientId,
      sender: doctorId,
      senderModel: "Doctor",
      type: "appointment",
      title: "Appointment Confirmation",
      message: `Your appointment has been scheduled for ${formattedDate} at ${time}.`,
      relatedId: _id,
      relatedModel: "Appointment",
    });

    return [doctorNotification, patientNotification];
  } catch (error) {
    console.error("Error creating appointment notifications:", error);
    throw error;
  }
};

export const createPrescriptionNotification = async (prescriptionData) => {
  try {
    const { patientId, doctorId, medication, _id } = prescriptionData;

    return await createNotification({
      recipient: patientId,
      sender: doctorId,
      senderModel: "Doctor",
      type: "prescription",
      title: "New Prescription",
      message: `You have a new prescription for ${medication}.`,
      relatedId: _id,
      relatedModel: "Prescription",
    });
  } catch (error) {
    console.error("Error creating prescription notification:", error);
    throw error;
  }
};

export const createAppointmentStatusNotification = async (
  appointmentData,
  status
) => {
  try {
    const { patientId, doctorId, date, time, _id } = appointmentData;

    // Format date for display
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let title, message;

    if (status === "completed") {
      title = "Appointment Completed";
      message = `Your appointment on ${formattedDate} at ${time} has been marked as completed.`;
    } else if (status === "cancelled") {
      title = "Appointment Cancelled";
      message = `Your appointment on ${formattedDate} at ${time} has been cancelled.`;
    }

    return await createNotification({
      recipient: patientId,
      sender: doctorId,
      senderModel: "Doctor",
      type: "appointment",
      title,
      message,
      relatedId: _id,
      relatedModel: "Appointment",
    });
  } catch (error) {
    console.error("Error creating appointment status notification:", error);
    throw error;
  }
};
