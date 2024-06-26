import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { kanas } from "./constants_level_1";
import { kanas as lvl2Kanas } from "./constants_level_2";

export const gameStates = {
  MENU: "MENU",
  GAME: "GAME",
  GAME_OVER: "GAME_OVER",
  LEVEL_CHANGED: "LEVEL_CHANGED",
};

export const playAudio = (path, callback) => {
  const audio = new Audio(`./sounds/${path}.mp3`);
  if (callback) {
    audio.addEventListener("ended", callback);
  }
  audio.play();
};

export const generateGameLevel = ({ gameLevel }) => {
  const currentGameLevel = gameLevel === 1 ? kanas : lvl2Kanas;
  const level = [];

  currentGameLevel.forEach((gameLevel) => {
    const stage = [];

    const nbOptions = 3;
    stage.push({ ...gameLevel, correct: true });
    for (let i = 0; i < nbOptions; i++)
      stage.push(
        currentGameLevel.find(
          (gmLevel) => gmLevel !== gameLevel && !stage.includes(gmLevel)
        )
      );
    level.push(stage);
  });

  return level;
};

export const useGameStore = create(
  subscribeWithSelector((set, get) => ({
    gameLevel: 1,
    maxGameLevel: 2,
    gameStarted: false,
    level: null,
    currentStage: 0,
    currentKana: null,
    lastWrongKana: null,
    mode: "hiragana",
    gameState: gameStates.MENU,
    wrongAnswers: 0,
    changeLevel: ({ gameLevel }) => {
      set({
        gameLevel,
      });
    },
    startGame: ({ mode }) => {
      const level = generateGameLevel({
        gameLevel: get().gameLevel,
      });
      const currentKana = level[0].find((kana) => kana.correct);
      playAudio("start", () => {
        playAudio(`kanas/${currentKana.name}`);
      });
      set({
        level,
        currentStage: 0,
        currentKana,
        gameState: gameStates.GAME,
        mode,
        wrongAnswers: 0,
      });
    },
    nextStage: () => {
      set((state) => {
        if (state.currentStage + 1 === state.level.length) {
          playAudio("congratulations");
          return {
            currentStage: 0,
            currentKana: null,
            level: null,
            lastWrongKana: null,
            gameState: gameStates.LEVEL_CHANGED,
          };
        }
        const currentStage = state.currentStage + 1;
        const currentKana = state.level[currentStage].find(
          (kana) => kana.correct
        );
        playAudio("good");
        playAudio(`correct${currentStage % 3}`, () => {
          playAudio(`kanas/${currentKana.name}`);
        });
        return { currentStage, currentKana, lastWrongKana: null };
      });
    },
    goToMenu: () => {
      set({
        gameState: gameStates.MENU,
      });
    },
    goToNextLevel: () => {
      if (get().gameLevel !== get().maxGameLevel) {
        set({
          gameLevel: get().gameLevel + 1,
        });
        get().startGame({ mode: get().mode });
      } else {
        set({
          gameState: gameStates.GAME_OVER,
          gameLevel: 1,
        });
      }
    },
    kanaTouched: (kana) => {
      const currentKana = get().currentKana;
      if (currentKana.name === kana.name) {
        get().nextStage();
      } else {
        playAudio("wrong");
        playAudio(`kanas/${kana.name}`, () => {
          playAudio("fail");
        });
        set((state) => ({
          wrongAnswers: state.wrongAnswers + 1,
          lastWrongKana: kana,
        }));
      }
    },
    // CHARACTER CONTROLLER
    characterState: "Idle",
    setCharacterState: (characterState) =>
      set({
        characterState,
      }),
  }))
);
