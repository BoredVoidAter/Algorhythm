import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import SnippetForm from './components/SnippetForm';
import SnippetFeed from './components/SnippetFeed';
import BookmarkList from './components/BookmarkList';
import FollowingFeed from './components/FollowingFeed';
import ChallengeList from './components/ChallengeList';
import ChallengeDetail from './components/ChallengeDetail';
import CollectionList from './components/CollectionList';
import CollectionDetail from './components/CollectionDetail';
import NotificationCenter from './components/NotificationCenter';
import UserProfile from './components/UserProfile';
import MessageList from './components/MessageList';
import MessageForm from './components/MessageForm';
import AssessmentList from './components/AssessmentList';
import AssessmentDetail from './components/AssessmentDetail';

function App() {
  return (
    <Router>
      <div style={styles.container}>
        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/login" style={styles.navLink}>Login</Link>
          <Link to="/register" style={styles.navLink}>Register</Link>
          <Link to="/create" style={styles.navLink}>Create Snippet</Link>
          <Link to="/bookmarks" style={styles.navLink}>Bookmarks</Link>
          <Link to="/following" style={styles.navLink}>Following</Link>
          <Link to="/challenges" style={styles.navLink}>Challenges</Link>
          <Link to="/collections" style={styles.navLink}>Collections</Link>
          <Link to="/my-collections" style={styles.navLink}>My Collections</Link>
          <Link to="/notifications" style={styles.navLink}>Notifications</Link>
          <Link to="/profile/:id" style={styles.navLink}>My Profile</Link>
          <Link to="/messages" style={styles.navLink}>Messages</Link>
          <Link to="/assessments" style={styles.navLink}>Assessments</Link>
        </nav>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<SnippetForm />} />
          <Route path="/" element={<SnippetFeed />} />
          <Route path="/bookmarks" element={<BookmarkList />} />
          <Route path="/following" element={<FollowingFeed />} />
          <Route path="/challenges" element={<ChallengeList />} />
          <Route path="/challenges/:id" element={<ChallengeDetail />} />
          <Route path="/collections" element={<CollectionList />} />
          <Route path="/collections/:id" element={<CollectionDetail />} />
          <Route path="/my-collections" element={<CollectionList />} />
          <Route path="/fork/:id" element={<SnippetForm />} />
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/messages" element={<MessageList />} />
          <Route path="/messages/new/:receiverId" element={<MessageForm />} />
          <Route path="/assessments" element={<AssessmentList />} />
          <Route path="/assessments/:id" element={<AssessmentDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
  },
  navLink: {
    textDecoration: 'none',
    color: '#007bff',
    fontWeight: 'bold',
  },
};

export default App;