import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './component/Login-Page';
import SignUp from './component/SignUp';
import Tickets from './component/tickets';
import NavigationBar from './component/navigationbar';
import Stadium from './component/Stadium';

const App = () => {
  return(
    <BrowserRouter>
     <NavigationBar/>
       <Routes>
        <Route path="/home" element={<LoginPage />} /> 
        <Route path="/signup" element={<SignUp />} /> 
        <Route path="/tickets" element={<Tickets />} /> 
        <Route path="/" element={<Stadium />} /> 
        </Routes>
    </BrowserRouter>
  );
}; 


export default App;

