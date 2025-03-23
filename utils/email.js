import nodemailer from "nodemailer"

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  // For development, you can use a test service like Ethereal
  // For production, configure with your actual email service
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || "ethereal_user",
    pass: process.env.EMAIL_PASS || "ethereal_pass",
  },
})

// Send verification email
export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`

  const mailOptions = {
    from: '"Medicare" <noreply@medicare.com>',
    to: email,
    subject: "Verify Your Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Welcome to Medicare!</h2>
        <p>Thank you for registering with Medicare. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
        </div>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account with Medicare, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eaeaea;" />
        <p style="color: #666; font-size: 12px;">© ${new Date().getFullYear()} Medicare. All rights reserved.</p>
      </div>
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log("Verification email sent:", info.messageId)
    return info
  } catch (error) {
    console.error("Error sending verification email:", error)
    throw error
  }
}

// Send password reset email
export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`

  const mailOptions = {
    from: '"Medicare" <noreply@medicare.com>',
    to: email,
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Reset Your Password</h2>
        <p>You requested a password reset for your Medicare account. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eaeaea;" />
        <p style="color: #666; font-size: 12px;">© ${new Date().getFullYear()} Medicare. All rights reserved.</p>
      </div>
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log("Password reset email sent:", info.messageId)
    return info
  } catch (error) {
    console.error("Error sending password reset email:", error)
    throw error
  }
}

// Send appointment confirmation email
export const sendAppointmentConfirmationEmail = async (email, appointment, doctorName) => {
  const appointmentDate = new Date(appointment.date).toLocaleDateString()
  const appointmentUrl = `${process.env.CLIENT_URL}/dashboard/appointments/${appointment._id}`

  const mailOptions = {
    from: '"Medicare" <noreply@medicare.com>',
    to: email,
    subject: "Appointment Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Appointment Confirmed</h2>
        <p>Your appointment with ${doctorName} has been confirmed for ${appointmentDate} at ${appointment.time}.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${appointmentUrl}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Appointment</a>
        </div>
        <p>Appointment Details:</p>
        <ul>
          <li>Doctor: ${doctorName}</li>
          <li>Date: ${appointmentDate}</li>
          <li>Time: ${appointment.time}</li>
          <li>Type: ${appointment.type}</li>
          <li>Location: ${appointment.location}</li>
        </ul>
        <p>If you need to reschedule or cancel, please do so at least 24 hours in advance.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eaeaea;" />
        <p style="color: #666; font-size: 12px;">© ${new Date().getFullYear()} Medicare. All rights reserved.</p>
      </div>
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log("Appointment confirmation email sent:", info.messageId)
    return info
  } catch (error) {
    console.error("Error sending appointment confirmation email:", error)
    throw error
  }
}

