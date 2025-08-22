import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navigateTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="left-section">
          <div className="hamburger-menu" onClick={toggleMenu}>
            <div className={`hamburger-line ${menuOpen ? 'line1-active' : ''}`}></div>
            <div className={`hamburger-line ${menuOpen ? 'line2-active' : ''}`}></div>
            <div className={`hamburger-line ${menuOpen ? 'line3-active' : ''}`}></div>
          </div>
          <div className="company-logo" onClick={() => navigateTo('/')}>
            SalesVision
          </div>
        </div>
      </div>
      
      <div className={`menu-overlay ${menuOpen ? 'menu-active' : ''}`}>
        <div className="menu-items">
          <div className="menu-item" onClick={() => navigateTo('/survey-branches')}>
            Survey Branches
          </div>
          <div className="menu-item" onClick={() => navigateTo('/survey-stores')}>
            Survey Stores
          </div>
          <div className="menu-item" onClick={() => navigateTo('/employees')}>
            Employees List
            </div>
          <div className="menu-item" onClick={() => navigateTo('/store')}>
            Store List
          </div>
          <div className="menu-item" onClick={() => navigateTo('/')}>
            Back to Dashboard
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;