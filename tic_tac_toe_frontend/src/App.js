import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Modern Tic Tac Toe Game - React Functional Component
 * Features:
 * - 3x3 interactive board
 * - Player turn indication
 * - Win/draw detection
 * - Restart game option
 * - Simple local score tracking
 * Styling: Modern, light, color theme with accent, primary and secondary colors 
 */

// PUBLIC_INTERFACE
function App() {
  // Game state for 3x3 grid, score and play status
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState('');
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [firstLoad, setFirstLoad] = useState(true);

  // Custom theme colors
  const colors = {
    accent: '#ffeb3b',      // yellow for highlighting
    primary: '#1976d2',     // blue
    secondary: '#424242',   // dark gray for neutral
    background: '#ffffff',  // white/light
  };

  // PUBLIC_INTERFACE
  function calculateWinner(sqrs) {
    // Winning lines definition
    const lines = [
      [0,1,2], [3,4,5], [6,7,8], // rows
      [0,3,6], [1,4,7], [2,5,8], // columns
      [0,4,8], [2,4,6]           // diagonals
    ];
    for (let l of lines) {
      const [a, b, c] = l;
      if (sqrs[a] && sqrs[a] === sqrs[b] && sqrs[a] === sqrs[c]) {
        return sqrs[a]; // 'X' or 'O'
      }
    }
    return null;
  }

  // Side effect: check for win/draw after every move
  useEffect(() => {
    const win = calculateWinner(squares);
    if (win) {
      setWinner(win);
      setStatus(`Winner: Player ${win}`);
      setDraw(false);
      if (!firstLoad) {
        setScore((prev) => ({ ...prev, [win]: prev[win] + 1 }));
      }
    } else if (squares.every(square => square)) {
      setDraw(true);
      setStatus("It's a draw!");
    } else {
      setWinner(null);
      setDraw(false);
      setStatus(`Turn: Player ${isXNext ? 'X' : 'O'}`);
    }
    // don't count on first mount
    setFirstLoad(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [squares]);

  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (squares[idx] || winner || draw) return; // ignore invalid moves
    const nextSquares = squares.slice();
    nextSquares[idx] = isXNext ? 'X' : 'O';
    setSquares(nextSquares);
    setIsXNext(!isXNext);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setIsXNext((prev) => !prev); // alternate starter
    setWinner(null);
    setDraw(false);
    setStatus('');
    setFirstLoad(true);
  }

  // PUBLIC_INTERFACE
  function handleResetScore() {
    setScore({ X: 0, O: 0 });
  }

  // Board rendering
  function renderSquare(idx) {
    const value = squares[idx];
    const winHighlight =
      winner &&
      [ // all winning lines
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
      ].find(l => l.includes(idx) && l.every(i => squares[i] === winner));
    return (
      <button
        key={idx}
        className="square"
        style={{
          color: value === 'X' ? colors.primary : value === 'O' ? colors.secondary : colors.secondary,
          background: winHighlight
            ? colors.accent
            : colors.background,
          borderColor: winHighlight ? colors.accent : '#e9ecef',
          fontWeight: winHighlight ? 700 : 500
        }}
        aria-label={value ? `Cell ${idx + 1} ${value}` : `Cell ${idx + 1} empty`}
        onClick={() => handleClick(idx)}
        disabled={!!value || !!winner || draw}
      >
        {value}
      </button>
    );
  }

  // Responsive + modern layout/styling (see extra CSS)
  return (
    <div className="tic-tac-toe-app" style={{ minHeight: '100vh', background: colors.background }}>
      <div className="container-ttt">
        <h1 className="ttt-title" style={{ color: colors.primary }}>Tic Tac Toe</h1>
        <div className="score-board">
          <div className="score-box score-x" style={{ color: colors.primary, borderColor: colors.primary }}>
            X <span className="score-num">{score.X}</span>
          </div>
          <div className="score-box score-o" style={{ color: colors.secondary, borderColor: colors.secondary }}>
            O <span className="score-num">{score.O}</span>
          </div>
        </div>
        <div className="board">
          {[0,1,2].map(row =>
            <div key={row} className="board-row">
              {[0,1,2].map(col => renderSquare(row * 3 + col))}
            </div>
          )}
        </div>
        <div className="status" style={{
          color: winner ? colors.primary : (draw ? colors.secondary : colors.accent),
          margin: "1.2rem 0 0.8rem"
        }}>
          <strong>{status}</strong>
        </div>
        <div className="controls">
          <button className="ttt-btn" onClick={handleRestart}>
            Restart Game
          </button>
          <button className="ttt-btn ttt-btn-outline" onClick={handleResetScore}>
            Reset Score
          </button>
        </div>
        <footer className="ttt-footer">
          <small>Modern, light-themed Tic Tac Toe • Responsive UI</small>
        </footer>
      </div>
    </div>
  );
}

export default App;
