import React from 'react';
import './play.css';

const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function createGame() {
  const deck = SUITS.flatMap((suit) =>
    RANKS.map((rank, index) => ({
      id: `${rank}${suit}`,
      suit,
      rank,
      value: index + 1,
      faceUp: false,
    })),
  );

  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  const tableau = Array.from({ length: 7 }, (_, column) => {
    const cards = deck.splice(0, column + 1);
    cards[cards.length - 1].faceUp = true;
    return cards;
  });

  return { stock: deck, waste: [], foundations: [[], [], [], []], tableau };
}

function isRed(card) {
  return card.suit === '♥' || card.suit === '♦';
}

function removeSelectedCardRun(board, selected) {
  if (!selected) return null;

  if (selected.pile === 'waste') {
    if (selected.index !== board.waste.length - 1) return null;
    return {
      cards: [board.waste[selected.index]],
      board: { ...board, waste: board.waste.slice(0, -1) },
    };
  }

  const column = board.tableau[selected.column];
  const cards = column.slice(selected.index);
  if (!cards.length || cards.some((card) => !card.faceUp)) return null;

  const tableau = board.tableau.map((pile, index) => {
    if (index !== selected.column) return pile;
    const remaining = pile.slice(0, selected.index);
    if (remaining.length && !remaining[remaining.length - 1].faceUp) {
      remaining[remaining.length - 1] = { ...remaining[remaining.length - 1], faceUp: true };
    }
    return remaining;
  });

  return { cards, board: { ...board, tableau } };
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function PlayingCard({ card, selected, onClick }) {
  return (
    <button
      type="button"
      className={`playing-card ${card.faceUp ? 'face-up' : 'face-down'}${selected ? ' selected' : ''}${isRed(card) ? ' red-suit' : ''}`}
      onClick={onClick}
    >
      {card.faceUp
        ? <span className="card-corner">{card.rank}{card.suit}</span>
        : null}
    </button>
  );
}

export function Play({ user }) {
  const boardRef = React.useRef(null);
  const [board, setBoard] = React.useState(createGame);
  const [selected, setSelected] = React.useState(null);
  const [moves, setMoves] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    const timer = window.setInterval(() => setSeconds((time) => time + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  React.useEffect(() => {
    function clearSelectionOutsideBoard(event) {
      if (!boardRef.current?.contains(event.target)) {
        setSelected(null);
      }
    }

    document.addEventListener('pointerdown', clearSelectionOutsideBoard);
    return () => document.removeEventListener('pointerdown', clearSelectionOutsideBoard);
  }, []);

  const won = board.foundations.every((pile) => pile.length === 13);

  function drawFromStock() {
    if (board.stock.length) {
      setBoard({
        ...board,
        stock: board.stock.slice(0, -1),
        waste: [...board.waste, { ...board.stock[board.stock.length - 1], faceUp: true }],
      });
      setMoves((count) => count + 1);
    } else if (board.waste.length) {
      setBoard({
        ...board,
        stock: board.waste.map((card) => ({ ...card, faceUp: false })),
        waste: [],
      });
      setMoves((count) => count + 1);
    }
    setSelected(null);
  }

  function selectTableauCard(column, index) {
    const card = board.tableau[column][index];
    if (!card.faceUp) {
      if (index === board.tableau[column].length - 1) {
        const tableau = board.tableau.map((pile, pileIndex) =>
          pileIndex === column
            ? pile.map((item, cardIndex) => cardIndex === index ? { ...item, faceUp: true } : item)
            : pile,
        );
        setBoard({ ...board, tableau });
        setMoves((count) => count + 1);
      }
      return;
    }

    if (selected && index === board.tableau[column].length - 1 && moveToTableau(column)) {
      return;
    }
    setSelected({ pile: 'tableau', column, index });
  }

  function moveToTableau(destination) {
    if (selected?.pile === 'tableau' && selected.column === destination) return false;
    const result = removeSelectedCardRun(board, selected);
    if (!result) return false;

    const targetPile = result.board.tableau[destination];
    const movingCards = result.cards;
    const canPlace = targetPile.length
      ? targetPile[targetPile.length - 1].value === movingCards[0].value + 1
        && isRed(targetPile[targetPile.length - 1]) !== isRed(movingCards[0])
      : movingCards[0].value === 13;

    if (!canPlace) return false;

    const tableau = result.board.tableau.map((pile, index) =>
      index === destination ? [...pile, ...movingCards] : pile,
    );
    setBoard({ ...result.board, tableau });
    setSelected(null);
    setMoves((count) => count + 1);
    return true;
  }

  function moveToFoundation(foundationIndex) {
    const result = removeSelectedCardRun(board, selected);
    if (!result || result.cards.length !== 1) return;

    const card = result.cards[0];
    const foundation = result.board.foundations[foundationIndex];
    const canPlace = foundation.length
      ? foundation[foundation.length - 1].suit === card.suit
        && foundation[foundation.length - 1].value + 1 === card.value
      : card.value === 1;

    if (!canPlace) return;

    const foundations = result.board.foundations.map((pile, index) =>
      index === foundationIndex ? [...pile, card] : pile,
    );
    setBoard({ ...result.board, foundations });
    setSelected(null);
    setMoves((count) => count + 1);
  }

  function startNewGame() {
    setBoard(createGame());
    setSelected(null);
    setMoves(0);
    setSeconds(0);
  }

  return (
    <main className="container">
      <h1>Solitaire Daily</h1>
      <section className="solitaire-game" ref={boardRef}>
        <div className="game-toolbar">
          <p>{user ? `Player: ${user}` : 'Move cards to build four suit foundations.'}</p>
          <p>Moves: {moves} · Time: {formatTime(seconds)}</p>
          <button type="button" className="new-game-button" onClick={startNewGame}>New game</button>
        </div>

        <div className="solitaire-piles">
          <div className="top-piles">
            <button
              type="button"
              className={`card-slot stock-slot${board.stock.length ? ' stock-available' : ''}`}
              onClick={drawFromStock}
            >
              {board.stock.length ? '◆' : board.waste.length ? '↺' : ''}
            </button>
            <div className="card-slot waste-slot">
              {board.waste.length > 0 && (
                <PlayingCard
                  card={board.waste[board.waste.length - 1]}
                  selected={selected?.pile === 'waste'}
                  onClick={() => setSelected({ pile: 'waste', index: board.waste.length - 1 })}
                />
              )}
            </div>
            <div className="foundations">
              {board.foundations.map((pile, index) => (
                <button
                  type="button"
                  className={`card-slot foundation-slot${pile.length ? ' has-card' : ''}`}
                  key={index}
                  onClick={() => moveToFoundation(index)}
                >
                  {pile.length
                    ? <span className={`card-corner${isRed(pile[pile.length - 1]) ? ' red-suit' : ''}`}>{pile[pile.length - 1].rank}{pile[pile.length - 1].suit}</span>
                    : 'A'}
                </button>
              ))}
            </div>
          </div>

          <div className="tableau">
            {board.tableau.map((pile, column) => (
              <div
                className="tableau-column"
                key={column}
                onClick={() => moveToTableau(column)}
              >
                {pile.length === 0 && <div className="card-slot empty-column" />}
                {pile.map((card, index) => (
                  <div className="tableau-card" key={card.id} style={{ top: `${index * 1.25}rem` }}>
                    <PlayingCard
                      card={card}
                      selected={selected?.pile === 'tableau' && selected.column === column && index >= selected.index}
                      onClick={(event) => {
                        event.stopPropagation();
                        selectTableauCard(column, index);
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        {won && <p className="win-message">You won! Start a new game to play again.</p>}
      </section>
    </main>
  );
}
