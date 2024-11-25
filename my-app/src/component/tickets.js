import React from "react";
import './template.css';
import GameTable from "./gameTable";
import {useLocation } from 'react-router-dom';
const Tickets = () => {
  const location = useLocation();
  const user = location.state;
  const Legend = () => (
    <div className="legend">
      <h3>Tickets Legend</h3>
      <div className="legend-item">
        <span>Fans with Membership can buy 3 days ahead of the game</span>
      </div>
      <div className="legend-item">
        <span>Fans without Membership and without Subscription can buy 2 days ahead of the game</span>
      </div>
      <div className="legend-item">
        <span>Fans with Subscription can buy 1 day ahead of the game</span>
      </div>
    </div>
  );
  return (
    <div className="App">
      {/* Main Content */}
      <main>
        <h2>Upcoming Matches</h2>
        <p>
        {Legend()}
        <GameTable user={user}/>
        </p>
      </main>
      <footer>
        <p>&copy; 2024 Maccabi React CF. All rights reserved.</p>
        <p><a href="#privacy">Privacy Policy</a> | <a href="#terms">Terms of Service</a></p>
      </footer>
    </div>
  );
};

export default Tickets;
