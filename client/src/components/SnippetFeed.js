
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SnippetCard from './SnippetCard';

const SnippetFeed = () => {
  const [snippets, setSnippets] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        let url = 'http://localhost:5000/api/snippets';
        let res;
        const token = localStorage.getItem('token');

        if (searchQuery) {
          res = await axios.post('http://localhost:5000/api/snippets/search-semantic', 
            { query: searchQuery },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else if (selectedTag) {
          url = `http://localhost:5000/api/snippets?tag=${selectedTag}`;
          res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        } else {
          res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        }
        
        setSnippets(res.data);

        // Extract all unique tags from snippets
        const tags = new Set();
        res.data.forEach(snippet => {
          if (snippet.tags) {
            snippet.tags.split(',').forEach(tag => tags.add(tag.trim()));
          }
        });
        setAllTags(Array.from(tags));

      } catch (err) {
        console.error(err);
      }
    };
    fetchSnippets();
  }, [selectedTag, searchQuery]);

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    setSearchQuery(''); // Clear search query when a tag is clicked
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedTag(null); // Clear selected tag when searching
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // The useEffect will trigger the search when searchQuery changes
  };

  return (
    <div>
      <h2>Code Snippets</h2>
      <form onSubmit={handleSearchSubmit} style={styles.searchBar}>
        <input
          type="text"
          placeholder="Search snippets..."
          value={searchQuery}
          onChange={handleSearchChange}
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchButton}>Search</button>
      </form>
      <div style={styles.tagFilter}>
        <strong>Filter by Tag:</strong>
        <span style={styles.tag} onClick={() => setSelectedTag(null)}>#All</span>
        {allTags.map((tag, index) => (
          <span 
            key={index} 
            style={{ ...styles.tag, ...(selectedTag === tag ? styles.selectedTag : {}) }}
            onClick={() => handleTagClick(tag)}
          >
            #{tag}
          </span>
        ))}
      </div>
      {snippets.map((snippet) => (
        <SnippetCard key={snippet.id} snippet={snippet} />
      ))}
    </div>
  );
};

const styles = {
  searchBar: {
    display: 'flex',
    marginBottom: '20px',
  },
  searchInput: {
    flexGrow: '1',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px 0 0 5px',
    outline: 'none',
  },
  searchButton: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '0 5px 5px 0',
    cursor: 'pointer',
  },
  tagFilter: {
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#e9ecef',
    borderRadius: '5px',
  },
  tag: {
    display: 'inline-block',
    backgroundColor: '#007bff',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '15px',
    margin: '0 5px',
    cursor: 'pointer',
    fontSize: '0.9em',
  },
  selectedTag: {
    backgroundColor: '#0056b3',
  },
};

export default SnippetFeed;
