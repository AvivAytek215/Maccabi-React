import React, { useState, useEffect,useCallback ,useRef} from 'react';
import axios from 'axios';
import { useParams,useNavigate,useLocation } from 'react-router-dom';
import CustomAlert from './CustomAlert';
import LoadingSpinner from './Loading';
import { useCountdown} from './countTimeContext';
import './section.css';
//this component for the visualiztion of the seats and their status
const SeatSVG = ({ isSelected, isTaken, seatNumber }) => {
  let fillColor, textColor, pathFill;
  if (isSelected) {
    fillColor = "#22C55E"; // Green for selected seats
    textColor = "white";
    pathFill = "#16A34A"; // Darker green for the path of selected seats
  } else if (isTaken && !isSelected) {
    fillColor = "#9CA3AF"; // Grey for taken seats
    textColor = "#4B5563"; // Darker grey for text on taken seats
    pathFill = "#6B7280"; // Slightly darker grey for the path of taken seats
  } else {
    fillColor = "#3B82F6"; // Blue for available seats
    textColor = "white";
    pathFill = "#2563EB"; // Darker blue for the path of available seats
  }

  return (
    <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="30" height="30" rx="4" fill={fillColor} />
      <path d="M10 20C10 14.4772 14.4772 10 20 10C25.5228 10 30 14.4772 30 20V30H10V20Z" fill={pathFill} />
      <text x="20" y="25" fontSize="12" fill={textColor} textAnchor="middle" dominantBaseline="middle" fontWeight="bold">
        {seatNumber}
      </text>
    </svg>
  );
};

const Legend = () => (
  <div className="legend">
    <h3>Seat Legend</h3>
    <div className="legend-item">
      <SeatSVG isTaken={false} isSelected={false} seatNumber="" />
      <span>Available</span>
    </div>
    <div className="legend-item">
      <SeatSVG isTaken={false} isSelected={true} seatNumber="" />
      <span>Selected</span>
    </div>
    <div className="legend-item">
      <SeatSVG isTaken={true} isSelected={false} seatNumber="" />
      <span>Taken</span>
    </div>
  </div>
);
const SeatButton = ({ isTaken, seatNumber, isSelected, onSelect }) => (
  <button 
    className={`seat-button ${isTaken ? 'taken' : ''} ${isSelected ? 'selected' : ''}`} 
    onClick={onSelect}
    disabled={false}  // Always allow clicking
    aria-label={`Seat ${seatNumber}${isTaken ? ' (Taken)' : ''}${isSelected ? ' (Selected)' : ''}`}
  >
    <SeatSVG isSelected={isSelected} seatNumber={seatNumber} isTaken={isTaken}/>
  </button>
);
  //the main component that will recive the data fetch what neccesery from the server and render all components
  const SeatingChart = () => {
    const [seats, setSeats] = useState([]);
    const[game,setGame]=useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [unselectedSeats, setUnSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { gameId,sectionId} = useParams();
    const [alertVisible, setAlertVisible] = useState(false);
    const [showTimeoutAlert, setShowTimeoutAlert] = useState(false); 
    const [showBackButtonAlert, setShowBackButtonAlert] = useState(false);
    const navigate=useNavigate();
    const location = useLocation();
    const { user , section } = location.state || {};
    const MAX_SEATS=3;
    const { timeLeft, formatTime,resetTimer } = useCountdown();
    const stateRef = useRef({ user });
    useEffect(() => {
    stateRef.current =user;
  }, [user]);
    //fetching the data for the game from the server
    useEffect(()=>{
        const fetchGame=async()=>{       
             try {
            const response = await axios.get(`http://localhost:5000/api/GameById/${gameId}`);
            setGame(response.data[0]);
            setLoading(false);
          } catch (err) {
            console.error('Error fetching gamebyid:', err);
            setError(err.message);
            setLoading(false);
          }
        };
        fetchGame();
    },[gameId]);
  //fetching the seats for the section and the game that we need
    useEffect(() => {
      const fetchSeats = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/seats/${gameId}/${sectionId}`);
          setSeats(response.data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching seats:', err);
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchSeats();
    },[gameId,sectionId]);
  const updateSeats = useCallback(async () => {
    if (selectedSeats.length === 0) return; // Don't update if no seats are selected

    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/seats/updatet`, {selectedSeats});
      console.log(selectedSeats);
      // Handle the response if needed
      console.log('Seats updated successfully', response.data);
    } catch (err) {
      console.error('Error updating seats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedSeats]);
  const updateUnselectedSeats = useCallback(async () => {
    if (unselectedSeats.length === 0) return; // Don't update if no seats are selected


    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/seats/updatef`, {unselectedSeats});
      console.log(unselectedSeats);
      // Handle the response if needed
      console.log('Seats updated successfully', response.data);
    } catch (err) {
      console.error('Error updating seats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [unselectedSeats]);
  useEffect(() => {
    updateUnselectedSeats();
  }, [updateUnselectedSeats]);

  useEffect(() => {
    updateSeats();
  }, [updateSeats]);

  
  useEffect(() => {
    if (timeLeft <= 0) {
      setUnSelectedSeats(selectedSeats);
      updateUnselectedSeats(unselectedSeats);
      setShowTimeoutAlert(true);
    }
  }, [timeLeft,navigate,user,selectedSeats,updateUnselectedSeats,unselectedSeats]);

  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      setUnSelectedSeats(selectedSeats);
      updateUnselectedSeats(unselectedSeats);
      setShowBackButtonAlert(true);
      const currentState = stateRef.current;
    window.history.pushState({ ...currentState, backButtonPressed: true }, '');
    };
    window.history.pushState({ ...stateRef.current, backButtonPressed: false }, '');
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [updateUnselectedSeats, selectedSeats, unselectedSeats]);
  
  const handleBackButtonAlertClose = useCallback(() => {
    const preservedState = window.history.state || {};
    const user = preservedState;
    setShowBackButtonAlert(false);
    resetTimer();
    navigate('/tickets', { state: user });
  }, [navigate,resetTimer]);

  const handleTimeoutAlertClose = useCallback(() => {
    setShowTimeoutAlert(false);
    resetTimer();
    navigate('/tickets',{state:user});
  }, [navigate,user,resetTimer])
  //function that handles the seat selected by the user
  const handleSeatSelect = (seat) => {
    // If the seat is taken but not selected, we can't select it
    if (seat.isTaken && !selectedSeats.includes(seat._id)) {
      return;
    }
  
    if (selectedSeats.includes(seat._id)) {
      // Deselection: Remove from selectedSeats, add to unselectedSeats, and set isTaken to false
      setSelectedSeats(prevSelected => prevSelected.filter(id => id !== seat._id));
      setUnSelectedSeats(prevUnselected => [...prevUnselected, seat._id]);
    } else {
      // Selection: Add to selectedSeats if under the limit, remove from unselectedSeats if present, and set isTaken to true
      if (selectedSeats.length < MAX_SEATS) {
        setSelectedSeats(prevSelected => [...prevSelected, seat._id]);
        setUnSelectedSeats(prevUnselected => prevUnselected.filter(id => id !== seat._id));
      } else {
        setAlertVisible(true);
      }
    }
  };
    const handleAlertClose = () => {
    setAlertVisible(false);
  };
  //this function handles the buy button
  const handleBuy = () => {
    //find the seat by the id
    const selectedSeatsDetails = selectedSeats.map(seatId => {
      const seat = seats.find(s => s._id === seatId);
      return seat ? {_id:seat._id, row: seat.seatrow, number: seat.seatnum } : null;
    }).filter(Boolean);
    //calculate the total price of the order
    const numberOfSeats=selectedSeatsDetails.length;
    const totalPrice =numberOfSeats*section.price;
    //navigate to the payment page with the relevante data
    navigate('/payment', {
      state: {
        user,
        totalPrice,
        selectedSeats: selectedSeatsDetails,
        gameDetails: {
          id: gameId,
          homeTeam: game.homeTeam,
          awayTeam: game.awayTeam,
          date: game.date,
          section:section,
        }
      }
    });
  };
    
  const formatSelectedSeats = () => {
    if (selectedSeats.length === 0) return 'No seats selected';

    const selectedSeatsDetails = selectedSeats.map(id => {
      const seat = seats.find(s => s._id === id);
      return seat ? { row: seat.seatrow, seat: seat.seatnum } : null;
    }).filter(Boolean);

    // Sort seats by row and then by seat number
    selectedSeatsDetails.sort((a, b) => a.row - b.row || a.seat - b.seat);

    const groupedSeats = selectedSeatsDetails.reduce((acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = [];
      acc[seat.row].push(seat.seat);
      return acc;
    }, {});

    return Object.entries(groupedSeats).map(([row, seatNums]) => {
      if (seatNums.length === 1) {
        return `Row ${row}: Seat ${seatNums[0]}`;
      } else {
        const ranges = [];
        let range = [seatNums[0]];
        
        for (let i = 1; i < seatNums.length; i++) {
          if (seatNums[i] - seatNums[i-1] === 1) {
            range.push(seatNums[i]);
          } else {
            ranges.push(range);
            range = [seatNums[i]];
          }
        }
        ranges.push(range);
        //formating the display that it will be easy to understand
        const formattedRanges = ranges.map(r => 
          r.length === 1 ? `${r[0]}` : `${r[0]}-${r[r.length-1]}`
        );

        return `Row ${row}: Seat ${formattedRanges.join(', ')}`;
      }
    }).join('; ');
  };
  //loading until we got the response from the server and if there errr wi will present it
    if (loading) return <div><LoadingSpinner/></div>;
    if (error) return <div><CustomAlert 
    message={error}
    isVisible={alertVisible}
    onClose={handleAlertClose}
  /></div>;
    if (seats.length === 0) return <div><CustomAlert 
    message={"There is no seat for this game"}
    isVisible={alertVisible}
    onClose={handleAlertClose}
  /></div>;
    if (!game) return <div><CustomAlert 
    message={"Game information is not availabe"}
    isVisible={alertVisible}
    onClose={handleAlertClose}
  /></div>;
  
    const rows = seats.reduce((acc, seat) => {
      if (seat && typeof seat.seatrow !== 'undefined') {
        const rowNum = String(seat.seatrow);
        if (!acc[rowNum]) acc[rowNum] = [];
        acc[rowNum].push(seat);
      } else {
        console.warn('Invalid seat data:', seat);
      }
      return acc;
    }, {});
  
    return (
        <div className="container">
         <div className="countdown-timer">
        Time left: {formatTime(timeLeft)}
          </div>
          <main>
         <CustomAlert 
          message={`You can only select up to ${MAX_SEATS} seats.`}
          isVisible={alertVisible}
          onClose={handleAlertClose}
        />
              <CustomAlert 
        message="Your seat will be free. Are you sure?"
        isVisible={showBackButtonAlert}
        onClose={handleBackButtonAlertClose}
      />
          <h2>Select Your Seats for {game.homeTeam || 'Home Team'} VS {game.awayTeam || 'Away Team'}</h2>
            <div className="section-frame">
              <div className="legend-and-stage">
                <Legend />
                <div className="stage"></div>
              </div>
              <div className="seating-chart">
                {Object.entries(rows).sort(([a], [b]) => Number(a) - Number(b)).map(([rowNumber, rowSeats]) => (
                  <div key={rowNumber} className="row">
                    <span className="row-number">Row {rowNumber}</span>
                    <div className="seats">
                      {rowSeats.sort((a, b) => a.seatnum - b.seatnum).map((seat) => (
                        <SeatButton
                          key={seat._id}
                          seatNumber={seat.seatnum}
                          isSelected={selectedSeats.includes(seat._id)}
                          isTaken={seat.isTaken}
                          onSelect={() => handleSeatSelect(seat)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="selected-seats-info">
              <h3>Selected Seats</h3>
                <p>{formatSelectedSeats()}</p>
            </div>
            <button onClick={handleBuy} className="buy-button" disabled={selectedSeats.length === 0}>
              Buy Tickets
            </button>
            <div>
      <CustomAlert 
        message="Time's up! You will be redirected to the tickets page."
        isVisible={showTimeoutAlert}
        onClose={handleTimeoutAlertClose}
      />
    </div>
          </main>
        </div>
      );
    };
  
  export default SeatingChart;