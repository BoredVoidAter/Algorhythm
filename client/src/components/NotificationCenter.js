import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {},
        { headers: { 'Authorization': `Bearer ${token}` } });
      fetchNotifications(); // Refresh notifications
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        notifications.map(notification => (
          <div key={notification.id} style={notification.read ? styles.readNotification : styles.unreadNotification}>
            <p>{notification.message}</p>
            {!notification.read && (
              <button onClick={() => markAsRead(notification.id)} style={styles.markReadButton}>
                Mark as Read
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  unreadNotification: {
    backgroundColor: '#e6f7ff',
    border: '1px solid #91d5ff',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readNotification: {
    backgroundColor: '#f0f0f0',
    border: '1px solid #d9d9d9',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#595959',
  },
  markReadButton: {
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
};

export default NotificationCenter;
