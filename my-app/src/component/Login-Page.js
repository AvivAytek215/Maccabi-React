// LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login-Page.css';

const LoginPage = ({ onLogin }) => {  // Receive onLogin prop from App
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Handle input changes for username and password
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'username') setUsername(value.trim());
    else if (id === 'password') setPassword(value);
  };

  // Submit login data to the server and check if credentials are correct
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      console.log('Server response:', response);

      if (response.data.message === "Login successful") {
        const user = response.data;  // Assuming user data is in response.data
        onLogin(user.user);  // Call onLogin with the user's name to update App state

        navigate('/', { state: { user } });  // Navigate to homepage with user data
      } else {
        setMessage('Invalid username or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('Error during login. Please try again.');
    }
  };

  return (
    <div className="page-container">
      <div className="main-content">
        <div className="login-page">
          <h2>Login</h2>
          <form className="login-form" onSubmit={handleSubmit}>
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
            <button id="buttonLogin" type="submit">Login</button>
          </form>
          <p>Don't have an account? <Link to='/signup'>Sign Up</Link></p>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
      <footer>
        <p>&copy; 2024 Maccabi React CF. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginPage;


