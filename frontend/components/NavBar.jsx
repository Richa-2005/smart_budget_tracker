import React from 'react'
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="navbar">

      <div className="navbar-container">
        <div className="navbar-logo">
          
          <Link to="/"><img src ="{/* logo path*/}"/></Link>

        </div>

        <div className="nav-links">
          <button className="nav-item">
            <Link to="/" className="nav-link">Home</Link> 
          </button> <br />
          <button className="nav-item">
            <Link to="/activity" className="nav-link">Activity</Link>
          </button> <br />
          <button className="nav-item">
            <Link to="/account" className="nav-link">Account</Link>
          </button> <br />

        </div>
      </div>
    </nav>
  )
}

