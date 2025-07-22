import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CollectionDetail = () => {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [availableSnippets, setAvailableSnippets] = useState([]);
  const [selectedSnippet, setSelectedSnippet] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCollectionDetails();
    fetchAvailableSnippets();
  }, [id]);

  const fetchCollectionDetails = async () => {
    try {
      const config = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
      const res = await axios.get(`http://localhost:5000/api/collections/${id}`, config);
      setCollection(res.data);
    } catch (err) {
      console.error('Error fetching collection details:', err);
    }
  };

  const fetchAvailableSnippets = async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5000/api/snippets/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAvailableSnippets(res.data);
    } catch (err) {
      console.error('Error fetching available snippets:', err);
    }
  };

  const handleAddSnippet = async () => {
    if (!selectedSnippet) return;
    try {
      await axios.post(`http://localhost:5000/api/collections/${id}/snippets/${selectedSnippet}`, {},
        { headers: { 'Authorization': `Bearer ${token}` } });
      setSelectedSnippet('');
      fetchCollectionDetails(); // Refresh collection details
    } catch (err) {
      console.error('Error adding snippet to collection:', err);
      alert('Error adding snippet.');
    }
  };

  const handleRemoveSnippet = async (snippetId) => {
    try {
      await axios.delete(`http://localhost:5000/api/collections/${id}/snippets/${snippetId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchCollectionDetails(); // Refresh collection details
    } catch (err) {
      console.error('Error removing snippet from collection:', err);
      alert('Error removing snippet.');
    }
  };

  if (!collection) {
    return <div style={styles.container}>Loading collection...</div>;
  }

  const isOwner = token && collection.userId === JSON.parse(atob(token.split('.')[1])).userId;

  return (
    <div style={styles.container}>
      <h2>{collection.name}</h2>
      <p>{collection.description}</p>
      <p>Status: {collection.isPublic ? 'Public' : 'Private'}</p>
      <p>Created by: {collection.User ? collection.User.username : 'Unknown'}</p>

      <h3>Snippets in this Collection:</h3>
      {collection.Snippets && collection.Snippets.length > 0 ? (
        collection.Snippets.map(snippet => (
          <div key={snippet.id} style={styles.snippetCard}>
            <h4>{snippet.title}</h4>
            <p>By: {snippet.User ? snippet.User.username : 'Unknown'}</p>
            <SyntaxHighlighter language={snippet.language} style={dracula}>
              {snippet.code}
            </SyntaxHighlighter>
            {isOwner && (
              <button onClick={() => handleRemoveSnippet(snippet.id)} style={styles.removeButton}>
                Remove from Collection
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No snippets in this collection yet.</p>
      )}

      {isOwner && (
        <div style={styles.addSnippetSection}>
          <h3>Add Snippet to Collection:</h3>
          <select
            value={selectedSnippet}
            onChange={(e) => setSelectedSnippet(e.target.value)}
            style={styles.select}
          >
            <option value="">Select a snippet</option>
            {availableSnippets.map(snippet => (
              <option key={snippet.id} value={snippet.id}>
                {snippet.title} ({snippet.language})
              </option>
            ))}
          </select>
          <button onClick={handleAddSnippet} style={styles.addButton}>Add Snippet</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  snippetCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px 0',
    backgroundColor: '#f9f9f9',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  addSnippetSection: {
    marginTop: '30px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  select: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  addButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
};

export default CollectionDetail;
