import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const MessageForm = () => {
  const { receiverId: paramReceiverId } = useParams();
  const navigate = useNavigate();
  const [receiverId, setReceiverId] = useState(paramReceiverId || '');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/messages', {
        receiverId: parseInt(receiverId),
        content
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/messages'); // Redirect to message list after sending
    } catch (err) {
      setError('Failed to send message.');
      console.error(err);
    }
  };

  return (
    <div className="message-form-container">
      <h1>Send Message</h1>
      <form onSubmit={handleSendMessage}>
        <div>
          <label>Receiver ID:</label>
          <input
            type="number"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Message:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default MessageForm;
