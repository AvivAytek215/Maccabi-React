// Component for displaying a grid of players organized by their positions
import React, { useState, useEffect } from 'react';
import './Player.css';
import LoadingSpinner from './Loading';

const PlayerGrid = () => {
  // State management for players data and UI states
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch players data on component mount
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

  // Position mappings for categorizing players
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

  // Define display order for position groups
  const POSITION_ORDER = {
    'Goalkeeper': 1,
    'Defence': 2,
    'Midfield': 3,
    'Attack': 4,
    'Coach': 5
  };

  // Helper function to normalize position strings
  const normalizePosition = (position) => {
    if (!position) return 'Other';
    const upperPosition = position.toUpperCase().trim();
    return POSITION_MAPPINGS[upperPosition] || 'Other';
  };

  // Function to group and sort players by their positions
  const groupPlayersByPosition = (playersList) => {
    // Initialize empty groups if no players
    if (!playersList || !Array.isArray(playersList) || playersList.length === 0) {
      return {
        Goalkeeper: [],
        Defence: [],
        Midfield: [],
        Attack: [],
        Coach: []
      };
    }

    // Create groups object with arrays for each position
    const groups = {
      Goalkeeper: [],
      Defence: [],
      Midfield: [],
      Attack: [],
      Coach: []
    };

    // Sort players into their respective position groups
    playersList.forEach(player => {
      if (player && player.position) {
        const category = normalizePosition(player.position);
        if (groups[category]) {
          groups[category].push(player);
        }
      }
    });

    // Sort players by number within each group (except coaches)
    Object.keys(groups).forEach(category => {
      if (category !== 'Coach') {
        groups[category].sort((a, b) => (a.number || 99) - (b.number || 99));
      }
    });

    return groups;
  };

  // Loading state display
  if (loading) {
    return <div className="text-center py-8"><LoadingSpinner/></div>;
  }

  // Error state display
  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  // Group players by their positions
  const grouped = groupPlayersByPosition(players);

  return (
    <div className="container">
      {/* Map through position groups and render sections */}
      {Object.entries(grouped).map(([position, positionPlayers]) => (
        positionPlayers.length > 0 && (
          <div key={position} className="position-section">
            <h2 className="position-title">
              {position}
            </h2>
            {/* Grid of players within each position */}
            <div className="players-grid">
              {positionPlayers.map(player => (
                player && (
                  <div key={player._id} className="player-card">
                    <h3 className="player-name">{player.fullName}</h3>
                    <div className="player-info">
                      <span>{player.position}</span>
                      {/* Show player number for all except coaches */}
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