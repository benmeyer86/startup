import React from 'react';
import './play.css';

export function Play() {
  return (
    <main className="container">
      <h1>Solitaire Daily</h1>
      <div className="row g-4 content-grid">
        <div className="col-12 col-lg-6 content-panel">
          <p>Game Board Placeholder:</p>
          <img
            id="game-board"
            src="/solitaire_placeholder.webp"
            alt="Solitaire game board placeholder image"
            width="500"
          />
        </div>

        <div className="col-12 col-lg-6 content-panel">
          <h2>Game Completion Popup (Placeholder)</h2>
          <p>WebSocket placeholder:</p>
          <ul>
            <li>You placed 67th on today's deal with a time of 10:10</li>
            <li>You placed 13th on today's deal with 122 moves</li>
            <li>Placeholder for time stats chart</li>
            <li>Placeholder for move count stats chart</li>
          </ul>
        </div>
      </div>
    </main>
  );
}