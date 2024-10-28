import React from 'react';
import './CustomAlert.css';
//function to retrieve alert with the template of the app
const CustomAlert = ({ message, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert">
        <p>{message}</p>
        <button onClick={onClose}>Go Back</button>
      </div>
    </div>
  );
};

export default CustomAlert;