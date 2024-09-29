import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './component/Login-Page';
import SignUp from './component/SignUp';;

const App = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} /> 
        <Route path="/signup" element={<SignUp />} /> 
      </Routes>
    </BrowserRouter>
  );
}; 


export default App;

