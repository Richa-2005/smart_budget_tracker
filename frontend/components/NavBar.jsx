import React from 'react'
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="navbar">

      <div className="navbar-container">
        <div className="navbar-logo">
          
          <Link to="/"><img src ="{/* logo path*/}"/></Link>

        </div>

        <ul className="nav-links">
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

