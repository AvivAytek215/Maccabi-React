import React, { useState, useEffect } from 'react';
import './Player.css';
import LoadingSpinner from './Loading';

const PlayerGrid = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/Players/allPlayers');
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error('Error fetching players:', error);
        setError('Failed to load players');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const POSITION_MAPPINGS = {
    'CB': 'Defence',
    'LB': 'Defence',
    'RB': 'Defence',
    'LWB': 'Defence',
    'RWB': 'Defence',
    'CM': 'Midfield',
    'CDM': 'Midfield',
    'CAM': 'Midfield',
    'LM': 'Midfield',
    'RM': 'Midfield',
    'ST': 'Attack',
    'CF': 'Attack',
    'RW': 'Attack',
    'LW': 'Attack',
    'GK': 'Goalkeeper',
    'COACH': 'Coach'
  };

  const POSITION_ORDER = {
    'Goalkeeper': 1,
    'Defence': 2,
    'Midfield': 3,
    'Attack': 4,
    'Coach': 5
  };

  const normalizePosition = (position) => {
    if (!position) return 'Other';
    const upperPosition = position.toUpperCase().trim();
    return POSITION_MAPPINGS[upperPosition] || 'Other';
  };

  const groupPlayersByPosition = (playersList) => {
    // Return empty groups if players is undefined or empty
    if (!playersList || !Array.isArray(playersList) || playersList.length === 0) {
      return {
        Goalkeeper: [],
        Defence: [],
        Midfield: [],
        Attack: [],
        Coach: []
      };
    }

    const groups = {
      Goalkeeper: [],
      Defence: [],
      Midfield: [],
      Attack: [],
      Coach: []
    };

    playersList.forEach(player => {
      if (player && player.position) {
        const category = normalizePosition(player.position);
        if (groups[category]) {
          groups[category].push(player);
        }
      }
    });

    // Sort players within each group by number
    Object.keys(groups).forEach(category => {
      if (category !== 'Coach') {
        groups[category].sort((a, b) => (a.number || 99) - (b.number || 99));
      }
    });

    return groups;
  };

  if (loading) {
    return <div className="text-center py-8"><LoadingSpinner/></div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  const grouped = groupPlayersByPosition(players);

  return (
    <div className="container">
      {Object.entries(grouped).map(([position, positionPlayers]) => (
        positionPlayers.length > 0 && (
          <div key={position} className="position-section">
            <h2 className="position-title">
              {position}
            </h2>
            <div className="players-grid">
              {positionPlayers.map(player => (
                player && (
                  <div key={player._id} className="player-card">
                    <h3 className="player-name">{player.fullName}</h3>
                    <div className="player-info">
                     <span>{player.position}</span>
                        {player.position !== "Coach" && player.number && (
                        <span className="player-number ml-2">
                        {player.number}
                        </span>
                         )}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default PlayerGrid;