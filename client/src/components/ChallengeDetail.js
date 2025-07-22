import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SnippetCard from './SnippetCard';

function ChallengeDetail() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallengeDetails = async () => {
      try {
        const challengeRes = await axios.get(`http://localhost:5000/api/challenges/${id}`);
        setChallenge(challengeRes.data);

        const snippetsRes = await axios.get(`http://localhost:5000/api/challenges/${id}/snippets`);
        setSnippets(snippetsRes.data);

      } catch (err) {
        setError('Failed to fetch challenge details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallengeDetails();
  }, [id]);

  if (loading) return <div>Loading challenge details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!challenge) return <div>Challenge not found.</div>;

  return (
    <div>
      <h2>{challenge.title}</h2>
      <p>{challenge.description}</p>
      <p><strong>Tag:</strong> {challenge.tag}</p>
      <p><strong>Starts:</strong> {new Date(challenge.startDate).toLocaleDateString()}</p>
      <p><strong>Ends:</strong> {new Date(challenge.endDate).toLocaleDateString()}</p>

      <h3>Submissions ({snippets.length})</h3>
      {snippets.length === 0 ? (
        <p>No snippets submitted for this challenge yet.</p>
      ) : (
        snippets.map((snippet) => (
          <SnippetCard key={snippet.id} snippet={snippet} />
        ))
      )}
    </div>
  );
}

export default ChallengeDetail;
