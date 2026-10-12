import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🕵️‍♂️</span>
          <span className="brand-text">Mystery<span className="highlight">Box</span></span>
        </Link>

        <nav className="navbar-links">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
            Home
          </NavLink>
          <NavLink to="/cases" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Cases
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Dashboard
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active admin-link' : 'nav-link admin-link'}>
              Admin Panel
            </NavLink>
          )}
        </nav>

        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <span className={`role-badge ${user.role?.toLowerCase()}`}>
                {user.role === 'ADMIN' ? 'Chief Admin' : 'Investigator'}
              </span>
              <span className="user-name">{user.name}</span>
              <button onClick={handleLogout} className="btn-logout" title="Log out">
                Log Out
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Enlist Sleuth
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
