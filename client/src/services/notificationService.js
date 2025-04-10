import apiRequest from "./api";

export const getNotifications = (page = 1, limit = 10) => {
  console.log(`Fetching notifications: page=${page}, limit=${limit}`);
  return apiRequest(`/notifications?page=${page}&limit=${limit}`)
    .then((data) => {
      console.log("Notification API response:", data);
      return data;
    })
    .catch((error) => {
      console.error("Error in getNotifications:", error);
      throw error;
    });
};

export const markAsRead = (notificationId) => {
  return apiRequest(`/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
};

export const deleteNotification = (notificationId) => {
  return apiRequest(`/notifications/${notificationId}`, {
    method: "DELETE",
  });
};

export const getUnreadCount = () => {
  return apiRequest("/notifications/unread-count")
    .then((data) => {
      console.log("Unread count:", data);
      return data;
    })
    .catch((error) => {
      console.error("Error in getUnreadCount:", error);
      throw error;
    });
};

// New function to get all notifications for admin
export const getAllNotificationsForAdmin = (page = 1, limit = 20) => {
  return apiRequest(`/admin/all-notifications?page=${page}&limit=${limit}`);
};
