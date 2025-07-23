import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AssessmentDetail = () => {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [code, setCode] = useState('');
  const [submissionFeedback, setSubmissionFeedback] = useState('');

  useEffect(() => {
    const fetchAssessment = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:5000/api/assessments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAssessment(response.data);
        setCode(response.data.codeTemplate);
      } catch (err) {
        console.error('Failed to fetch assessment:', err);
      }
    };
    fetchAssessment();
  }, [id]);

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`http://localhost:5000/api/assessments/${id}/submit`, 
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmissionFeedback(response.data.feedback);
    } catch (err) {
      console.error('Failed to submit assessment:', err);
      setSubmissionFeedback('Failed to submit assessment. Please try again.');
    }
  };

  if (!assessment) {
    return <div>Loading assessment...</div>;
  }

  return (
    <div>
      <h2>{assessment.title}</h2>
      <p>{assessment.description}</p>
      {assessment.Badge && (
        <p>Awards: <img src={assessment.Badge.iconUrl} alt={assessment.Badge.name} style={styles.badgeIcon} /> {assessment.Badge.name}</p>
      )}
      <h3>Code Editor:</h3>
      <SyntaxHighlighter language={assessment.language} style={dracula}>
        {assessment.codeTemplate}
      </SyntaxHighlighter>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows="20"
        style={styles.codeEditor}
      ></textarea>
      <button onClick={handleSubmit} style={styles.submitButton}>Submit Code</button>
      {submissionFeedback && (
        <div style={styles.feedback}>
          <h3>Submission Feedback:</h3>
          <p>{submissionFeedback}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  badgeIcon: {
    width: '20px',
    height: '20px',
    verticalAlign: 'middle',
    marginRight: '5px',
  },
  codeEditor: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontFamily: 'monospace',
    fontSize: '14px',
    minHeight: '200px',
  },
  submitButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  feedback: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #007bff',
    borderRadius: '5px',
    backgroundColor: '#e7f3ff',
  },
};

export default AssessmentDetail;