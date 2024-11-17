// Main home page component featuring next match details, trophy history, players, and articles
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './HomePage.css';  
import LoadingSpinner from './Loading';   
import Player from './Player';
import ArticlesSection from './HomePageArticle';

const HomePage = () => {
  // Navigation and routing hooks
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = location.state || {};

  // State management for various sections
  const [nextMatch, setNextMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trophies, setTrophies] = useState([]);
  const [trophyLoading, setTrophyLoading] = useState(true);
  const [currentYear, setCurrentYear] = useState(1948);
  const [displayedTrophies, setDisplayedTrophies] = useState({});
  const [message, setMessage] = useState('');
  const [value, setValue] = useState(1948);

  // Constants for trophy timeline
  const min = 1948; // Club founding year
  const max = 2024; // Current year
  
  // Maximum trophy counts for progress calculation
  const trophyMaxValues = {
    'Champions League': 22,
    'Israeli Premier League': 20,
    'Israeli Cup': 5,
    'Toto Cup': 4,
    'Club World Cup': 6,
    'UEFA Super Cup': 7
  };

  // Progress bar component for trophy display
  const AnimatedProgress = ({ value }) => (
    <div className="progress-wrapper">
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${value}%` }} />
      </div>
    </div>
  );

  // Trophy types configuration with icons
  const trophyTypes = [
    { name: 'Champions League', icon:`${process.env.PUBLIC_URL}/Photos/Cups/championsCup.png` },
    // ... other trophy types
  ];

  // Fetch next match data
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
      } catch (error) {
        setMessage('Error fetching next match');
      } finally {
        setLoading(false);
      }
    };
    fetchNextGame();
  }, []);

  // Fetch trophy history data
  useEffect(() => {
    const fetchTrophies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/alltrophies/alltrophies');
        const data = await response.json();
        setTrophies(data);
      } catch (error) {
        console.error('Error fetching trophies:', error);
      } finally {
        setTrophyLoading(false);
      }
    };
    fetchTrophies();
  }, []);

  // Update trophy display based on selected year
  useEffect(() => {
    const updatedTrophies = {};
    trophyTypes.forEach((type) => {
      updatedTrophies[type.name] = 0;
    });
    trophies.forEach((trophy) => {
      if (parseInt(trophy.yearReceived) <= currentYear) {
        updatedTrophies[trophy.competitionName] += 1;
      }
    });
    setDisplayedTrophies(updatedTrophies);
  }, [currentYear, trophies]);

  // Utility functions
  const handleSliderChange = (e) => {
    setValue(parseInt(e.target.value));
    setCurrentYear(parseInt(e.target.value));
  };

  const getImagePath = (imagePath) => {
    return `${process.env.PUBLIC_URL}/${imagePath}`;
  };

  const calculateProgress = () => {
    return ((value - min) / (max - min)) * 100;
  };

  if (loading) return <div><LoadingSpinner /></div>;

  return (
    <div className="home-page">
      <main className="main-content">
        {/* Next Match Section */}
        <section className="next-match-section">
          {/* ... Next match presentation JSX */}
        </section>

        {/* Trophy History Section */}
        <section className="legendary-track-record">
          {/* ... Trophy display and timeline JSX */}
        </section>

        {/* Players Section */}
        <h1>Our Players</h1> 
        <div><Player/></div>

        {/* Articles Section */}
        <div><ArticlesSection/></div>
      </main>
    </div>
  );
};

export default HomePage;







