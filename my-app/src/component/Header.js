// Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import HamburgerMenu from './HamburgerBar';
import './Header.css';

const Header = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    const handleLogoClicked = () => {
        navigate('/');
    }
    
    const handleLoginClick = () => {
        navigate('/Login');
    }

    return (
        <header className="header">
            <div className="header-left">
                <div className="hamburger-menu">
                    <HamburgerMenu/>
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
                    onClick={handleLogoClicked}
                />
            </div>
            <h1 className="team-name-header">Maccabi React Official Website</h1>
            {/* Right side - Login/Profile */}
            <div className="auth-section">
                {isLoggedIn ? (
                    <div className="profile-button">Profile</div>
                ) : (
                    <button className="login-button" onClick={handleLoginClick}>
                                Login
                            </button>
                        )}
            </div>
        </header>
    );
};

export default Header;