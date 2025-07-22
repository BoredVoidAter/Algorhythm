import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SnippetCard from './SnippetCard';

const BookmarkList = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchBookmarks();
    }
  }, [token]);

  const fetchBookmarks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookmarks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarks(res.data);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    }
  };

  return (
    <div>
      <h2>Your Bookmarked Snippets</h2>
      {bookmarks.length === 0 ? (
        <p>No bookmarks yet.</p>
      ) : (
        bookmarks.map(bookmark => (
          <SnippetCard key={bookmark.id} snippet={bookmark.Snippet} />
        ))
      )}
    </div>
  );
};

export default BookmarkList;