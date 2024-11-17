// Login component handling user authentication and form submission
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login-Page.css';

const LoginPage = ({ onLogin }) => {
  // Navigation hook for redirecting after login
  const navigate = useNavigate();

  // State management for form inputs and error messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Form input handler - trims username but preserves password spaces
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'username') setUsername(value.trim());
    else if (id === 'password') setPassword(value);
  };

  // Form submission handler with API integration
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Attempt login with provided credentials
      const response = await axios.post('http://localhost:5000/api/auth/login', { 
        username, 
        password 
      });
      console.log('Server response:', response);

      // Handle successful login
      if (response.data.message === "Login successful") {
        const user = response.data;
        onLogin(user.user);  // Update parent component state
        navigate('/', { state: { user } });  // Navigate to home with user data
      } else {
        setMessage('Invalid username or password');
      }
    } catch (error) {
      // Handle login failure
      console.error('Error during login:', error);
      setMessage('Error during login. Please try again.');
    }
  };

  return (
    <div className="page-container">
      <div className="main-content">
        <div className="login-page">
          <h2>Login</h2>
          {/* Login form */}
          <form className="login-form" onSubmit={handleSubmit}>
            {/* Username input field */}
            <div className="input-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleInputChange}
                placeholder="Enter your Username"
                required
              />
            </div>

            {/* Password input field */}
            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Submit button */}
            <button id="buttonLogin" type="submit">Login</button>
          </form>

          {/* Sign up link and error messages */}
          <p>Don't have an account? <Link to='/signup'>Sign Up</Link></p>
          {message && <p className="message">{message}</p>}
        </div>
      </div>

      {/* Footer */}
      <footer>
        <p>&copy; 2024 Maccabi React CF. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginPage;


