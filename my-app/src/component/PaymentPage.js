// Payment page component handling both ticket and shop purchase workflows
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PaymentPage.css';
import LoadingSpinner from './Loading';
import CustomAlert from './CustomAlert';

const PaymentPage = () => {
  // Get route state and extract necessary data
  const location = useLocation();
  const { user, totalPrice,string, gameDetails, items } = location.state || {};
  // State management for alerts and UI interactions
  const [showTimeoutAlert, setShowTimeoutAlert] = useState(false);
  const [showBackButtonAlert, setShowBackButtonAlert] = useState(false);
  const [unselectedSeats, setUnSelectedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState(location.state?.selectedSeats || []);
  const [loading, setLoading] = useState(false);

  // Payment form field states
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [id, setId] = useState('');
  
  // Payment status management
  const [alertVisible, setAlertVisible] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('DisApproved');

  // Hooks for navigation and timer
  const navigate = useNavigate();

  // Flag to determine if user came from shop or ticket selection
  const cameFromShop = location.state?.fromShop || false;

  // Persist cart items in localStorage when they change
  useEffect(() => {
    if (items) {
      localStorage.setItem('cartItems', JSON.stringify(items));
    }
  }, [items]);
  
  // Reference to maintain state across rerenders
  const stateRef = useRef({ 
    user, 
    totalPrice, 
    selectedSeats, 
    string,
    gameDetails,
    items: items || JSON.parse(localStorage.getItem('cartItems')) || [] 
  });
  if (stateRef.current.string) {
    localStorage.setItem('pageSource', stateRef.current.string);
}

  // Keep stateRef updated with latest values
  useEffect(() => {
    stateRef.current = { user, totalPrice, selectedSeats: selectedSeats || [],string, gameDetails, items };
  }, [user, totalPrice, selectedSeats, gameDetails,string, items]);

  // Handle updating unselected seats in the database
  const updateUnselectedSeats = useCallback(async () => {
    if (unselectedSeats.length === 0) return;
    setLoading(true);
    try {
      const seatsToUpdate = unselectedSeats.map(seat => seat._id);
      const response = await axios.post(`http://localhost:5000/api/seats/updatef`, 
        { unselectedSeats: seatsToUpdate }
      );
      console.log('Seats updated successfully', response.data);
    } catch (err) {
      console.error('Error updating seats:', err);
    } finally {
      setLoading(false);
    }
  }, [unselectedSeats]);

  // Update seats whenever unselectedSeats changes
  useEffect(() => {
    updateUnselectedSeats();
  }, [updateUnselectedSeats]);
  
  // Handle timer expiration for ticket selection
  useEffect(() => {
    if (!cameFromShop) {
      setUnSelectedSeats(stateRef.selectedSeats || []);
      updateUnselectedSeats(unselectedSeats);
      setShowTimeoutAlert(true);
    }
  }, [ navigate, user, selectedSeats, updateUnselectedSeats, unselectedSeats]);

  // Handle browser back button
  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      setUnSelectedSeats(stateRef.current.selectedSeats || []);
      setShowBackButtonAlert(true);
      window.history.pushState({ 
        ...stateRef.current, 
        backButtonPressed: true,
        items: stateRef.current.items ,
        string:stateRef.current.string
      }, '');
    };

    // Initialize history state
    window.history.pushState({ 
      ...stateRef.current, 
      backButtonPressed: false,
      items: stateRef.current.items ,
      string:stateRef.current.string
    }, '');
    
    window.addEventListener('popstate', handleBackButton);
    return () => window.removeEventListener('popstate', handleBackButton);
  }, []);

  // Alert handling callbacks
  const handleBackButtonAlertClose = useCallback(() => {
    setShowBackButtonAlert(false);
    const preservedState = window.history.state || {};
    const currentItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const { user, selectedSeats: preservedSelectedSeats,string:preString} = preservedState;
    const currentString = stateRef.current.string|| localStorage.getItem('pageSource');
    console.log(currentString)
    if (preservedSelectedSeats) {
      setSelectedSeats(preservedSelectedSeats);
      updateUnselectedSeats(preservedSelectedSeats);
    }
    // Navigate based on origin (shop or tickets)
    navigate(
      currentString  === "section" ? '/tickets' : '/Shop',
      {
        state: currentString  === "section"
          ? { user, selectedSeats: preservedSelectedSeats }
          : { user, items: currentItems }
      }
    );
  }, [navigate, updateUnselectedSeats]);

  // Handle payment status alert closure
  const handleAlertClose = useCallback(() => {
    setAlertVisible(false);
    if (paymentStatus === 'Approved') {
      navigate('/', { state: user });
    }
  }, [navigate, user, paymentStatus]);

  // Handle form submission and payment processing
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertVisible(false);
    setPaymentStatus('Processing');

    try {
      // Create ticket objects for each selected seat
      const createTicket = (seat) => {
        const userData = user.user;
        return {
          Userid: userData.ID,
          gameId: gameDetails.id,
          seatrow: seat.row,
          seatnum: seat.number,
          section: gameDetails.section.id,
        };
      };

      const tickets = selectedSeats.map(createTicket);
      const response = await axios.post('http://localhost:5000/api/tickets/newTickets', { tickets });

      if (response.status >= 200 && response.status < 300) {
        setPaymentStatus('Approved');
        setAlertVisible(true);
        setTimeout(() => navigate('/', { state: { user } }), 2000);
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating tickets:', error);
      setPaymentStatus(`Failed: ${error.message}`);
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      {!cameFromShop && !showBackButtonAlert && <div className="countdown-timer">
      </div> }
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
      {loading && <LoadingSpinner />}
      {!loading && alertVisible && (
  <CustomAlert 
    message={`Your Payment is ${paymentStatus}`}
    isVisible={true}
    onClose={handleAlertClose}
  />
  
)}
  <CustomAlert 
      message={localStorage.getItem('pageSource') === "section" ? "Your seat will be free. Are you sure?" : "Back to shopping?"}
      isVisible={showBackButtonAlert}
      onClose={handleBackButtonAlertClose}
    />
    </div>
  );
};

export default PaymentPage;