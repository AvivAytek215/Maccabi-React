import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './HomePage.css';  
import LoadingSpinner from './Loading';  
import HamburgerBar from './HamburgerBar';  

const HomePage = () => {
  const navigate = useNavigate();  // For navigation
  const location = useLocation();
  const { user } = location.state || {};

  const [nextMatch, setNextMatch] = useState(null);  // State to store the next match
  const [loading, setLoading] = useState(true);  // Loading state for matches
  const [trophies, setTrophies] = useState([]);  // State to store trophies
  const [trophyLoading, setTrophyLoading] = useState(true);  // Loading state for trophies
  const [currentYear, setCurrentYear] = useState(1948);  // Updated default value to founding year (most left)
  const [displayedTrophies, setDisplayedTrophies] = useState({});  // State to store displayed trophies
  const [message, setMessage] = useState('');  // State to hold error or status messages
  

  const startYear = 1948;  // Club founding year
  const endYear = new Date().getFullYear();  // Current year

  // Updated trophy types to include icons
  const trophyTypes = [
    { name: 'Champions League', icon: '🏆' },
    { name: 'Israeli Premier League', icon: '⚽' },
    { name: 'Israeli Cup', icon: '🥇' },
    { name: 'Toto Cup', icon: '🏅' },
    { name: 'Club World Cup', icon: '🌍' },
    { name: 'UEFA Super Cup', icon: '🇪🇺' }
  ];

  // Fetch upcoming match
  useEffect(() => {
    const fetchNextGame = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/Games/upcoming');
        const data = await response.json();
        if (data.message === 'No upcoming games found') {
          setMessage(data.message);
        } else {
          setNextMatch(data);
        }
        setLoading(false);
      } catch (error) {
        setMessage('Error fetching next match');
        setLoading(false);
      }
    };
    fetchNextGame();
  }, []);  // Fetch only once on component mount

  // Fetch all trophies
  useEffect(() => {
    const fetchTrophies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/alltrophies/alltrophies');
        const data = await response.json();
        setTrophies(data);
        setTrophyLoading(false);
      } catch (error) {
        console.error('Error fetching trophies:', error);
        setTrophyLoading(false);
      }
    };
    fetchTrophies();
  }, []);

  // Update displayed trophies based on the current year
  useEffect(() => {
    const updatedTrophies = {};
    
    // Initialize all trophy types to 0
    trophyTypes.forEach((type) => {
      updatedTrophies[type.name] = 0;
    });

    // Loop through all trophies and accumulate the count based on year
    trophies.forEach((trophy) => {
      if (parseInt(trophy.yearReceived) <= currentYear) {
        updatedTrophies[trophy.competitionName] += 1;
      }
    });

    setDisplayedTrophies(updatedTrophies);  // Update displayed trophies based on the slider year
  }, [currentYear, trophies]);

  if (loading) {
    return <div><LoadingSpinner /></div>;  // Show loading spinner if still fetching match
  }

  return (
    <div className="home-page">
      <main className="main-content">
        <h2>Next Match</h2>
        {nextMatch ? (
          <div className="match-presentation">
            <div className="teams">
              <span className="home-team">{nextMatch.homeTeam}</span>
              <span> vs </span>
              <span className="away-team">{nextMatch.awayTeam}</span>
            </div>
            <div className="match-details">
              <p>Date: {nextMatch.date}</p>
              <p>Time: {nextMatch.hour}</p>
              <p>Location: {nextMatch.stadium}</p>
            </div>
          </div>
        ) : (
          <p>{message}</p>
        )}

        {/* Trophy Section */}
        <section className="legendary-track-record">
          <h2>A Legendary Track Record</h2>
          {trophyLoading ? (
            <div><LoadingSpinner /></div>
          ) : (
            <div>
              {/* Trophy Grid */}
              <div className="trophy-grid">
                {trophyTypes.map((type) => (
                  <div key={type.name} className="trophy-item">
                    <span className="trophy-icon">{type.icon}</span>
                    <h3>{type.name}</h3>
                    <p>{displayedTrophies[type.name]}</p>
                  </div>
                ))}
              </div>

              {/* Year Slider */}
              <div className="year-slider-wrapper">
                <p className="slider-label">{startYear}</p>
                <input
                  type="range"
                  min={startYear}
                  max={endYear}
                  value={currentYear}
                  onChange={(e) => setCurrentYear(Number(e.target.value))}
                  className="year-slider"
                />
                <p className="slider-label">{endYear}</p>
              </div>
              <p className="current-year-display">Year: {currentYear}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomePage;




