import React from 'react'
import { Link } from 'react-router-dom';
import '../components/nav.css'
export default function NavBar() {
  return (
    <nav className="navbar">

      <div className="navbar-container">

        <ul className="nav-links">
        <li className="logo"></li> <br />
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link> 
          </li> <br />
          <li className="nav-item">
            <Link to="/activity" className="nav-link">Activity</Link>
          </li> <br />
          <li className="nav-item">
            <Link to="/account" className="nav-link">Account</Link>
          </li> <br />
        </ul>
      </div>
    </nav>
  )
}

