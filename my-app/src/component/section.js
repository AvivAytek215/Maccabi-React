import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';
import CustomAlert from './CustomAlert';
import LoadingSpinner from './Loading';
import './section.css';
//this component for the visualiztion of the seats and their status
const SeatSVG = ({ isSelected, isTaken, seatNumber }) => {
    let fillColor, textColor;
  
    if (isTaken) {
      fillColor = "#9CA3AF"; // Grey for taken seats
      textColor = "#4B5563"; // Darker grey for text on taken seats
    } else if (isSelected) {
      fillColor = "#22C55E"; // Green for selected seats
      textColor = "white";
    } else {
      fillColor = "#3B82F6"; // Blue for available seats
      textColor = "white";
    }
  //the details of the seats and their component details
    return (
      <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="30" height="30" rx="4" fill={fillColor} />
        <path d="M10 20C10 14.4772 14.4772 10 20 10C25.5228 10 30 14.4772 30 20V30H10V20Z" fill={isTaken ? "#6B7280" : (isSelected ? "#16A34A" : "#2563EB")} />
        <text x="20" y="25" fontSize="12" fill={textColor} textAnchor="middle" dominantBaseline="middle" fontWeight="bold">
          {seatNumber}
        </text>
      </svg>
    );
  };
  //component to persent the legend details
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
  //component that controll the button for each seat and set the data
  const SeatButton = ({ isTaken,seatNumber, isSelected, onSelect }) => (
    <button     className={`seat-button ${isTaken ? 'taken' : ''}`} 
    onClick={() => !isTaken && onSelect(isSelected)}
    disabled={isTaken}
    aria-label={`Seat ${seatNumber}${isTaken ? ' (Taken)' : ''}`}>
      <SeatSVG isSelected={isSelected} seatNumber={seatNumber} isTaken={isTaken}/>
    </button>
  );
  //the main component that will recive the data fetch what neccesery from the server and render all components
  const SeatingChart = () => {
    const [seats, setSeats] = useState([]);
    const[game,setGame]=useState(null);
    const[sectionPrice,setSectionPrice]=useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { gameId, sectionId } = useParams();
    const [alertVisible, setAlertVisible] = useState(false);
    const navigate=useNavigate();
    const MAX_SEATS=3;
    //fetching the data from the server of the price for the section 
    useEffect(()=>{
        const fetchSectionPrice=async()=>{       
             try {
            const response = await axios.get(`http://localhost:5000/api/sections/SectionPriceById/${sectionId}`);
            setSectionPrice(response.data);
            setLoading(false);
          } catch (err) {
            console.error('Error fetching gamebyid:', err);
            setError(err.message);
            setLoading(false);
          }
        };
        fetchSectionPrice();
    },[sectionId]);
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
    }, [gameId, sectionId]);
  //function that handles the seat selected by the user
    const handleSeatSelect = (seat) => {
        if (!seat.isTaken) {
          setSelectedSeats((prevSelected) => {
            if (prevSelected.includes(seat._id)) {
              // If seat is already selected, remove it
              return prevSelected.filter((id) => id !== seat._id);
            } else if (prevSelected.length < MAX_SEATS) {
              // If seat is not selected and we haven't reached the limit, add it
              return [...prevSelected, seat._id];
            } else {
              // If we've reached the limit, don't add the new seat
                setAlertVisible(true);
              return prevSelected;
            }
          });
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
      return seat ? { row: seat.seatrow, number: seat.seatnum, price: seat.price } : null;
    }).filter(Boolean);
    //calculate the total price of the order
    const numberOfSeats=selectedSeatsDetails.length;
    const totalPrice =numberOfSeats*sectionPrice;
    //navigate to the payment page with the relevante data
    navigate('/payment', {
      state: {
        totalPrice,
        selectedSeats: selectedSeatsDetails,
        gameDetails: {
          id: game.id,
          homeTeam: game.homeTeam,
          awayTeam: game.awayTeam,
          date: game.date,
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
          <main>
         <CustomAlert 
          message={`You can only select up to ${MAX_SEATS} seats.`}
          isVisible={alertVisible}
          onClose={handleAlertClose}
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
          </main>
        </div>
      );
    };
  
  export default SeatingChart;