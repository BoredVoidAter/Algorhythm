
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SnippetCard from './SnippetCard';

const SnippetFeed = () => {
  const [snippets, setSnippets] = useState([]);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/snippets');
        setSnippets(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSnippets();
  }, []);

  return (
    <div>
      <h2>Code Snippets</h2>
      {snippets.map((snippet) => (
        <SnippetCard key={snippet.id} snippet={snippet} />
      ))}
    </div>
  );
};

export default SnippetFeed;
