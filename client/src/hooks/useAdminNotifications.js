import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import * as notificationService from "../services/notificationService";

export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });
  const [filters, setFilters] = useState({
    role: "all", // all, patient, doctor
    type: "all", // all, appointment, prescription, system
  });

  const fetchAllNotifications = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const data = await notificationService.getAllNotificationsForAdmin(page);
      setNotifications(data.notifications);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      console.error("Error fetching all notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      toast.success("Notification marked as read");
    } catch (err) {
      console.error("Error marking notification as read:", err);
      toast.error("Failed to mark notification as read");
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
      toast.success("Notification deleted");
    } catch (err) {
      console.error("Error deleting notification:", err);
      toast.error("Failed to delete notification");
    }
  }, []);

  const getFilteredNotifications = useCallback(() => {
    return notifications.filter((notification) => {
      // Filter by role
      if (filters.role !== "all") {
        const recipientRole = notification.recipientRole || "unknown";
        if (filters.role !== recipientRole) return false;
      }

      // Filter by type
      if (filters.type !== "all" && notification.type !== filters.type) {
        return false;
      }

      return true;
    });
  }, [notifications, filters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAllNotifications();
  }, [fetchAllNotifications]);

  return {
    notifications: getFilteredNotifications(),
    allNotifications: notifications,
    loading,
    error,
    pagination,
    filters,
    fetchAllNotifications,
    markAsRead,
    deleteNotification,
    updateFilters,
  };
};
