
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SnippetCard from './SnippetCard';

const SnippetFeed = () => {
  const [snippets, setSnippets] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const url = selectedTag 
          ? `http://localhost:5000/api/snippets?tag=${selectedTag}` 
          : 'http://localhost:5000/api/snippets';
        const res = await axios.get(url);
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
  }, [selectedTag]);

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
  };

  return (
    <div>
      <h2>Code Snippets</h2>
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
