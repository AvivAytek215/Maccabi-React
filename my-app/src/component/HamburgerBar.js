import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HamburgerBar.css';  // Import CSS for HamburgerBar styles

const HamburgerBar = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the hamburger menu
  const navigate = useNavigate();  // Initialize useNavigate for navigation

  // Toggle the hamburger menu's visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);  // Toggle the state between true and false for the menu
  };

  // Close the menu when clicking outside of it
  const closeMenuOnClickOutside = (e) => {
    if (e.target.className === 'menu-overlay') {
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* Conditionally render the logo only when the menu is closed */}
      <div className={`hamburger-menu ${isMenuOpen ? "menu-open" : ''}`}>
        <button className="hamburger-icon" onClick={toggleMenu}>
          &#9776;
        </button>
      </div>
      {/* Sliding Menu Overlay */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenuOnClickOutside}>
          <div className="slide-menu">
            <button className="close-menu" onClick={toggleMenu}>
              &times;  {/* Unicode for the close 'X' icon */}
            </button>
            <nav className="menu-links">
              <Link to="/Tickets" state={{ user: user }} onClick={toggleMenu}>
                Tickets
              </Link>
              <Link to="/Shop" state={{ user: user }} onClick={toggleMenu}>
                Shop
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default HamburgerBar;
