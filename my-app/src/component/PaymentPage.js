import React, { useState,useEffect,useCallback,useRef} from 'react';
import {useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PaymentPage.css';
import LoadingSpinner from './Loading';
import CustomAlert from './CustomAlert';
import { useCountdown } from './countTimeContext';

const PaymentPage = () => {
  const location = useLocation();
  const {user, totalPrice, gameDetails, string ,items} = location.state || {};
  const [showTimeoutAlert, setShowTimeoutAlert] = useState(false); 
  const [showBackButtonAlert, setShowBackButtonAlert] = useState(false);
  const [unselectedSeats, setUnSelectedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState(location.state?.selectedSeats || []);
  const [loading, setLoading] = useState(false);
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
  const [paymentStatus, setPaymentStatus] = useState('DisApproved');
  const { timeLeft, formatTime,resetTimer } = useCountdown();
  const navigate=useNavigate();
    useEffect(() => {
    if (items) {
      localStorage.setItem('cartItems', JSON.stringify(items));
    }
  }, [items]);
  const stateRef = useRef({ user, totalPrice, selectedSeats, gameDetails,items:items || JSON.parse(localStorage.getItem('cartItems')) || [] });
    useEffect(() => {
    stateRef.current = { user, totalPrice, selectedSeats :selectedSeats || [], gameDetails,items };
  }, [user, totalPrice, selectedSeats, gameDetails,items]);

  const updateUnselectedSeats = useCallback(async () => {
    if (unselectedSeats.length === 0) return; // Don't update if no seats are selected
    console.log("entering update seats call back");
    setLoading(true);
    try {
      const seatsToUpdate = unselectedSeats.map(seat => seat._id);
      const response = await axios.post(`http://localhost:5000/api/seats/updatef`, {unselectedSeats:seatsToUpdate});
      console.log('Seats updated successfully', response.data);
    } catch (err) {
      console.error('Error updating seats:', err);
    } finally {
      setLoading(false);
    }
  }, [unselectedSeats]);

  useEffect(() => {
    updateUnselectedSeats();
  }, [updateUnselectedSeats]);
  useEffect(() => {
    if (timeLeft <= 0){
      setUnSelectedSeats(stateRef.selectedSeats|| []);
      updateUnselectedSeats(unselectedSeats);
      setShowTimeoutAlert(true);
    }
  },  [timeLeft,navigate,user,selectedSeats,updateUnselectedSeats,unselectedSeats]);  

 
  useEffect(() => {
    stateRef.current = { user, totalPrice, selectedSeats, gameDetails ,items};
  }, [user, totalPrice, selectedSeats, gameDetails,items]);

  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      setUnSelectedSeats(stateRef.current.selectedSeats || []);
      setShowBackButtonAlert(true);
      window.history.pushState({ ...stateRef.current, backButtonPressed: true,items: stateRef.current.items }, '');
    };

    window.history.pushState({ ...stateRef.current, backButtonPressed: false,items: stateRef.current.items }, '');
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);

  const handleBackButtonAlertClose = useCallback(() => {
    setShowBackButtonAlert(false);
    const preservedState = window.history.state || {};
    const currentItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const { user, selectedSeats: preservedSelectedSeats} = preservedState;
    if (preservedSelectedSeats) {
      setSelectedSeats(preservedSelectedSeats);
      updateUnselectedSeats(preservedSelectedSeats);
    }
    navigate(
      string === "section" 
        ? '/tickets' 
        : '/Shop', 
      { 
        state: string === "section" 
          ? { user, selectedSeats: preservedSelectedSeats } 
          : { user,items:currentItems } 
      }
    );
    
  }, [navigate, updateUnselectedSeats,string])

  const handleTimeoutAlertClose = useCallback(() => {
    setShowTimeoutAlert(false);
    resetTimer();
    navigate('/tickets',{state:user});
  }, [navigate,user,resetTimer])
  const handleAlertClose = useCallback(() => {
    setAlertVisible(false);
    if(paymentStatus==='Approved')
    {
      resetTimer();
      navigate('/',{state:user});
    }
  }, [navigate,user,resetTimer,paymentStatus])  
//function to handle ths submit of the form
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setAlertVisible(false);
  setPaymentStatus('Processing');
  try {
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

    console.log('Server response:', response);

    if (response.status >= 200 && response.status < 300) {
      setPaymentStatus('Approved');
      setAlertVisible(true);
      
      // Navigate after a short delay
      setTimeout(() => {
        navigate('/', { state: { user } });
      }, 2000);
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
      <div className="countdown-timer">
        Time left: {formatTime(timeLeft)}
      </div>
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
    message={`Your Time is Up! returning to the ticket Page`}
    isVisible={showTimeoutAlert}
    onClose={handleTimeoutAlertClose}
  />
  <CustomAlert 
      message={string === "section" ? "Your seat will be free. Are you sure?" : "Continue shopping?"}
      isVisible={showBackButtonAlert}
      onClose={handleBackButtonAlertClose}
    />
    </div>
  );
};

export default PaymentPage;