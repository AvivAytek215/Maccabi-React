import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './HomePage.css';  
import LoadingSpinner from './Loading';  
import HamburgerBar from './HamburgerBar';  

const HomePage = () => {
  const navigate = useNavigate();  // Navigation hook
  const location = useLocation();  // Hook to get the current location
  const { user } = location.state || {};  // Extract the user if available from location

  const [nextMatch, setNextMatch] = useState(null);  // State for storing the next match
  const [loading, setLoading] = useState(true);  // Loading state for fetching matches
  const [trophies, setTrophies] = useState([]);  // State for storing trophies
  const [trophyLoading, setTrophyLoading] = useState(true);  // Loading state for fetching trophies
  const [currentYear, setCurrentYear] = useState(1948);  // Slider for the year, starting at the founding year
  const [displayedTrophies, setDisplayedTrophies] = useState({});  // Displayed trophies based on the slider
  const [sliderPosition, setSliderPosition] = useState(0);  // State for tracking the slider thumb position
  const [message, setMessage] = useState('');  // Error message state

  const startYear = 1948;  // Club founding year
  const endYear = new Date().getFullYear();  // Current year

  // Trophy types with image paths for the icons
  const trophyTypes = [
    { name: 'Champions League', icon: '/Photos/ChampionsLeagueLogo.png' },
    { name: 'Israeli Premier League', icon: '/Photos/IsraeliPremierLeagueLogo.png' },
    { name: 'Israeli Cup', icon: '/Photos/IsraeliCupLogo.png' },
    { name: 'Toto Cup', icon: '/Photos/TotoCupLogo.png' },
    { name: 'Club World Cup', icon: '/Photos/ClubWorldCupLogo.png' },
    { name: 'UEFA Super Cup', icon: '/Photos/UEFASuperCupLogo.png' }
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
  }, []);

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
    
    // Initialize the trophy count to zero for all types
    trophyTypes.forEach((type) => {
      updatedTrophies[type.name] = 0;
    });

    // Count the trophies received up to the current year
    trophies.forEach((trophy) => {
      if (parseInt(trophy.yearReceived) <= currentYear) {
        updatedTrophies[trophy.competitionName] += 1;
      }
    });

    setDisplayedTrophies(updatedTrophies);  // Update the displayed trophies based on the current year
  }, [currentYear, trophies]);

  // Adjust the slider's thumb position dynamically
  const handleSliderChange = (e) => {
    const value = Number(e.target.value);
    setCurrentYear(value);
    
    // Calculate thumb position in percentage
    const sliderWidth = e.target.offsetWidth;
    const thumbPosition = ((value - startYear) / (endYear - startYear)) * sliderWidth;
    setSliderPosition(thumbPosition);  // Update thumb position for styling
  };

  if (loading) {
    return <div><LoadingSpinner /></div>;
  }

  return (
    <div className="home-page">
      <main className="main-content">
        {/* Next Match Presentation */}
        <section className="next-match-section">
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
        </section>

        {/* Trophy Presentation Section */}
        <section className="legendary-track-record">
          <h2>A Legendary Track Record</h2>
          {trophyLoading ? (
            <div><LoadingSpinner /></div>
          ) : (
            <div>
              <div className="trophy-grid">
                {trophyTypes.map((type) => (
                  <div key={type.name} className="trophy-item">
                    <img src={type.icon} alt={`${type.name} Icon`} className="trophy-icon" />
                    <h3>{type.name}</h3>
                    <p>{displayedTrophies[type.name]}</p>
                  </div>
                ))}
              </div>

              {/* Year Slider */}
              <div className="year-slider-wrapper">
                {/* Slider input */}
                <input
                  type="range"
                  min={startYear}
                  max={endYear}
                  value={currentYear}
                  onChange={handleSliderChange}
                  className="year-slider"
                />
                
                {/* Year displayed above the slider thumb */}
                <div className="slider-thumb-label" style={{ left: `${sliderPosition}px` }}>
                  {currentYear}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomePage;






