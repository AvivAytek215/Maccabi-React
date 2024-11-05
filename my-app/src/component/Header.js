// Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import HamburgerMenu from './HamburgerBar'; // Importing the Hamburger menu component for the navigation menu
import './Header.css'; // Importing the CSS file for styling the header

// Header component with props to handle login status, user data, and logout function
const Header = ({ isLoggedIn, user, onLogout }) => {
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

    // Function to navigate to the signup page when the signup button is clicked
    const handleSignUpClick = () => {
        navigate('/signup');
    };

    // Function to navigate to the account page when the account button in the dropdown is clicked
    const handleAccountClick = () => {
        navigate('/account', { state: { user } });
    };

    // Toggle dropdown visibility when user icon is clicked
    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev); // Invert the current state of `dropdownVisible`
    };

    // Effect to close the dropdown menu if the user clicks outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);  // Close the dropdown if clicking outside of it
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside); // Attach the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside); // Cleanup on component unmount
        };
    }, []);

    return (
        <header className="header">
            {/* Left side of the header with the hamburger menu, sponsor logo, and team logo */}
            <div className="header-left">
                <div className="hamburger-menu">
                    <HamburgerMenu /> {/* Hamburger menu for navigation */}
                </div>
                <img
                    src={`${process.env.PUBLIC_URL}/Photos/sponsor.png`} 
                    className="sponsor-logo" 
                    alt="sponsor logo"
                />
                <img
                    src={`${process.env.PUBLIC_URL}/Photos/Maccabi React.png`}
                    alt="Team Logo"
                    className="team-logo"
                    onClick={handleLogoClicked} // Navigate to home page on click
                />
            </div>

            <h1 className="team-name-header">Maccabi React Official Website</h1>

            {/* Right side of the header for authentication (login/signup or profile dropdown) */}
            <div className="auth-section">
                {isLoggedIn ? (
                    <div className="user-icon-wrapper" ref={dropdownRef}>
                        <img 
                            src={`${process.env.PUBLIC_URL}/Photos/user-icon.png`} 
                            alt="User Icon" 
                            className="user-icon" 
                            onClick={toggleDropdown} 
                            title="User Profile"
                        />
                        {dropdownVisible && (
                            <div className="user-dropdown">
                                <p>Hello, {user.Username}</p> {/* Display the user's name */}
                                <button onClick={handleAccountClick}>Account</button>
                                <button onClick={onLogout}>Log Out</button>
                            </div>
                        )}
                    </div>
                ) : (
                    // Display Login and Sign Up buttons if the user is not logged in
                    <>
                        <button className="login-button" onClick={handleLoginClick}>
                            Login
                        </button>
                        <button className="signup-button" onClick={handleSignUpClick}>
                            Sign Up
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
