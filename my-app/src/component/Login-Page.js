import React, { useState } from 'react';
import './Login-Page.css';
const LoginPage = () => {
  const [username, setUsername] = useState(' ');
  const [password, setPassword] = useState(' ');
  const [message, setMessage] = useState(' ');
  const [currentPage, setCurrentPage] = useState('home');

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
 // Get the navigate function

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
      <form onSubmit={handleSubmit}>
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
        <div className='button-group'>
        <button type="submit">Login</button>
        <button  onClick={() => handlePageChange('signup')}>Sign-Up</button>
        </div>
      </form>
      {message && <p>{message}</p>}
      <div className="client-message">
          <label htmlFor="message">ID:</label>
          <input
            type="text"
            id="message"
            value={message}
          />
        </div>
    </div>
  );
};

export default LoginPage;

