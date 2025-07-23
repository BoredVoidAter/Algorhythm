
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const SnippetForm = () => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tags, setTags] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  
  const navigate = useNavigate();
  const { id: forkId } = useParams(); // Get forkId from URL

  useEffect(() => {
    if (forkId) {
      const fetchOriginalSnippet = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/snippets/${forkId}`);
          const originalSnippet = response.data;
          setTitle(`Fork of ${originalSnippet.title}`);
          setCode(originalSnippet.code);
          setLanguage(originalSnippet.language);
          setTags(originalSnippet.tags);
        } catch (err) {
          console.error('Failed to fetch original snippet for forking:', err);
          alert('Failed to load original snippet for forking.');
        }
      };
      fetchOriginalSnippet();
    }
  }, [forkId]);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  

  const getAiFeedback = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:5000/api/snippets/ai-feedback',
        { code, language },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAiFeedback(response.data.feedback);
    } catch (err) {
      console.error('Failed to get AI feedback:', err);
      setAiFeedback('Failed to get AI feedback. Please try again.');
    }
  };

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
          <textarea value={code} onChange={handleCodeChange} rows="10" required></textarea>
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
        <button type="button" onClick={getAiFeedback} style={{ marginLeft: '10px' }}>Get AI Feedback</button>
      </form>
      {aiFeedback && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
          <h3>AI Feedback:</h3>
          <p>{aiFeedback}</p>
        </div>
      )}
    </div>
  );
};

export default SnippetForm;
