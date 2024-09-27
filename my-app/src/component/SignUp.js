import React, { useState } from 'react';
import './SignUp.css';
const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(''); // State for phone
  const [email, setEmail] = useState(''); // State for email
  const [id, setId] = useState(''); // State for ID
  // const [credit, setCredit] = useState(''); // State for credit
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState('signup');

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
//   const navigate = useNavigate(); // Get the navigate function

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'username':
        setUsername(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'id':
        setId(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST', // Changed method to POST
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, phone, email, id }), // Include all fields
      });

      const data = await response.json();
      console.log('Submitted Data:', { username, password, phone, email, id});

      if (response.ok) {
        setMessage('Signup successful!');
      } else {
        setMessage(data.message || 'Signup failed!'); // Show error message from server
      }
    } catch (error) {
      console.log('Network error:', error);
      setMessage('Error connecting to the server');
    }
  };
  return (
    <div className="SignUp">
      <h2>SignUp</h2>
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
        <div className="input-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="id">ID:</label>
          <input
            type="text"
            id="id"
            value={id}
            onChange={handleInputChange}
            placeholder="Enter your ID"
            required
          />
        </div>
        <button type="submit" onClick={() => handlePageChange('/')}>Sign Up</button>
        <div className="client-message">
          <label htmlFor="message">ID:</label>
          <input
            type="text"
            id="message"
            value={message}
          />
        </div>
      </form>
      <p className={message === 'Signup successful!' ? 'success-message' : 'error-message'}>{message}</p>
      <button onClick={() => handlePageChange('/')}>Go to Login</button>
    </div>
  );
};

export default SignUp;
