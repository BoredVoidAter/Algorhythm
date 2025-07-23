import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SnippetCard from './SnippetCard';

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [personalWebsiteLink, setPersonalWebsiteLink] = useState('');
  const [pinnedSnippetId, setPinnedSnippetId] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setBio(response.data.bio || '');
        setGithubLink(response.data.githubLink || '');
        setPersonalWebsiteLink(response.data.personalWebsiteLink || '');
        setPinnedSnippetId(response.data.pinnedSnippetId || '');
      } catch (err) {
        setError('Failed to fetch user profile.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/users/${id}`, {
        bio,
        githubLink,
        personalWebsiteLink,
        pinnedSnippetId: pinnedSnippetId || null // Ensure null if empty
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      // Re-fetch user data to reflect changes
      const response = await axios.get(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (err) {
      setError('Failed to update profile.');
      console.error(err);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>User not found.</p>;

  const pinnedSnippet = user.Snippets.find(snippet => snippet.id === user.pinnedSnippetId);
  const otherSnippets = user.Snippets.filter(snippet => snippet.id !== user.pinnedSnippetId);

  return (
    <div className="user-profile-container">
      <h1>{user.email}'s Profile</h1>
      {isEditing ? (
        <div>
          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <input
            type="text"
            placeholder="GitHub Link"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
          />
          <input
            type="text"
            placeholder="Personal Website Link"
            value={personalWebsiteLink}
            onChange={(e) => setPersonalWebsiteLink(e.target.value)}
          />
          <input
            type="number"
            placeholder="Pinned Snippet ID"
            value={pinnedSnippetId}
            onChange={(e) => setPinnedSnippetId(e.target.value)}
          />
          <button onClick={handleUpdateProfile}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p>Bio: {user.bio || 'N/A'}</p>
          <p>GitHub: {user.githubLink ? <a href={user.githubLink}>{user.githubLink}</a> : 'N/A'}</p>
          <p>Website: {user.personalWebsiteLink ? <a href={user.personalWebsiteLink}>{user.personalWebsiteLink}</a> : 'N/A'}</p>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      )}

      <h2>Pinned Snippet</h2>
      {pinnedSnippet ? (
        <SnippetCard snippet={pinnedSnippet} />
      ) : (
        <p>No snippet pinned.</p>
      )}

      <h2>Other Snippets</h2>
      <div className="snippets-list">
        {otherSnippets.length > 0 ? (
          otherSnippets.map(snippet => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))
        ) : (
          <p>No other snippets.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
