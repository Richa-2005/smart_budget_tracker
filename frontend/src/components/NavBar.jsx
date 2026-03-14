import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiCalendar, FiBarChart2, FiUser } from 'react-icons/fi';
import '../styles/nav.css';

export default function NavBar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="top-nav-wrap">
      <div className="top-nav glass-card">
        <Link to="/" className="brand-block">
          <div className="brand-logo">₹</div>
          <div className="brand-text">
            <span className="brand-title">Smart Budget Tracker</span>
            <span className="brand-subtitle">Personal finance dashboard</span>
          </div>
        </Link>

        <div className="nav-center-links">
          <Link to="/" className={`nav-pill ${isActive('/') ? 'active' : ''}`}>
            <FiCalendar size={17} />
            <span>Calendar</span>
          </Link>

          <Link
            to="/activity"
            className={`nav-pill ${isActive('/activity') ? 'active' : ''}`}
          >
            <FiBarChart2 size={17} />
            <span>Insights</span>
          </Link>
        </div>

        <Link
          to="/account"
          className={`profile-link ${isActive('/account') ? 'active-profile' : ''}`}
          aria-label="Profile"
          title="Profile"
        >
          <FiUser size={18} />
        </Link>
      </div>
    </nav>
  );
}