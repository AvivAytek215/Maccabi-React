// Context and Provider for managing a global countdown timer with persistence
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const CountdownContext = createContext();

// Initial countdown time set to 10 minutes (in seconds)
const INITIAL_TIME = 10 * 60;

// Provider component that wraps app to provide countdown functionality
export const CountdownProvider = ({ children }) => {
  // Initialize timer state from localStorage or default value
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('countdownTime');
    const initialValue = JSON.parse(saved);
    return initialValue || INITIAL_TIME;
  });

  // Reset timer to initial state and update localStorage
  const resetTimer = useCallback(() => {
    setTimeLeft(INITIAL_TIME);
    localStorage.setItem('countdownTime', JSON.stringify(INITIAL_TIME));
  }, []);

  // Timer effect that runs countdown and handles persistence
  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft(time => {
        // Handle timer completion
        if (time <= 0) {
          clearInterval(timerId);
          localStorage.removeItem('countdownTime');
          return 0;
        }
        // Update timer and persist to localStorage
        const newTime = time - 1;
        localStorage.setItem('countdownTime', JSON.stringify(newTime));
        return newTime;
      });
    }, 1000);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(timerId);
    };
  }, []);

  // Helper function to format time as MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Provide countdown state and functions to children
  return (
    <CountdownContext.Provider value={{ timeLeft, formatTime, resetTimer }}>
      {children}
    </CountdownContext.Provider>
  );
};

// Custom hook for consuming countdown context
export const useCountdown = () => {
  const context = useContext(CountdownContext);
  if (context === undefined) {
    throw new Error('useCountdown must be used within a CountdownProvider');
  }
  return context;
};