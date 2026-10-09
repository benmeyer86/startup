import React from 'react';
import './stats.css';

export function Stats() {
  return (
    <main className="container">
      <h1>Statistics</h1>

      <div className="row g-4 content-grid">
      <div className="col-12 col-lg-6 content-panel">
        <h2>Websocket Placeholder(s):</h2>
        <p>Leaderboard (Time)</p>
        <p>Leaderboard (Moves)</p>
        <p>Chart (Time)</p>
        <p>Chart (Moves)</p>
      </div>
        
      <div className="col-12 col-lg-6 content-panel">
        <h2>Database Data Placeholder:</h2>
        <p>Streak</p>
        <p>Calendar showing days completed</p>
        <p>Best Time</p>
        <p>Fewest Moves</p>
        <p>etc...</p>
      </div>
      </div>
    </main>
  );
}