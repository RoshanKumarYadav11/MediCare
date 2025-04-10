"use client";
import { useState, useEffect } from "react";
import { Check, Trash2, RefreshCw } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import Button from "./ui/Button";

const NotificationsPanel = () => {
  const {
    notifications,
    loading,
    error,
    pagination,
    fetchNotifications,
    markAsRead,
    deleteNotification,
    markAllAsRead,
  } = useNotifications();

  const [filter, setFilter] = useState("all"); // all, unread, read
  const [typeFilter, setTypeFilter] = useState("all"); // all, appointment, prescription, message, system

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleRefresh = () => {
    fetchNotifications(pagination.page);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "appointment":
        return "🗓️";
      case "prescription":
        return "💊";
      case "message":
        return "✉️";
      case "system":
        return "🔔";
      default:
        return "🔔";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "appointment":
        return "Appointment";
      case "prescription":
        return "Prescription";
      case "message":
        return "Message";
      case "system":
        return "System";
      default:
        return "Notification";
    }
  };

  // Add a function to get sender name based on role
  const getSenderName = (notification) => {
    if (!notification.sender) return "System";

    const firstName = notification.sender.firstName || "";
    const lastName = notification.sender.lastName || "";

    if (notification.senderModel === "Doctor") {
      return `Dr. ${firstName} ${lastName}`;
    } else if (notification.senderModel === "Admin") {
      return `Admin: ${firstName} ${lastName}`;
    } else {
      return `${firstName} ${lastName}`;
    }
  };

  // Filter notifications based on current filters
  const filteredNotifications = notifications.filter((notification) => {
    // Filter by read/unread status
    if (filter === "unread" && notification.isRead) return false;
    if (filter === "read" && !notification.isRead) return false;

    // Filter by notification type
    if (typeFilter !== "all" && notification.type !== typeFilter) return false;

    return true;
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notifications</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <select
              className="text-sm border rounded p-1"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
            <select
              className="text-sm border rounded p-1"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="appointment">Appointments</option>
              <option value="prescription">Prescriptions</option>
              <option value="message">Messages</option>
              <option value="system">System</option>
            </select>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          {notifications.filter((n) => !n.isRead).length > 0 && (
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              <Check className="h-4 w-4 mr-1" />
              Mark all as read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <p className="text-center py-4">Loading notifications...</p>
        )}

        {error && (
          <p className="text-center text-red-500 py-4">
            Error loading notifications: {error}
          </p>
        )}

        {!loading && filteredNotifications.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No notifications found
          </p>
        )}

        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                !notification.isRead
                  ? "bg-blue-50 border-blue-200"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3 text-2xl">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      {getTypeLabel(notification.type)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    {notification.message}
                  </p>
                  {notification.sender && (
                    <p className="text-xs text-blue-600 mt-1">
                      From: {getSenderName(notification)}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
                <div className="flex-shrink-0 flex ml-4">
                  {!notification.isRead && (
                    <button
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      onClick={() => markAsRead(notification._id)}
                      title="Mark as read"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => deleteNotification(notification._id)}
                    title="Delete notification"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {pagination.pages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => fetchNotifications(page)}
                  className={`px-3 py-1 rounded ${
                    pagination.page === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsPanel;
