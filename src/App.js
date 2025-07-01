import React, { useState, useEffect } from "react";
import "./App.css";

const NUM_TILES = 36;

function App() {
  const [tiles, setTiles] = useState([]);
  const [playerType, setPlayerType] = useState("");
  const [clickedTiles, setClickedTiles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState("Chicken");
  const [wrongTiles, setWrongTiles] = useState([]);

  useEffect(() => {
    generateTiles();
  }, []);

  const generateTiles = () => {
    // Create an even split of Chicken and Banana
    let newTiles = [];
    const half = NUM_TILES / 2;
    for (let i = 1; i <= NUM_TILES; i++) {
      newTiles.push({
        number: i,
        type: i <= half ? "Chicken" : "Banana",
      });
    }
    // Shuffle the tiles for randomness
    for (let i = newTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
    }
    setTiles(newTiles);
    setClickedTiles([]);
    setWrongTiles([]); // <-- Add this line to clear X marks
    setGameOver(false);
    setWinner("");
    setCurrentPlayer("Chicken"); // Always start with Chicken
  };

  const handlePlayerChoice = (choice) => {
    setPlayerType(choice);
    setClickedTiles([]);
    setGameOver(false);
    setWinner("");
  };

  const handleTileClick = (tile) => {
    if (gameOver) return;

    if (tile.type !== currentPlayer) {
      setWrongTiles((prev) => [...prev, tile.number]);
      setGameOver(true);
      setWinner(
        `${currentPlayer === "Chicken" ? "Banana" : "Chicken"} player wins! ${currentPlayer} clicked wrong!`
      );
      return;
    }

    if (!clickedTiles.includes(tile.number)) {
      const newClicked = [...clickedTiles, tile.number];
      setClickedTiles(newClicked);

      const totalTypeTiles = tiles.filter((t) => t.type === currentPlayer).length;
      const playerClicked = newClicked.filter(
        (num) => tiles.find((t) => t.number === num).type === currentPlayer
      ).length;

      if (playerClicked === totalTypeTiles) {
        setGameOver(true);
        setWinner(`${currentPlayer} player wins! Partner gets +5 grade!`);
        return;
      }

      // Switch turn
      setCurrentPlayer(currentPlayer === "Chicken" ? "Banana" : "Chicken");
    }
  };

  return (
    <div className="App">
      <h1>Chicken 🐔 vs Banana 🍌</h1>
      <h2 style={{ color: "#ffe066", marginBottom: 24 }}>
        {gameOver ? "Game Over" : `Turn: ${currentPlayer} ${currentPlayer === "Chicken" ? "🐔" : "🍌"}`}
      </h2>

      <div className="choice-buttons">
        <button onClick={() => handlePlayerChoice("Chicken")}>Play as Chicken 🐔</button>
        <button onClick={() => handlePlayerChoice("Banana")}>Play as Banana 🍌</button>
      </div>

      <div className="tiles-grid">
        {tiles.map((tile) => (
          <button
            key={tile.number}
            className={`tile ${clickedTiles.includes(tile.number) || wrongTiles.includes(tile.number) ? "clicked" : ""}`}
            onClick={() => handleTileClick(tile)}
            disabled={clickedTiles.includes(tile.number) || wrongTiles.includes(tile.number) || gameOver}
          >
            {wrongTiles.includes(tile.number)
              ? "❌"
              : clickedTiles.includes(tile.number)
                ? (tile.type === "Chicken" ? "🐔" : "🍌")
                : ""}
          </button>
        ))}
      </div>

      {gameOver && (
        <div className="result">
          <h2>{winner}</h2>
          <button onClick={generateTiles}>Restart Game</button>
        </div>
      )}
    </div>
  );
}

export default App;
