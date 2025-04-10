"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, RefreshCw } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import Button from "./ui/Button";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    fetchUnreadCount,
  } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch notifications when dropdown is opened
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  const handleRefresh = () => {
    fetchNotifications();
    fetchUnreadCount();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 max-h-96 overflow-y-auto">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <Button
              onClick={handleRefresh}
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            <div>
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification._id}
                  className={`p-3 border-b hover:bg-gray-50 ${
                    !notification.isRead ? "bg-blue-50" : ""
                  } cursor-pointer`}
                  onClick={() =>
                    !notification.isRead && handleMarkAsRead(notification._id)
                  }
                >
                  <div className="flex items-start">
                    <div className="mr-2 text-xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="ml-2">
                        <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="p-2 text-center border-t">
                <Button
                  variant="ghost"
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => {
                    setIsOpen(false);
                    document
                      .querySelector('button[aria-label="Notifications"]')
                      ?.click();
                  }}
                >
                  View all notifications
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
