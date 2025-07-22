
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SnippetCard = ({ snippet }) => {
  return (
    <div style={styles.card}>
      <h3>{snippet.title}</h3>
      <p>By: {snippet.User ? snippet.User.email : 'Unknown'}</p>
      <SyntaxHighlighter language={snippet.language} style={dracula}>
        {snippet.code}
      </SyntaxHighlighter>
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
};

export default SnippetCard;
