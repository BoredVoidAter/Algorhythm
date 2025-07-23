import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/messages', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(response.data);
      } catch (err) {
        setError('Failed to fetch messages.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const markAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/messages/${messageId}/read`, {},
        { headers: { Authorization: `Bearer ${token}` } });
      setMessages(messages.map(msg =>
        msg.id === messageId ? { ...msg, read: true } : msg
      ));
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="message-list-container">
      <h1>Your Messages</h1>
      <Link to="/messages/new/:receiverId">New Message</Link>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        messages.map(message => (
          <div key={message.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0', backgroundColor: message.read ? '#f0f0f0' : '#fff' }}>
            <p><strong>From:</strong> {message.senderId}</p>
            <p><strong>To:</strong> {message.receiverId}</p>
            <p>{message.content}</p>
            {!message.read && (
              <button onClick={() => markAsRead(message.id)}>Mark as Read</button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;
