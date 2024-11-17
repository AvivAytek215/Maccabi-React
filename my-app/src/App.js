// Main application component handling routing and global state management
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
// Component imports
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

// Header wrapper component for conditional header rendering
const HeaderWrapper = ({ isLoggedIn, user, onLogout }) => {
  const location = useLocation();
  // Paths where header should not be shown
  const noHeaderPaths = ['/Shop', '/Cart'];

  // Conditionally render header based on current path
  if (noHeaderPaths.includes(location.pathname)) {
    return null;
  }

  return <Header isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} />;
};

const App = () => {
  // Global state management
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Authentication state
  const [user, setUser] = useState('');                 // User data
  const [cartItems, setCartItems] = useState([]);       // Shopping cart items

  // Authentication handlers
  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUser(user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser('');
  };

  // Cart management handlers
  const updateCartItems = (items) => {
    setCartItems(items);
  };

  const emptyCart = () => {
    setCartItems([]);
  };

  return (
    // Wrap application in countdown context provider
    <CountdownProvider>
      <BrowserRouter>
        {/* Conditional header rendering */}
        <HeaderWrapper 
          isLoggedIn={isLoggedIn} 
          user={user} 
          onLogout={handleLogout} 
        />

        {/* Application routes */}
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/Login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/Article" element={<News />} />
          <Route path="/Article/:id" element={<Article />} />

          {/* Ticket-related routes */}
          <Route path="/Tickets" element={<Tickets />} />
          <Route path="/Stadium/:gameId" element={<Stadium />} />
          <Route path="/section/:gameId/:sectionId" element={<Section />} />
          <Route path="/payment" element={<Paying />} />

          {/* Shop-related routes */}
          <Route 
            path="/Shop" 
            element={
              <Shop 
                isLoggedIn={isLoggedIn} 
                user={user} 
                onLogout={handleLogout} 
              />
            } 
          />
          <Route path="/product/:name" element={<Product />} />
          <Route 
            path="/Cart" 
            element={
              <Cart 
                items={cartItems}
                updateCartItems={updateCartItems}
                onEmptyCart={emptyCart}
              />
            } 
          />

          {/* User account route */}
          <Route path="/account" element={<Account/>} />
        </Routes>
      </BrowserRouter>
    </CountdownProvider>
  );
};

export default App;


