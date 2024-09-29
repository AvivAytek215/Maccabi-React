import React, { useState, useEffect } from 'react';
import './Login-Page.css';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'username') setUsername(value);
    else if (id === 'password') setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement your login logic here
    console.log('Logging in with:', { username, password });
    setMessage('Login successful!'); // Replace with actual logic
  };

  return (
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
            placeholder="Enter your username"
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
        <button id='buttonLogin' type="submit">Login</button>
        <Link to='/signup'>
          <button id='buttonSignUp' type="button">Sign Up</button>
        </Link>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginPage;