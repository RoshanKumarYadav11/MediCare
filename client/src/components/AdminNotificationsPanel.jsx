import { useState } from "react";
import { Check, Trash2, Filter } from "lucide-react";
import { useAdminNotifications } from "../hooks/useAdminNotifications";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import Button from "./ui/Button";
import { Select } from "./ui/Input";

const AdminNotificationsPanel = () => {
  const {
    notifications,
    loading,
    error,
    pagination,
    filters,
    fetchAllNotifications,
    markAsRead,
    deleteNotification,
    updateFilters,
  } = useAdminNotifications();

  const [showFilters, setShowFilters] = useState(false);

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

  const getRoleLabel = (role) => {
    switch (role) {
      case "patient":
        return "Patient";
      case "doctor":
        return "Doctor";
      case "admin":
        return "Admin";
      default:
        return role || "Unknown";
    }
  };

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

  const getRecipientName = (notification) => {
    if (!notification.recipient) return "Unknown";

    const firstName = notification.recipient.firstName || "";
    const lastName = notification.recipient.lastName || "";
    const role = notification.recipient.role || "";

    if (role === "doctor") {
      return `Dr. ${firstName} ${lastName}`;
    } else {
      return `${firstName} ${lastName}`;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>All System Notifications</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
      </CardHeader>

      {showFilters && (
        <div className="px-6 py-2 bg-gray-50 border-t border-b">
          <div className="flex flex-wrap gap-4">
            <div className="w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Role
              </label>
              <Select
                value={filters.role}
                onChange={(e) => updateFilters({ role: e.target.value })}
                className="w-full"
              >
                <option value="all">All Roles</option>
                <option value="patient">Patients</option>
                <option value="doctor">Doctors</option>
                <option value="admin">Admins</option>
              </Select>
            </div>
            <div className="w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Type
              </label>
              <Select
                value={filters.type}
                onChange={(e) => updateFilters({ type: e.target.value })}
                className="w-full"
              >
                <option value="all">All Types</option>
                <option value="appointment">Appointments</option>
                <option value="prescription">Prescriptions</option>
                <option value="system">System</option>
                <option value="message">Messages</option>
              </Select>
            </div>
          </div>
        </div>
      )}

      <CardContent className="pt-4">
        {loading && (
          <p className="text-center py-4">Loading notifications...</p>
        )}

        {error && (
          <p className="text-center text-red-500 py-4">
            Error loading notifications: {error}
          </p>
        )}

        {!loading && notifications.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No notifications match the current filters
          </p>
        )}

        <div className="space-y-4">
          {notifications.map((notification) => (
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
                  <div className="flex flex-wrap justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        {getTypeLabel(notification.type)}
                      </span>
                      {notification.recipient && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                          {getRoleLabel(notification.recipientRole)}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    {notification.message}
                  </p>

                  <div className="flex flex-wrap gap-x-4 mt-2 text-xs">
                    {notification.sender && (
                      <p className="text-blue-600">
                        From: {getSenderName(notification)}
                      </p>
                    )}
                    {notification.recipient && (
                      <p className="text-green-600">
                        To: {getRecipientName(notification)}
                      </p>
                    )}
                    <p className="text-gray-400">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
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
                  onClick={() => fetchAllNotifications(page)}
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

export default AdminNotificationsPanel;
