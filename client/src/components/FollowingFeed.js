import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SnippetCard from './SnippetCard';

function FollowingFeed() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowingSnippets = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to see your following feed.');
          setLoading(false);
          return;
        }
        const response = await axios.get('http://localhost:5000/api/follows/following/snippets', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSnippets(response.data);
      } catch (err) {
        setError('Failed to fetch following snippets.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowingSnippets();
  }, []);

  if (loading) return <div>Loading following feed...</div>;
  if (error) return <div>Error: {error}</div>;
  if (snippets.length === 0) return <div>No snippets from users you follow yet. Start following some creators!</div>;

  return (
    <div>
      <h2>Snippets from Users You Follow</h2>
      {snippets.map((snippet) => (
        <SnippetCard key={snippet.id} snippet={snippet} />
      ))}
    </div>
  );
}

export default FollowingFeed;
