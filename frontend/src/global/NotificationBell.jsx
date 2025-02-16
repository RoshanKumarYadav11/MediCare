import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

const NotificationBell = ({ onUpdateCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found!");
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserId(data.user._id);
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.message || "An error occurred",
          "error"
        );
        setUserId(null);
      }
    };
    fetchUser();
  }, []);
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:4000/api/v1/notifications/${userId}`)
      .then((res) => setNotifications(res.data))
      .catch((err) => console.log(err));
  }, [userId]);

  const markAsRead = async (notifId) => {
    try {
      await axios.put(
        `http://localhost:4000/api/v1/notifications/mark-read/${notifId}`
      );

      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notifId ? { ...notif, isRead: true } : notif
        )
      );

      onUpdateCount((prevCount) => Math.max(prevCount - 1, 0)); 
      console.log( )
    } catch (error) {
      console.log("Error marking as read:", error);
    }
  };

  return (
    <div className="w-full mt-2 bg-white shadow-lg rounded-lg p-4">
      <h3 className="font-bold text-center bg-gray-600 w-full text-white rounded-md p-1">Notifications</h3>
      {notifications.length > 0 ? (
        notifications.map((notif, index) => (
          <div
            key={index}
            onClick={() => markAsRead(notif._id)}
            className={`p-3 border-b border-gray-200 cursor-pointer ${
              notif.isRead ? "text-gray-400" : "text-blue-900 font-bold"
            }`}
          >
            {notif.message}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No new notifications</p>
      )}
    </div>
  );
};

NotificationBell.propTypes = {
  onUpdateCount: PropTypes.func.isRequired,
};

export default NotificationBell;
