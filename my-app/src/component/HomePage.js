import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';  // Import CSS for styling the Home Page

const HomePage = () => {
  const navigate = useNavigate();  // Initialize useNavigate for navigation
  const [nextMatch, setNextMatch] = useState(null);  // State to store the next match object
  const [loading, setLoading] = useState(true);  // State to handle loading state
  const [message, setMessage] = useState('');  // State to handle messages (e.g., no games found)
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the hamburger menu

  // useEffect to fetch the next game when the component is mounted
  useEffect(() => {
    const fetchNextGame = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/games/upcoming');  
        const data = await response.json();  // Parse the response as JSON

        if (data.message === 'No upcoming games found') {
          // If no game is found, set a message instead of game data
          setMessage(data.message);
        } else {
          // Set the next match in state if found
          setNextMatch(data);
        }

        setLoading(false);  // Set loading to false after data is fetched
      } catch (err) {
        // If an error occurs, set a message
        setMessage('Error fetching next match');
        setLoading(false);  // Set loading to false even if there is an error
      }
    };

    fetchNextGame();  // Call the function to fetch the next game when the component is mounted
  }, []);  // Empty dependency array means this effect runs only once after the initial render

  // Helper function to format the date into a more readable format
  const formatDate = (isoDate) => {
    const dateObj = new Date(isoDate);
    return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

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

  if (loading) {
    return <div>Loading...</div>;  // Display loading text while fetching data
  }

  return (
    <div className="home-page">
      {/* Top Bar */}
      <header className="top-bar">
        {/* Hamburger Menu for Navigation Links */}
        <div className="hamburger-menu">
          <button className="hamburger-icon" onClick={toggleMenu}>
            &#9776;  {/* Unicode for the hamburger icon (three horizontal lines) */}
          </button>
        </div>

        {/* Club logo */}
        <div className="club-logo">
          <img src="MACCABI.png" alt="Maccabi React Logo" />  {/* Replace with the actual path to your logo */}
        </div>

        {/* Login button */}
        <div className="login-section">
          <button className="login-button" onClick={() => navigate('/Login')}>
            Login
          </button>
        </div>
      </header>

      {/* Sliding Menu Overlay */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenuOnClickOutside}>
          <div className="slide-menu">
            <button className="close-menu" onClick={toggleMenu}>
              &times;  {/* Unicode for the close 'X' icon */}
            </button>
            <nav className="menu-links">
              <Link to="/tickets" onClick={toggleMenu}>Tickets</Link>
              <Link to="/shop" onClick={toggleMenu}>Shop</Link>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">
        <h2>Next Match</h2>

        {/* Conditionally render match details if match data is available */}
        {nextMatch ? (
          <div className="match-presentation">
            <div className="teams">
              <span className="home-team">{nextMatch.homeTeam}</span>  {/* Display home team */}
              <span> vs </span>
              <span className="away-team">{nextMatch.awayTeam}</span>  {/* Display away team */}
            </div>
            <div className="match-details">
              <p>Date: {formatDate(nextMatch.date)}</p>  {/* Format and display match date */}
              <p>Time: {nextMatch.hour}</p>  {/* Display match time */}
              <p>Location: {nextMatch.stadium}</p>  {/* Display match stadium */}
            </div>
          </div>
        ) : (
          <p>{message}</p>  
        )}
      </main>
    </div>
  );
};

export default HomePage;


