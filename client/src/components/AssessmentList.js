import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AssessmentList = () => {
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    const fetchAssessments = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/assessments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAssessments(response.data);
      } catch (err) {
        console.error('Failed to fetch assessments:', err);
      }
    };
    fetchAssessments();
  }, []);

  return (
    <div>
      <h2>Skill Assessments</h2>
      {assessments.length === 0 ? (
        <p>No assessments available at the moment.</p>
      ) : (
        <ul>
          {assessments.map((assessment) => (
            <li key={assessment.id} style={styles.assessmentItem}>
              <h3>{assessment.title}</h3>
              <p>{assessment.description}</p>
              {assessment.Badge && (
                <p>Awards: <img src={assessment.Badge.iconUrl} alt={assessment.Badge.name} style={styles.badgeIcon} /> {assessment.Badge.name}</p>
              )}
              <Link to={`/assessments/${assessment.id}`} style={styles.takeAssessmentButton}>Take Assessment</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  assessmentItem: {
    border: '1px solid #ddd',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  badgeIcon: {
    width: '20px',
    height: '20px',
    verticalAlign: 'middle',
    marginRight: '5px',
  },
  takeAssessmentButton: {
    display: 'inline-block',
    marginTop: '10px',
    padding: '8px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    
  },
};

export default AssessmentList;