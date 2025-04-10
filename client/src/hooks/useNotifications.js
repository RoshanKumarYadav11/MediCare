"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import * as notificationService from "../services/notificationService";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  // Add a function to handle related data
  const processNotifications = (notifications) => {
    if (!notifications || !Array.isArray(notifications)) {
      console.error("Invalid notifications data:", notifications);
      return [];
    }

    return notifications.map((notification) => {
      const processedNotification = { ...notification };

      // Add additional context based on notification type
      if (
        notification.type === "appointment" &&
        notification.relatedModel === "Appointment"
      ) {
        const appointment = notification.relatedId;
        if (appointment) {
          // Add appointment details if available
          processedNotification.appointmentDetails = {
            date: appointment.date,
            time: appointment.time,
            status: appointment.status,
          };
        }
      } else if (
        notification.type === "prescription" &&
        notification.relatedModel === "Prescription"
      ) {
        const prescription = notification.relatedId;
        if (prescription) {
          // Add prescription details if available
          processedNotification.prescriptionDetails = {
            medication: prescription.medication,
            dosage: prescription.dosage,
            frequency: prescription.frequency,
          };
        }
      }

      return processedNotification;
    });
  };

  // Update the fetchNotifications function to process notifications
  const fetchNotifications = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications(page);
      console.log("Fetched notifications:", data); // Add this for debugging

      if (data && data.notifications) {
        setNotifications(processNotifications(data.notifications));
        setPagination(
          data.pagination || {
            page: 1,
            pages: 1,
            total: data.notifications.length,
          }
        );
      } else {
        console.error("Invalid response format:", data);
        setNotifications([]);
        setPagination({ page: 1, pages: 1, total: 0 });
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await notificationService.getUnreadCount();
      if (data && typeof data.count === "number") {
        setUnreadCount(data.count);
      } else {
        console.error("Invalid unread count response:", data);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Error fetching unread count:", err);
      setUnreadCount(0);
    }
  }, []);

  const markAsRead = useCallback(
    async (notificationId) => {
      try {
        await notificationService.markAsRead(notificationId);
        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
        fetchUnreadCount();
        toast.success("Notification marked as read");
      } catch (err) {
        console.error("Error marking notification as read:", err);
        toast.error("Failed to mark notification as read");
      }
    },
    [fetchUnreadCount]
  );

  const deleteNotification = useCallback(
    async (notificationId) => {
      try {
        await notificationService.deleteNotification(notificationId);
        setNotifications((prev) =>
          prev.filter((notification) => notification._id !== notificationId)
        );
        fetchUnreadCount();
        toast.success("Notification deleted");
      } catch (err) {
        console.error("Error deleting notification:", err);
        toast.error("Failed to delete notification");
      }
    },
    [fetchUnreadCount]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      const promises = notifications
        .filter((notification) => !notification.isRead)
        .map((notification) => markAsRead(notification._id));

      await Promise.all(promises);
      fetchUnreadCount();
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      toast.error("Failed to mark all notifications as read");
    }
  }, [notifications, markAsRead, fetchUnreadCount]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  // Set up polling for new notifications (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    pagination,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    deleteNotification,
    markAllAsRead,
  };
};
