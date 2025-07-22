
import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';

const SnippetCard = ({ snippet }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchComments();
    checkBookmarkStatus();
  }, [snippet.id]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/comments/${snippet.id}`);
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const checkBookmarkStatus = async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5000/api/bookmarks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const bookmarked = res.data.some(bookmark => bookmark.snippetId === snippet.id);
      setIsBookmarked(bookmarked);
    } catch (err) {
      console.error('Error checking bookmark status:', err);
    }
  };

  const handleLike = async () => {
    try {
      await axios.post(`http://localhost:5000/api/snippets/${snippet.id}/like`, {},
        { headers: { 'Authorization': `Bearer ${token}` } });
      // Optionally, update likes count in UI without refetching all snippets
      alert('Snippet liked!');
    } catch (err) {
      console.error('Error liking snippet:', err);
      alert('Error liking snippet.');
    }
  };

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await axios.delete(`http://localhost:5000/api/bookmarks/${snippet.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        alert('Bookmark removed!');
      } else {
        await axios.post(`http://localhost:5000/api/bookmarks/${snippet.id}`, {},
          { headers: { 'Authorization': `Bearer ${token}` } });
        alert('Snippet bookmarked!');
      }
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error('Error bookmarking snippet:', err);
      alert('Error bookmarking snippet.');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await axios.post(`http://localhost:5000/api/comments/${snippet.id}`, { content: newComment },
        { headers: { 'Authorization': `Bearer ${token}` } });
      setNewComment('');
      fetchComments(); // Refresh comments
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Error adding comment.');
    }
  };

  return (
    <div style={styles.card}>
      <h3>{snippet.title}</h3>
      <p>By: {snippet.User ? snippet.User.email : 'Unknown'}</p>
      <SyntaxHighlighter language={snippet.language} style={dracula}>
        {snippet.code}
      </SyntaxHighlighter>
      <div style={styles.engagement}>
        <span>Likes: {snippet.likesCount}</span>
        <button onClick={handleLike} style={styles.button}>Like</button>
        <button onClick={handleBookmark} style={styles.button}>
          {isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
        </button>
      </div>
      {snippet.tags && (
        <div style={styles.tags}>
          {snippet.tags.split(',').map((tag, index) => (
            <span key={index} style={styles.tag}>#{tag.trim()}</span>
          ))}
        </div>
      )}
      <div style={styles.commentsSection}>
        <h4>Comments</h4>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} style={styles.comment}>
              <strong>{comment.User ? comment.User.username : 'Anonymous'}:</strong> {comment.content}
            </div>
          ))
        )}
        {token && (
          <form onSubmit={handleAddComment} style={styles.commentForm}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              style={styles.commentInput}
            />
            <button type="submit" style={styles.button}>Post Comment</button>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px 0',
    backgroundColor: '#f9f9f9',
  },
  engagement: {
    marginTop: '10px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  button: {
    padding: '8px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  tags: {
    marginTop: '10px',
  },
  tag: {
    display: 'inline-block',
    backgroundColor: '#e0e0e0',
    padding: '5px 8px',
    borderRadius: '3px',
    marginRight: '5px',
    fontSize: '0.8em',
  },
  commentsSection: {
    marginTop: '20px',
    borderTop: '1px solid #eee',
    paddingTop: '15px',
  },
  comment: {
    backgroundColor: '#f0f0f0',
    padding: '8px',
    borderRadius: '5px',
    marginBottom: '8px',
  },
  commentForm: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10px',
  },
  commentInput: {
    minHeight: '60px',
    marginBottom: '10px',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
};

export default SnippetCard;
