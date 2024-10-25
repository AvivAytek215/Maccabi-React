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
            <div className="header-container">
                <div className="header-content">
                    {/* Left side - Logos */}
                    <div className="header-logos">
                        <img
                            src={`${process.env.PUBLIC_URL}/Photos/MaccabiReact.png`}
                            alt="Team Logo"
                            className="team-logo"
                            onClick={handleLogoClicked}
                        />
                        <img
                            src={`${process.env.PUBLIC_URL}/Photos/sponsor.png`} 
                            className="sponser-logo"
                        />
                        
                    </div>
                    <div className="mobile-menu">
                        <HamburgerMenu/>
                    </div>

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
                </div>
            </div>
        </header>
    );
};

export default Header;