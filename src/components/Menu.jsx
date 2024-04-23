import { useEffect } from "react";
import { gameStates, useGameStore } from "../store";

export const Menu = () => {
  const {
    startGame,
    gameState,
    goToMenu,
    gameLevel,
    maxGameLevel,
    goToNextLevel,
    mode,
  } = useGameStore();
  useEffect(() => {
    console.log(
      gameLevel !== maxGameLevel && gameState !== gameStates.LEVEL_CHANGED
    );
    console.log(
      gameLevel,
      maxGameLevel,
      gameState !== gameStates.LEVEL_CHANGED,
      gameState
    );
  }, [gameLevel]);
  return (
    <>
      <div
        className={`menu ${
          gameState !== gameStates.MENU ? "menu--hidden" : ""
        }`}
      >
        <div>
          <h1>Kana Game</h1>
          <p>What do you want to practice today?</p>
        </div>
        <button
          disabled={gameState !== gameStates.MENU}
          onClick={() => startGame({ mode: "hiragana" })}
        >
          Hiragana
        </button>
        <button
          disabled={gameState !== gameStates.MENU}
          onClick={() => startGame({ mode: "katakana" })}
        >
          Katakana
        </button>
        <div>
          <p>
            Made with 💙 by{" "}
            <a href="https://youtube.com/@WawaSensei" target="_blank">
              Wawa Sensei
            </a>
            , 3D models from{" "}
            <a href="https://instagram.com/belyakova.dsn" target="_blank">
              Camilla
            </a>
          </p>
        </div>
      </div>
      <div
        className={`scores ${
          gameState !== gameStates.GAME_OVER ? "scores--hidden" : ""
        }`}
      >
        <h1>Congratulations you are becoming a true master</h1>
        <button
          onClick={goToMenu}
          disabled={gameState !== gameStates.GAME_OVER}
        >
          Play again
        </button>
      </div>

      <div
        className={`scores ${
          gameState !== gameStates.LEVEL_CHANGED ? "scores--hidden" : ""
        }`}
      >
        <h1>Congratulations you completed {" " + gameLevel + " "} level</h1>
        <button
          onClick={goToNextLevel}
          disabled={gameState !== gameStates.LEVEL_CHANGED}
        >
          Next Level
        </button>
      </div>
    </>
  );
};
