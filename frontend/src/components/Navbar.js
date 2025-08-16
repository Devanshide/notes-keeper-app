import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: '10px', background: '#eee', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Link to="/" style={{ marginRight: 10 }}>Home</Link>
        {user && <span>Welcome, {user.name}</span>}
      </div>
      <div>
        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: 10 }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;