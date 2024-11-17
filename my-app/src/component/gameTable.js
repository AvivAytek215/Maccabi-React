// Component for displaying upcoming games schedule and handling ticket purchases
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './gameTable.css';
import LoadingSpinner from './Loading';
import CustomAlert from './CustomAlert';

const GameTable = ({ user }) => {
  // State management for games data and UI controls
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alertState, setAlertState] = useState({ isVisible: false, message: '' });
  const navigate = useNavigate();

  // Handler for ticket purchase attempts with access control logic
  const handleTicketClick = useCallback((game) => {
    if (!user) {
      setAlertState({
        isVisible: true,
        message: "You need to be logged in to purchase tickets."
      });
      return;
    }
    
    // Calculate days until game for access control
    const currentDate = new Date();
    const gameDate = new Date(game.date);
    const daysDifference = Math.ceil((gameDate - currentDate) / (1000 * 60 * 60 * 24));

    // Ticket purchase access rules based on user status
    if (user.member && user.subscription === null && daysDifference <= 3) {
      navigate(`/Stadium/${game.gameId}`,{ state: user }  );
    } else if (user.subscription !== null && daysDifference <= 1) {
      navigate(`/Stadium/${game.gameId}`,{state:user});
    } else if (daysDifference <= 2) {
      navigate(`/Stadium/${game.gameId}`,{state:user});
    } else {
      setAlertState({
        isVisible: true,
        message: "Tickets are not available for purchase yet."
      });
    }
  }, [user, navigate]);

  // Alert handling functions
  const closeAlert = useCallback(() => {
    setAlertState({ isVisible: false, message: '' });
  }, []);

  const handleLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  // Fetch games data on component mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/Games/upcominggames');        
        setGames(response.data.message === "No games found" ? [] : response.data);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError(`Error fetching games: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Loading and error states handling
  if (loading) return <LoadingSpinner />;
  if (error) return <CustomAlert message={error} isVisible={true} onClose={() => setError('')} />;

  return (
    <div className="game-schedule">
      {games.length === 0 ? (
        <p>No games available</p>
      ) : (
        // Games display grid
        <div className="game-tables-container">
          {games.map((game) => (
            <div key={game.gameId} className="game-table">
              {/* Teams header with logos */}
              <div className="teams-header-horizontal">
                <div className="team-info-horizontal">
                  <h3>{game.homeTeam}</h3>
                  <img
                    src={`/Photos/${game.homeTeam}.png`}
                    alt={`${game.homeTeam} logo`}
                    className="team-logo-horizontal"
                  />
                </div>
                <div className="vs">VS</div>
                <div className="team-info-horizontal">
                  <h3>{game.awayTeam}</h3>
                  <img
                    src={`/Photos/${game.awayTeam}.png`}
                    alt={`${game.awayTeam} logo`}
                    className="team-logo-horizontal"
                  />
                </div>
              </div>

              {/* Game details section */}
              <div className="game-details">
                <p><strong>Date:</strong> {new Date(game.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {game.hour}</p>
                <p><strong>Location:</strong> {game.stadium}</p>
              </div>
              <button onClick={() => handleTicketClick(game)} className="ticket-button">Get Tickets</button>
            </div>
          ))}
        </div>
      )}

      {/* Alert component for user notifications */}
      <CustomAlert 
        message={alertState.message}
        isVisible={alertState.isVisible}
        onClose={closeAlert}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default GameTable;