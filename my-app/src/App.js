// App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './component/Login-Page';
import SignUp from './component/SignUp';
import Tickets from './component/tickets';
import Stadium from './component/Stadium';
import Section from './component/section';
import Paying from './component/PaymentPage';
import Homepage from './component/HomePage';
import Shop from './component/Shop';
import Cart from './component/Cart';
import Header from './component/Header';
import Product from './component/ProductPage';
import News from './component/newsPage';
import Article from './component/article';
import Account from './component/account';
import { CountdownProvider } from './component/countTimeContext';

// Component to render Header based on path
const HeaderWrapper = ({ isLoggedIn, user, onLogout }) => {
  const location = useLocation();
  const noHeaderPaths = ['/Shop', '/Cart'];

  if (noHeaderPaths.includes(location.pathname)) {
    return null;
  }

  return <Header isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} />;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track if user is logged in
  const [user, setUser] = useState('');  // Store logged-in user's 
  const [cartItems, setCartItems] = useState([]);

  // Function to handle login, called from LoginPage
  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUser(user); // Update the user state to the logged-in user's 
  };
  const updateCartItems = (items) => {
    setCartItems(items);
  };

  const emptyCart = () => {
    setCartItems([]);
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser('');  // Clear the userName on logout
  };

  return (
    <CountdownProvider>
      <BrowserRouter>
        {/* Pass isLoggedIn, userName, and onLogout to HeaderWrapper */}
        <HeaderWrapper isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/Login" element={<LoginPage onLogin={handleLogin} />} /> 
          <Route path="/signup" element={<SignUp />} /> 
          <Route path="/Tickets" element={<Tickets />} /> 
          <Route path="/Stadium/:gameId" element={<Stadium />} /> 
          <Route path="/section/:gameId/:sectionId" element={<Section />} /> 
          <Route path="/payment" element={<Paying />} />
          <Route path="/Shop" element={<Shop isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />} />
          <Route path="/product/:name" element={<Product />} />
          <Route path="/Cart" element={<Cart  items={cartItems}  updateCartItems={updateCartItems}  onEmptyCart={emptyCart} />} />
          <Route path="/Article" element={<News />} />
          <Route path="/account" element={<Account/>} />
          <Route path="/Article/:id" element={<Article />} />
        </Routes>
      </BrowserRouter>
    </CountdownProvider>
  );
};

export default App;


