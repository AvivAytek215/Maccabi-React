import React, { useState } from 'react';
import {useLocation } from 'react-router-dom';
import './PaymentPage.css';
import LoadingSpinner from './Loading';
import CustomAlert from './CustomAlert';

const PaymentPage = () => {
  const location = useLocation();
  const { totalPrice, selectedSeats, gameDetails } = location.state || {};
    //creating a form for paying this is all the input data
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [id,setId]=useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('DisApproved');
  console.log(JSON.stringify(totalPrice, null, 2));
  if (!totalPrice || !selectedSeats || !gameDetails) {
    return <div>Error: Missing payment information. Please go back and try again.</div>;
  }

//function to handle ths submit of the form
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPaymentStatus('Approved');

    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      setPaymentStatus('Payment Approved');
    }, 3000);
  };
  //function for the close of the alert
  const handleAlertClose = () => {
    setAlertVisible(false);
  };

  return (
    <div className="payment-page">
      <h2>Payment Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="text"
              id="expiryDate"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="MM/YY"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              id="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="name">Name on Card</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Billing Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St"
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="New York"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="zipCode">Zip Code</label>
            <input
              type="text"
              id="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="10001"
              required
            />
          </div>
        </div>
        <div>        
            <div className="form-group">
            <label htmlFor="Id">Id</label>
            <input
              type="text"
              id="zipCode"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="123456789"
              required
            />
          </div></div>
        <div className="order-summary">
          <h3>Order Summary</h3>
          <p>Total: {totalPrice}₪</p>
        </div>
        <button type="submit" className="pay-button">Pay Now</button>
      </form>
      {isLoading && <LoadingSpinner />}
      {paymentStatus && <div><CustomAlert 
       message={"Your Payment is"+{paymentStatus}}
      isVisible={alertVisible}
      onClose={handleAlertClose}
/></div>}
    </div>
  );
};

export default PaymentPage;