import React, { useState } from 'react';
import LoginPage from './component/Login-Page';
import SignUp from './component/SignUp';;

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

    if (currentPage === '') {
      return <LoginPage />;
    } else if (currentPage === 'signup') {
      return <SignUp />;
    }
  }; 

export default App;

