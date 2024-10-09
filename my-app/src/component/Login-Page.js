import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login-Page.css';
const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
//function for recieving the data from the user
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'username') setUsername(value.trim());
    else if (id === 'password') setPassword(value);
  };
//send the data to the server and check if there is an user and paswword correct
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      console.log('Server response:', response);
      if (response.data.message==="Login successful") {
        navigate('/tickets');
      } else {
        setMessage('Invalid username or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      setMessage('Error during login. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <header>
        <img src="https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg" alt="Real Madrid Logo" />
      </header>
      <section className="hero">
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
      </section>

      <footer>
        <p>&copy; 2024 Real Madrid CF. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginPage;

