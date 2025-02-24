// components/Notifications.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notifications");
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  const markAsRead = async () => {
    try {
      await axios.put("http://localhost:5000/api/notifications/mark-read");
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking as read", error);
    }
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications">
      <button onClick={() => setIsOpen(!isOpen)} className="notification-bell">
        🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>
      
      {isOpen && (
        <div className="notifications-panel">
          <div className="panel-header">
            <h3>Notifications</h3>
            <button onClick={markAsRead}>Mark all as read</button>
          </div>
          <div className="notifications-list">
            {notifications.map(notification => (
              <div key={notification._id} className={`notification ${!notification.read ? "unread" : ""}`}>
                <p>{notification.message}</p>
                <small>{new Date(notification.createdAt).toLocaleString()}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;