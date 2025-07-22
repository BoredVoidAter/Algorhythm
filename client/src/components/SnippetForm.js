
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SnippetForm = () => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/snippets', 
        { title, code, language, tags },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Snippet posted successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to post snippet');
    }
  };

  return (
    <div>
      <h2>Create New Snippet</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title/Explanation:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Code:</label>
          <textarea value={code} onChange={(e) => setCode(e.target.value)} rows="10" required></textarea>
        </div>
        <div>
          <label>Language:</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="php">PHP</option>
            <option value="ruby">Ruby</option>
            <option value="go">Go</option>
            <option value="typescript">TypeScript</option>
            <option value="json">JSON</option>
            <option value="xml">XML</option>
            <option value="sql">SQL</option>
            <option value="markdown">Markdown</option>
            <option value="bash">Bash</option>
            <option value="diff">Diff</option>
            <option value="graphql">GraphQL</option>
            <option value="yaml">YAML</option>
            <option value="kotlin">Kotlin</option>
            <option value="swift">Swift</option>
            <option value="rust">Rust</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="objectivec">Objective-C</option>
            <option value="perl">Perl</option>
            <option value="r">R</option>
            <option value="scala">Scala</option>
            <option value="shell">Shell</option>
            <option value="text">Plain Text</option>
          </select>
        </div>
        <div>
          <label>Tags (comma-separated):</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., javascript, react, ui" />
        </div>
        <button type="submit">Post Snippet</button>
      </form>
    </div>
  );
};

export default SnippetForm;
