import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './gameTable.css';

const GameTable = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate=useNavigate();
 const handleTicketClick=(game)=>{
  const gameId=game.gameId;
   return ()=> navigate(`/Stadium/${gameId}`);
  };
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/Games/upcoming');        
        if (response.data.message === "No games found") {
          setGames([]);
        } else {
          setGames(response.data);
        }
      } catch (err) {
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error data:', err.response.data);
          console.error('Error status:', err.response.status);
          console.error('Error headers:', err.response.headers);
        } else if (err.request) {
          // The request was made but no response was received
          console.error('No response received:', err.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', err.message);
        }
        setError(`Error fetching games: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
<div className="game-schedule">
  {games.length === 0 ? (
    <p>No games available</p>
  ) : (
    <div className="game-tables-container">
      {games.map((game) => (
        <div key={game.gameId} className="game-table">
          <div className="teams-header-horizontal">
            <div className="team-info-horizontal">
              <h3>{game.homeTeam}</h3>
              <img
                src={`/Photos/${game.homeTeam}.png`}
                alt={`${game.homeTeam} logo`}
                className="team-logo-horizontal"
              />
            </div>
            <div className="vs">
              VS
            </div>
            <div className="team-info-horizontal">
              <h3>{game.awayTeam}</h3>
              <img
                src={`/Photos/${game.awayTeam}.png`}
                alt={`${game.awayTeam} logo`}
                className="team-logo-horizontal"
              />
            </div>
          </div>
          <div className="game-details">
            <p>
              <strong>Date:</strong> {new Date(game.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong>{game.hour}
            </p>
            <p>
              <strong>Location:</strong> {game.stadium}
            </p>
          </div>
          <button onClick={handleTicketClick(game)} className="ticket-button">Get Tickets</button>
        </div>
      ))}
    </div>
  )}
</div>
  )
};

export default GameTable;
