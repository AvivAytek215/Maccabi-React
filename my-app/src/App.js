import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './component/Login-Page';
import SignUp from './component/SignUp';
import Tickets from './component/tickets';
import Stadium from './component/Stadium';
import Section from './component/section';
import Paying from './component/PaymentPage';
import Homepage from './component/HomePage';
const App = () => {
  return(
    <BrowserRouter>
       <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/Login" element={<LoginPage />} /> 
        <Route path="/signup" element={<SignUp />} /> 
        <Route path="/Tickets" element={<Tickets />} /> 
        <Route path="/Stadium/:gameId" element={<Stadium />} /> 
        <Route path="/section/:gameId/:sectionId" element={<Section />} /> 
        <Route path="/payment" element={<Paying/>}/>
        </Routes>
    </BrowserRouter>
  );
}; 


export default App;

