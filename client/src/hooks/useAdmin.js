"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import * as adminService from "../services/adminService"

export const useAdmin = () => {
  const navigate = useNavigate()
  const [adminInfo, setAdminInfo] = useState(null)
  const [editedInfo, setEditedInfo] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [totalDoctors, setTotalDoctors] = useState(0)
  const [totalPatients, setTotalPatients] = useState(0)
  const [doctorOverview, setDoctorOverview] = useState([])
  const [patientOverview, setPatientOverview] = useState([])
  const [completedAppointments, setCompletedAppointments] = useState([])
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [doctorData, setDoctorData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    specialty: "",
    licenseNumber: "",
    phoneNumber: "",
    password: "",
  })
  const [adminData, setAdminData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAdminProfile = async () => {
    setLoading(true)
    try {
      const data = await adminService.getAdminProfile()
      setAdminInfo(data)
      setEditedInfo(data)

      // Store user ID and role in localStorage for messaging
      if (data && data._id) {
        localStorage.setItem("userId", data._id)
        localStorage.setItem("userRole", "admin")
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async () => {
    setLoading(true)
    try {
      const updatedAdmin = await adminService.updateAdminProfile({
        firstName: editedInfo.firstName,
        lastName: editedInfo.lastName,
        email: editedInfo.email,
      })
      setAdminInfo(updatedAdmin.admin)
      setIsEditing(false)
      toast.success("Profile updated successfully.")
      return true
    } catch (error) {
      toast.error("An error occurred")
      setError(error.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const fetchTotalDoctors = async () => {
    setLoading(true)
    try {
      const data = await adminService.getTotalDoctors()
      setTotalDoctors(data.totalDoctors)
    } catch (error) {
      console.error("Error fetching total doctors:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchTotalPatients = async () => {
    setLoading(true)
    try {
      const data = await adminService.getTotalPatients()
      setTotalPatients(data.totalPatients)
    } catch (error) {
      console.error("Error fetching total patients:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchDoctorOverview = async () => {
    setLoading(true)
    try {
      const data = await adminService.getDoctorOverview()
      setDoctorOverview(data)
    } catch (error) {
      console.error("Error fetching doctor overview:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchPatientOverview = async () => {
    setLoading(true)
    try {
      const data = await adminService.getPatientOverview()
      setPatientOverview(data)
    } catch (error) {
      console.error("Error fetching patient overview:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchCompletedAppointments = async () => {
    setLoading(true)
    try {
      const data = await adminService.getCompletedAppointments()
      console.log("Fetched completed/cancelled appointments:", data)
      setCompletedAppointments(data)
    } catch (error) {
      console.error("Error fetching completed/cancelled appointments:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchUpcomingAppointments = async () => {
    setLoading(true)
    try {
      const data = await adminService.getUpcomingAppointments()
      const sortedUpcoming = data.sort((a, b) => new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time))
      setUpcomingAppointments(sortedUpcoming)
    } catch (error) {
      console.error("Error fetching upcoming appointments:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const addDoctor = async () => {
    setLoading(true)
    try {
      await adminService.addDoctor(doctorData)
      setDoctorData({
        firstName: "",
        lastName: "",
        email: "",
        specialty: "",
        licenseNumber: "",
        phoneNumber: "",
        password: "",
      })
      fetchDoctorOverview()
      fetchTotalDoctors()
      toast.success("Doctor added successfully")
      return true
    } catch (error) {
      toast.error("An error occurred. Please try again.")
      setError(error.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const addAdmin = async () => {
    if (adminData.password !== adminData.confirmPassword) {
      toast.error("Passwords don't match")
      return false
    }

    setLoading(true)
    try {
      await adminService.addAdmin(adminData)
      setAdminData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      })
      toast.success("Admin added successfully")
      return true
    } catch (error) {
      toast.error("An error occurred. Please try again.")
      setError(error.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target

    if (isEditing) {
      setEditedInfo((prev) => ({ ...prev, [name]: value }))
    } else if (formType === "doctor") {
      setDoctorData((prev) => ({ ...prev, [name]: value }))
    } else if (formType === "admin") {
      setAdminData((prev) => ({ ...prev, [name]: value }))
    }
  }

  return {
    adminInfo,
    editedInfo,
    isEditing,
    setIsEditing,
    totalDoctors,
    totalPatients,
    doctorOverview,
    patientOverview,
    completedAppointments,
    upcomingAppointments,
    doctorData,
    adminData,
    loading,
    error,
    fetchAdminProfile,
    updateProfile,
    fetchTotalDoctors,
    fetchTotalPatients,
    fetchDoctorOverview,
    fetchPatientOverview,
    fetchCompletedAppointments,
    fetchUpcomingAppointments,
    addDoctor,
    addAdmin,
    handleInputChange,
  }
}
