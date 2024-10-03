import React from "react";
import './template.css';
import GameTable from "./gameTable";
const tickets = () => {
  return (
    <div className="App">
      {/* Header with Logo */}
      <header>
      </header>
    <>
    </>
      {/* Main Content */}
      <main>
        <h2>Upcoming Matches</h2>
        <p>
        <GameTable/>
        </p>
      </main>
      <footer>
        <p>&copy; 2024 Kiryat motzkin CF. All rights reserved.</p>
        <p><a href="#privacy">Privacy Policy</a> | <a href="#terms">Terms of Service</a></p>
      </footer>
    </div>
  );
};

export default tickets;
