// StadiumMap.js
import React from 'react';
import './Stadium.css'; // Create a CSS file for styles

const StadiumMap = () => {
  const handleClick = (section) => {
    alert(`Section ${section} clicked!`);
    // Add your logic here (e.g., navigate to another page, show details, etc.)
  };

  return (
    <div className="stadium-container">
      <img 
        src="/Photos/maccabi React_Stadium.png" 
        alt="Stadium" 
        className="stadium-image" 
      />
      <div className="section" style={{ top: '10%', left: '20%' }} onClick={() => handleClick(1)}></div>
      <div className="section" style={{ top: '10%', left: '40%' }} onClick={() => handleClick(2)}></div>
      <div className="section" style={{ top: '10%', left: '60%' }} onClick={() => handleClick(3)}></div>
      <div className="section" style={{ top: '30%', left: '20%' }} onClick={() => handleClick(4)}></div>
      <div className="section" style={{ top: '30%', left: '40%' }} onClick={() => handleClick(5)}></div>
      <div className="section" style={{ top: '30%', left: '60%' }} onClick={() => handleClick(6)}></div>
      <div className="section" style={{ top: '50%', left: '20%' }} onClick={() => handleClick(7)}></div>
      <div className="section" style={{ top: '50%', left: '40%' }} onClick={() => handleClick(8)}></div>
      <div className="section" style={{ top: '50%', left: '60%' }} onClick={() => handleClick(9)}></div>
      <div className="section" style={{ top: '70%', left: '20%' }} onClick={() => handleClick(10)}></div>
      <div className="section" style={{ top: '70%', left: '40%' }} onClick={() => handleClick(11)}></div>
      <div className="section" style={{ top: '70%', left: '60%' }} onClick={() => handleClick(12)}></div>
    </div>
  );
};

export default StadiumMap;
