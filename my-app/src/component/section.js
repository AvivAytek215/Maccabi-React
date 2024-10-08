import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './section.css';
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
  const SeatButton = ({ isTaken,seatNumber, isSelected, onSelect }) => (
    <button     className={`seat-button ${isTaken ? 'taken' : ''}`} 
    onClick={() => !isTaken && onSelect(isSelected)}
    disabled={isTaken}
    aria-label={`Seat ${seatNumber}${isTaken ? ' (Taken)' : ''}`}>
      <SeatSVG isSelected={isSelected} seatNumber={seatNumber} isTaken={isTaken}/>
    </button>
  );
  
  const SeatingChart = () => {
    const [seats, setSeats] = useState([]);
    const[game,setGame]=useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { gameId, sectionId } = useParams();
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
  
    const handleSeatSelect = (seat) => {
        if (!seat.isTaken) {
          setSelectedSeats((prevSelected) =>
            prevSelected.includes(seat._id)
              ? prevSelected.filter((id) => id !== seat._id)
              : [...prevSelected, seat._id]
          );
        }
      };
  
    const handleBuy = () => {
      console.log(`Purchasing tickets for seats: ${selectedSeats.join(', ')}`);
    };
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (seats.length === 0) return <div>No seats available for this section.</div>;
    if (!game) return <div>Game information not available.</div>;
  
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
              <p>
                {selectedSeats.length > 0
                  ? selectedSeats.map(id => {
                      const seat = seats.find(s => s._id === id);
                      return seat ? `Row ${seat.seatrow}, Seat ${seat.seatnum}` : '';
                    }).filter(Boolean).join(', ')
                  : 'No seats selected'}
              </p>
            </div>
            <button onClick={handleBuy} className="buy-button" disabled={selectedSeats.length === 0}>
              Buy Tickets
            </button>
          </main>
        </div>
      );
    };
  
  export default SeatingChart;