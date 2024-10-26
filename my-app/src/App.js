import React from 'react';
import { BrowserRouter, Routes, Route,useLocation } from 'react-router-dom';
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
import { CountdownProvider } from './component/countTimeContext';

const HeaderWrapper = () => {
  const location = useLocation();
  const noHeaderPaths = ['/Shop', '/Cart']; // Add paths where you don't want the header

  if (noHeaderPaths.includes(location.pathname)) {
    return null;
  }

  return <Header />;
};
const App = () => {
  return(
    <CountdownProvider>
    <BrowserRouter>
    <HeaderWrapper />
       <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/Login" element={<LoginPage />} /> 
        <Route path="/signup" element={<SignUp />} /> 
        <Route path="/Tickets" element={<Tickets />} /> 
        <Route path="/Stadium/:gameId" element={<Stadium />} /> 
        <Route path="/section/:gameId/:sectionId" element={<Section />} /> 
        <Route path="/payment" element={<Paying/>}/>
        <Route path="/Shop" element={<Shop/>}/>
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/Cart" element={<Cart/>}/>
        </Routes>
    </BrowserRouter>
    </CountdownProvider>
    
  );
}; 


export default App;

