import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  // State to track whether the menu is open or closed
  const [menuOpen, setMenuOpen] = useState(false); // Initial state should be false
  // Function to toggle the menu open/closed
  const toggleMenu = () => {
    console.log("clicking the ham button");
    setMenuOpen(prevState => !prevState); // Toggle the current state
  };

  return (
    <header>
      <div className="logo-container">
        <img src={'Photos/navigationIcon.png'} alt="Logo" />
      </div>

      {/* Hamburger Icon */}
      <div className="hamburger" onClick={toggleMenu}>
        <div className={`bar1 ${menuOpen ? 'change' : ''}`}></div>
        <div className={`bar2 ${menuOpen ? 'change' : ''}`}></div>
        <div className={`bar3 ${menuOpen ? 'change' : ''}`}></div>
      </div>

      {/* Navigation Links - show/hide based on menu state */}
      <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/news">News</Link></li>
          <li><Link to="/matches">Matches</Link></li>
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/tickets">Tickets</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default NavigationBar;




