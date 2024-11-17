// Component for responsive navigation hamburger menu with sliding panel
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HamburgerBar.css';

const HamburgerBar = ({ user }) => {
  // State to manage menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Menu visibility toggle handler
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking overlay (outside menu area)
  const closeMenuOnClickOutside = (e) => {
    if (e.target.className === 'menu-overlay') {
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* Hamburger button with dynamic classes for animation */}
      <div className={`hamburger-menu ${isMenuOpen ? "menu-open" : ''}`}>
        <button className="hamburger-icon" onClick={toggleMenu}>
          &#9776; {/* Unicode hamburger icon */}
        </button>
      </div>

      {/* Sliding menu panel with overlay - conditionally rendered */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenuOnClickOutside}>
          <div className="slide-menu">
            {/* Close button for menu */}
            <button className="close-menu" onClick={toggleMenu}>
              &times;
            </button>

            {/* Navigation links - passes user state to destinations */}
            <nav className="menu-links">
              <Link to="/" state={{ user: user }} onClick={toggleMenu}>
                Home
              </Link>
              <Link to="/Tickets" state={{ user: user }} onClick={toggleMenu}>
                Tickets
              </Link>
              <Link to="/Shop" state={{ user: user }} onClick={toggleMenu}>
                Shop
              </Link>
              <Link to="/Article" state={{ user: user }} onClick={toggleMenu}>
                Article
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default HamburgerBar;
