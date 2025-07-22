import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import SnippetForm from './components/SnippetForm';
import SnippetFeed from './components/SnippetFeed';
import BookmarkList from './components/BookmarkList';

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
        </nav>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<SnippetForm />} />
          <Route path="/" element={<SnippetFeed />} />
          <Route path="/bookmarks" element={<BookmarkList />} />
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