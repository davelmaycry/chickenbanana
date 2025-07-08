import React, { useState, useEffect } from "react";
import "./App.css";

const NUM_TILES = 36;

function App() {
  const [tiles, setTiles] = useState([]);
  const [turn, setTurn] = useState("Chicken"); // Whose turn is it
  const [selectedTiles, setSelectedTiles] = useState({ Chicken: null, Banana: null });
  const [revealed, setRevealed] = useState(false);
  const [clickedTiles, setClickedTiles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");
  const [wrongTiles, setWrongTiles] = useState([]);
  const [revealAll, setRevealAll] = useState(false);

  useEffect(() => {
    generateTiles();
  }, []);

  const generateTiles = () => {
    let types = Array(NUM_TILES / 2)
      .fill("Chicken")
      .concat(Array(NUM_TILES / 2).fill("Banana"));
    for (let i = types.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [types[i], types[j]] = [types[j], types[i]];
    }
    let newTiles = types.map((type, idx) => ({
      number: idx + 1,
      type,
    }));
    setTiles(newTiles);
    setTurn("Chicken");
    setSelectedTiles({ Chicken: null, Banana: null });
    setRevealed(false);
    setClickedTiles([]);
    setGameOver(false);
    setWinner("");
    setWrongTiles([]);
  };

  const handleTileSelect = (tile) => {
    if (gameOver || revealed) return;
    if (clickedTiles.includes(tile.number)) return;
    if (selectedTiles[turn]) return; // Already selected this turn

    setSelectedTiles((prev) => ({ ...prev, [turn]: tile.number }));

    // If both have selected, reveal
    if (
      (turn === "Chicken" && selectedTiles["Banana"] !== null) ||
      (turn === "Banana" && selectedTiles["Chicken"] !== null)
    ) {
      setTimeout(() => {
        setRevealed(true);
        handleReveal(tile.number, turn === "Chicken" ? selectedTiles["Banana"] : selectedTiles["Chicken"]);
      }, 300);
    } else {
      setTurn(turn === "Chicken" ? "Banana" : "Chicken");
    }
  };

  const handleReveal = (currentTileNum, otherTileNum) => {
    const chickenTileNum = turn === "Chicken" ? currentTileNum : otherTileNum;
    const bananaTileNum = turn === "Banana" ? currentTileNum : otherTileNum;

    const chickenTile = tiles.find((t) => t.number === chickenTileNum);
    const bananaTile = tiles.find((t) => t.number === bananaTileNum);

    let wrong = [];
    if (chickenTile.type !== "Chicken") wrong.push(chickenTileNum);
    if (bananaTile.type !== "Banana") wrong.push(bananaTileNum);

    setWrongTiles(wrong);

    if (wrong.length === 0) {
      // Both correct, mark as clicked and continue
      setClickedTiles((prev) => [...prev, chickenTileNum, bananaTileNum]);
      setTimeout(() => {
        setSelectedTiles({ Chicken: null, Banana: null });
        setRevealed(false);
        setTurn("Chicken");
      }, 1200);
      // Check for win
      const chickenLeft = tiles.filter(
        (t) => t.type === "Chicken" && ![...clickedTiles, chickenTileNum].includes(t.number)
      ).length;
      const bananaLeft = tiles.filter(
        (t) => t.type === "Banana" && ![...clickedTiles, bananaTileNum].includes(t.number)
      ).length;
      if (chickenLeft === 0 && bananaLeft === 0) {
        setGameOver(true);
        setWinner("It's a tie! Both finished!");
      } else if (chickenLeft === 0) {
        setGameOver(true);
        setWinner("Chicken wins! 🐔");
      } else if (bananaLeft === 0) {
        setGameOver(true);
        setWinner("Banana wins! 🍌");
      }
    } else if (wrong.length === 1) {
      setGameOver(true);
      setWinner(
        chickenTile.type !== "Chicken"
          ? "Banana wins! Chicken made a mistake."
          : "Chicken wins! Banana made a mistake."
      );
    } else {
      setGameOver(true);
      setWinner("Both made a mistake! No winner.");
    }
  };

  return (
    <div className="App">
      <h1>Chicken 🐔 vs Banana 🍌</h1>
      <div style={{ color: "#ffe066", marginBottom: 16 }}>
        Each round: Chicken picks a tile, then Banana picks a tile. <br />
        Both are revealed at once. If one is wrong, the other wins!
      </div>
      <div className="choice-buttons">
        <button onClick={generateTiles}>Restart Game</button>
        <button onClick={() => setRevealAll((r) => !r)}>
          {revealAll ? "Hide Tiles" : "Reveal All Tiles"}
        </button>
      </div>
      <h2 style={{ color: "#ffe066", marginBottom: 24 }}>
        {gameOver
          ? "Game Over"
          : !selectedTiles["Chicken"]
            ? "Chicken's turn 🐔"
            : !selectedTiles["Banana"]
              ? "Banana's turn 🍌"
              : "Revealing..."}
      </h2>
      <div className="tiles-grid">
        {tiles.map((tile) => {
          const isSelected =
            (selectedTiles["Chicken"] === tile.number && !revealed) ||
            (selectedTiles["Banana"] === tile.number && !revealed);
          const isRevealed =
            revealed &&
            (selectedTiles["Chicken"] === tile.number ||
              selectedTiles["Banana"] === tile.number);
          const isClicked = clickedTiles.includes(tile.number);

          return (
            <button
              key={tile.number}
              className={`tile${isSelected ? " clicked" : ""}${isClicked ? " clicked" : ""}${wrongTiles.includes(tile.number) ? " clicked" : ""}`}
              onClick={() => handleTileSelect(tile)}
              disabled={
                isClicked ||
                isSelected ||
                gameOver ||
                (turn === "Chicken" && selectedTiles["Chicken"]) ||
                (turn === "Banana" && selectedTiles["Banana"])
              }
            >
              {revealAll
                ? tile.type === "Chicken"
                  ? "🐔"
                  : "🍌"
                : isRevealed
                  ? tile.type === "Chicken"
                    ? "🐔"
                    : "🍌"
                  : isClicked
                    ? tile.type === "Chicken"
                      ? "🐔"
                      : "🍌"
                    : wrongTiles.includes(tile.number)
                      ? "❌"
                      : tile.number}
            </button>
          );
        })}
      </div>
      {gameOver && (
        <div className="result">
          <h2 style={{ color: "#ffe066", marginBottom: 16 }}>{winner}</h2>
          <button onClick={generateTiles}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default App;