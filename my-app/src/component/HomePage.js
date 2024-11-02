import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './HomePage.css';  
import LoadingSpinner from './Loading';   
import Player from './Player';
import ArticlesSection from './article';

const HomePage = () => {
  const navigate = useNavigate();  // Hook for navigating to different routes
  const location = useLocation();  // Hook for accessing route location data
  const { user } = location.state || {};  // Extract user data if available

  // State variables to manage data and UI states
  const [nextMatch, setNextMatch] = useState(null);  // Stores the next match details
  const [loading, setLoading] = useState(true);  // Indicates if next match data is being loaded
  const [trophies, setTrophies] = useState([]);  // Stores the trophies data
  const [trophyLoading, setTrophyLoading] = useState(true);  // Indicates if trophies data is being loaded
  const [currentYear, setCurrentYear] = useState(1948);  // Year slider value, starting from the club's founding year
  const [displayedTrophies, setDisplayedTrophies] = useState({});  // Trophies count displayed based on the selected year
  const [message, setMessage] = useState('');  // Error message for next match fetch issues
  const [value, setValue] = useState(1948);  // Value of the year slider, from 1948 to present year
 

  // Define minimum and maximum years for the year slider
  const min = 1948; // Club founding year
  const max = 2024; // Current year
  
  // Maximum values for each trophy type, used to calculate progress percentages
  const trophyMaxValues = {
    'Champions League': 22,
    'Israeli Premier League': 20,
    'Israeli Cup': 5,
    'Toto Cup': 4,
    'Club World Cup': 6,
    'UEFA Super Cup': 7
  };

  // Component for the animated progress bar in the trophy display
  const AnimatedProgress = ({ value }) => {
    return (
      <div className="progress-wrapper">
        <div className="progress-container">
          <div 
            className="progress-bar"
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    );
  };

  // Trophy types, each with a specific image path for the icon
  const trophyTypes = [
    { name: 'Champions League', icon:`${process.env.PUBLIC_URL}/Photos/Cups/championsCup.png` },
    { name: 'Israeli Premier League', icon: `${process.env.PUBLIC_URL}/Photos/Cups/LeaguePlate.png` },
    { name: 'Israeli Cup', icon: `${process.env.PUBLIC_URL}/Photos/Cups/LeagueCup.png` },
    { name: 'Toto Cup', icon: `${process.env.PUBLIC_URL}/Photos/Cups/TotoCup.png` },
    { name: 'Club World Cup', icon: `${process.env.PUBLIC_URL}/Photos/Cups/ClubWorldCup.png` },
    { name: 'UEFA Super Cup', icon: `${process.env.PUBLIC_URL}/Photos/Cups/UEFACup.png` }
  ];

  // Fetch the upcoming match data when the component mounts
  useEffect(() => {
    const fetchNextGame = async () => {
      try {
        // Fetching next match from API
        const response = await fetch('http://localhost:5000/api/Games/upcoming');
        const data = await response.json();
        if (data.message === 'No upcoming games found') {
          setMessage(data.message);  // Set message if no match found
        } else {
          setNextMatch(data);  // Update state with match data
        }
        setLoading(false);  // Set loading to false once data is fetched
      } catch (error) {
        setMessage('Error fetching next match');  // Error message if fetch fails
        setLoading(false);  // Stop loading state
      }
    };
    fetchNextGame();
  }, []);

  // Fetch all trophies data when the component mounts
  useEffect(() => {
    const fetchTrophies = async () => {
      try {
        // Fetching trophies from API
        const response = await fetch('http://localhost:5000/api/alltrophies/alltrophies');
        const data = await response.json();
        setTrophies(data);  // Update state with trophies data
        setTrophyLoading(false);  // Stop loading state
      } catch (error) {
        console.error('Error fetching trophies:', error);
        setTrophyLoading(false);  // Stop loading state on error
      }
    };
    fetchTrophies();
  }, []);



  // Update displayed trophies based on the selected year (currentYear)
  useEffect(() => {
    const updatedTrophies = {};
    // Initialize trophies count to zero
    trophyTypes.forEach((type) => {
      updatedTrophies[type.name] = 0;
    });
    // Count trophies up to the selected year
    trophies.forEach((trophy) => {
      if (parseInt(trophy.yearReceived) <= currentYear) {
        updatedTrophies[trophy.competitionName] += 1;
      }
    });
    setDisplayedTrophies(updatedTrophies);  // Update displayed trophies
  }, [currentYear, trophies]);

  // Handle slider change to update the year and slider thumb position
  const handleSliderChange = (e) => {
    setValue(parseInt(e.target.value));
    setCurrentYear(parseInt(e.target.value));
  };

  // Calculate progress percentage for the slider track based on current year
  const calculateProgress = () => {
    return ((value - min) / (max - min)) * 100;
  };

  // Display loading spinner while data is being fetched
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
            <p>{message}</p>  // Display message if no match found or error
          )}
        </section>

        {/* Trophy Presentation Section */}
        <section className="legendary-track-record">
          <h2>A Legendary Track Record</h2>
          {trophyLoading ? (
            <div><LoadingSpinner /></div>  // Show spinner if trophies are loading
          ) : (
            <div>
              {/* Trophy Grid */}
              <div className="trophy-grid">
                {trophyTypes.map((type) => {
                  const currentValue = displayedTrophies[type.name] || 0;  // Current count of trophies
                  const maxValue = trophyMaxValues[type.name];  // Maximum value for trophy type
                  const percentage = (currentValue / maxValue) * 100;  // Calculate progress percentage
                  return (
                    <div key={type.name} className="trophy-item">
                      <img src={type.icon} alt={`${type.name} Icon`} className="trophy-icon" />
                      <h3>{type.name}</h3>
                      <div className="trophy-progress">
                        <p>{currentValue}</p>
                        <AnimatedProgress value={percentage} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Year Slider */}
              <div className="slider-container">
                <div className="slider-wrapper">
                  <div 
                    className="slider-track"
                    style={{
                      background: `linear-gradient(to right, #007BFF ${calculateProgress()}%, #E5E7EB ${calculateProgress()}%)`
                    }}
                  />
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={handleSliderChange}
                    className="year-slider"
                  />
                </div>
                <div className="year-display">
                  Year: {value}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Player Component */}
        <h1>Our Players</h1> 
        <div><Player/></div>

        {/* Articles Section */}
          <div><ArticlesSection/></div>
      </main>
    </div>
  );
};

export default HomePage;







