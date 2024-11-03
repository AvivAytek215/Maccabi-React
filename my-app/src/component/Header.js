// Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import HamburgerMenu from './HamburgerBar'; // Importing the Hamburger menu component for the navigation menu
import './Header.css'; // Importing the CSS file for styling the header

// Header component with props to handle login status, user name, and logout function
const Header = ({ isLoggedIn, userName, onLogout }) => {
    const navigate = useNavigate(); // `useNavigate` hook for navigation within the app
    const [dropdownVisible, setDropdownVisible] = useState(false); // State to control the visibility of the dropdown menu
    const dropdownRef = useRef(null);  // Reference to the dropdown to detect outside clicks and close it

    // Function to navigate to the home page when the team logo is clicked
    const handleLogoClicked = () => {
        navigate('/');
    };

    // Function to navigate to the login page when the login button is clicked
    const handleLoginClick = () => {
        navigate('/Login');
    };

    // Function to navigate to the account page when the account button in the dropdown is clicked
    const handleAccountClick = () => {
        navigate('/account');
    };

    // Function to toggle the dropdown menu visibility when the user icon is clicked
    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev); // Invert the current state of `dropdownVisible`
    };

    // Effect to close the dropdown menu if the user clicks outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click target is outside the dropdown element
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);  // Set `dropdownVisible` to false to close the dropdown
            }
        };
        
        // Attach the event listener to detect clicks outside of the dropdown
        document.addEventListener('mousedown', handleClickOutside);
        
        // Clean up the event listener when the component is unmounted
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="header"> {/* Main header container */}
            {/* Left side of the header with the hamburger menu, sponsor logo, and team logo */}
            <div className="header-left">
                <div className="hamburger-menu"> {/* Container for the hamburger menu */}
                    <HamburgerMenu /> {/* Renders the HamburgerMenu component */}
                </div>
                
                {/* Sponsor logo */}
                <img
                    src={`${process.env.PUBLIC_URL}/Photos/sponsor.png`} 
                    className="sponsor-logo" // CSS class for styling the sponsor logo
                    alt="sponsor logo" // Alt text for accessibility
                />
                
                {/* Team logo, which navigates to the home page when clicked */}
                <img
                    src={`${process.env.PUBLIC_URL}/Photos/Maccabi React.png`}
                    alt="Team Logo"
                    className="team-logo" // CSS class for styling the team logo
                    onClick={handleLogoClicked} // Click handler to navigate to the home page
                />
            </div>

            {/* Centered team name or header text */}
            <h1 className="team-name-header">Maccabi React Official Website</h1>

            {/* Right side of the header for authentication (login or profile dropdown) */}
            <div className="auth-section">
                {isLoggedIn ? ( // Conditionally render based on login status
                    <div className="user-icon-wrapper" ref={dropdownRef}> {/* Wrapper for user icon and dropdown, uses `ref` for click detection */}
                        {/* User icon image */}
                        <img 
                            src={`${process.env.PUBLIC_URL}/Photos/user-icon.png`} // Custom user icon image
                            alt="User Icon" // Alt text for accessibility
                            className="user-icon" // CSS class for styling the user icon
                            onClick={toggleDropdown}  // Click handler to toggle the dropdown visibility
                            title="User Profile" // Tooltip text for the user icon
                        />
                        
                        {/* Dropdown menu, visible only if `dropdownVisible` is true */}
                        {dropdownVisible && (
                            <div className="user-dropdown">
                                {/* Greeting message with the logged-in user's name */}
                                <p>Hello, {userName}</p> {/* Display the user's name from the `userName` prop */}
                                
                                {/* Account button - navigates to the account page */}
                                <button onClick={handleAccountClick}>Account</button>
                                
                                {/* Log Out button - triggers the `onLogout` function to log the user out */}
                                <button onClick={onLogout}>Log Out</button>
                            </div>
                        )}
                    </div>
                ) : (
                    // Login button, visible if the user is not logged in
                    <button className="login-button" onClick={handleLoginClick}>
                        Login
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;

