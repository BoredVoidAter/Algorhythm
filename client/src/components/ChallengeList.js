import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ChallengeList() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/challenges');
        setChallenges(response.data);
      } catch (err) {
        setError('Failed to fetch challenges.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  if (loading) return <div>Loading challenges...</div>;
  if (error) return <div>Error: {error}</div>;
  if (challenges.length === 0) return <div>No challenges available yet.</div>;

  return (
    <div>
      <h2>Coding Challenges</h2>
      {challenges.map((challenge) => (
        <div key={challenge.id} style={styles.challengeCard}>
          <h3><Link to={`/challenges/${challenge.id}`} style={styles.challengeLink}>{challenge.title}</Link></h3>
          <p>{challenge.description}</p>
          <p><strong>Tag:</strong> {challenge.tag}</p>
          <p><strong>Starts:</strong> {new Date(challenge.startDate).toLocaleDateString()}</p>
          <p><strong>Ends:</strong> {new Date(challenge.endDate).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  challengeCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    backgroundColor: '#f9f9f9',
  },
  challengeLink: {
    textDecoration: 'none',
    color: '#007bff',
  },
};

export default ChallengeList;
