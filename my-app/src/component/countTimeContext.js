import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const CountdownContext = createContext();

const INITIAL_TIME = 10 * 60; // 10 minutes in seconds

export const CountdownProvider = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('countdownTime');
    const initialValue = JSON.parse(saved);
    return initialValue || INITIAL_TIME;
  });

  const resetTimer = useCallback(() => {
    setTimeLeft(INITIAL_TIME);
    localStorage.setItem('countdownTime', JSON.stringify(INITIAL_TIME));
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft(time => {
        if (time <= 0) {
          clearInterval(timerId);
          localStorage.removeItem('countdownTime');
          return 0;
        }
        const newTime = time - 1;
        localStorage.setItem('countdownTime', JSON.stringify(newTime));
        return newTime;
      });
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <CountdownContext.Provider value={{ timeLeft, formatTime, resetTimer }}>
      {children}
    </CountdownContext.Provider>
  );
};

export const useCountdown = () => {
  const context = useContext(CountdownContext);
  if (context === undefined) {
    throw new Error('useCountdown must be used within a CountdownProvider');
  }
  return context;
};