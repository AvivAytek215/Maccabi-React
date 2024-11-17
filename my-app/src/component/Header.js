// Main header component with navigation, authentication, and responsive design
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import HamburgerMenu from './HamburgerBar';
import './Header.css';

const Header = ({ isLoggedIn, user, onLogout}) => {
    const navigate = useNavigate();
    // State and ref for user dropdown menu
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

    // Navigation handlers
    const handleLogoClicked = () => {
        navigate('/');
    };

    const handleLoginClick = () => {
        navigate('/Login');
    };

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    const handleAccountClick = () => {
        navigate('/account', { state: { user } });
    };

    // Toggle dropdown menu visibility
    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
    };

    // Click outside listener to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="header">
            {/* Left section: Hamburger menu, logos */}
            <div className="header-left">
                <div className="hamburger-menu">
                    <HamburgerMenu />
                </div>
                {/* Sponsor and team logos */}
                <img
                    src={`${process.env.PUBLIC_URL}/Photos/sponsor.png`} 
                    className="sponsor-logo" 
                    alt="sponsor logo"
                />
                <img
                    src={`${process.env.PUBLIC_URL}/Photos/Maccabi React.png`}
                    alt="Team Logo"
                    className="team-logo"
                    onClick={handleLogoClicked}
                />
            </div>
    
            {/* Center section: Website title */}
            <h1 className="team-name-header">Maccabi React Official Website</h1>
    
            {/* Right section: Authentication controls */}
            <div className="auth-section">
                {isLoggedIn ? (
                    // User profile dropdown when logged in
                    <div className="user-icon-wrapper" ref={dropdownRef}>
                        <img 
                            src={`${process.env.PUBLIC_URL}/Photos/user-icon.png`} 
                            alt="User Icon" 
                            className="user-icon" 
                            onClick={toggleDropdown} 
                            title="User Profile"
                        />
                        {/* Conditional dropdown menu */}
                        {dropdownVisible && (
                            <div className="user-dropdown">
                                <p>Hello, {user.Username}</p>
                                <button onClick={handleAccountClick}>Account</button>
                                <button onClick={onLogout}>Log Out</button>
                            </div>
                        )}
                    </div>
                ) : (
                    // Login/Signup buttons when not logged in
                    <div className="auth-buttons">
                        <button className="login-button" onClick={handleLoginClick}>
                            Login
                        </button>
                        <button className="signup-button" onClick={handleSignUpClick}>
                            Sign Up
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;