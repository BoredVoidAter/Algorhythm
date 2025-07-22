import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CollectionList = () => {
  const [myCollections, setMyCollections] = useState([]);
  const [publicCollections, setPublicCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [newCollectionIsPublic, setNewCollectionIsPublic] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMyCollections();
    fetchPublicCollections();
  }, []);

  const fetchMyCollections = async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5000/api/collections/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMyCollections(res.data);
    } catch (err) {
      console.error('Error fetching my collections:', err);
    }
  };

  const fetchPublicCollections = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/collections/public');
      setPublicCollections(res.data);
    } catch (err) {
      console.error('Error fetching public collections:', err);
    }
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/collections', {
        name: newCollectionName,
        description: newCollectionDescription,
        isPublic: newCollectionIsPublic,
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNewCollectionName('');
      setNewCollectionDescription('');
      setNewCollectionIsPublic(false);
      fetchMyCollections();
    } catch (err) {
      console.error('Error creating collection:', err);
      alert('Error creating collection.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>My Collections</h2>
      {token && (
        <form onSubmit={handleCreateCollection} style={styles.form}>
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="New Collection Name"
            style={styles.input}
            required
          />
          <textarea
            value={newCollectionDescription}
            onChange={(e) => setNewCollectionDescription(e.target.value)}
            placeholder="Collection Description (Optional)"
            style={styles.textarea}
          />
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={newCollectionIsPublic}
              onChange={(e) => setNewCollectionIsPublic(e.target.checked)}
              style={styles.checkbox}
            />
            Public
          </label>
          <button type="submit" style={styles.button}>Create Collection</button>
        </form>
      )}

      <div style={styles.collectionList}>
        {myCollections.length === 0 ? (
          <p>No collections created yet.</p>
        ) : (
          myCollections.map(collection => (
            <div key={collection.id} style={styles.collectionCard}>
              <Link to={`/collections/${collection.id}`} style={styles.collectionLink}>
                <h3>{collection.name}</h3>
              </Link>
              <p>{collection.description}</p>
              <p>Status: {collection.isPublic ? 'Public' : 'Private'}</p>
              <p>Snippets: {collection.Snippets ? collection.Snippets.length : 0}</p>
            </div>
          ))
        )}
      </div>

      <h2>Public Collections</h2>
      <div style={styles.collectionList}>
        {publicCollections.length === 0 ? (
          <p>No public collections available.</p>
        ) : (
          publicCollections.map(collection => (
            <div key={collection.id} style={styles.collectionCard}>
              <Link to={`/collections/${collection.id}`} style={styles.collectionLink}>
                <h3>{collection.name}</h3>
              </Link>
              <p>{collection.description}</p>
              <p>By: {collection.User ? collection.User.username : 'Unknown'}</p>
              <p>Snippets: {collection.Snippets ? collection.Snippets.length : 0}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '30px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  textarea: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    minHeight: '80px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  checkbox: {
    width: '20px',
    height: '20px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  collectionList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  collectionCard: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  collectionLink: {
    textDecoration: 'none',
    color: '#007bff',
  },
};

export default CollectionList;
