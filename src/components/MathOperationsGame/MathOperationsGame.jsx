import React, { useState } from "react";
import { useMathGame } from "../../hooks/useMathGame";
import GameTable from "./GameTable";
import Sidebar from "./Sidebar";
import GameControls from "./GameControls";
import ResultsSummary from "./ResultsSummary";

const MathOperationsGame = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    numbers,
    answers,
    setAnswers,
    selectedCell,
    setSelectedCell,
    gameState,
    timer,
    results,
    operation,
    setOperation,
    difficulty,
    setDifficulty,
    inputRefs,
    startTimer,
    pauseTimer,
    stopGame,
    resetGame,
    newNumberSet,
  } = useMathGame();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        operation={operation}
        setOperation={setOperation}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        resetGame={resetGame}
      />
      <div className="flex-grow">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-20 md:top-6 md:left-6 text-white p-2 rounded hover:bg-gray-700 bg-gray-800"
            aria-label="Open sidebar"
          >
            ≡
          </button>
        )}
        <div className="container mx-auto p-4 max-w-4xl mt-4">
          <h1 className="text-2xl font-bold text-center mb-4">
            Math {operation.charAt(0).toUpperCase() + operation.slice(1)}{" "}
            Practice Game
          </h1>
          <GameControls
            gameState={gameState}
            timer={timer}
            startTimer={startTimer}
            pauseTimer={pauseTimer}
            stopGame={stopGame}
            resetGame={resetGame}
            newNumberSet={newNumberSet}
          />
          <div className="text-center mb-4 text-gray-600 text-sm">
            Use keyboard arrow keys or Tab to navigate between cells. Calculate
            totals for rows, columns, and the entire grid!
          </div>
          <GameTable
            numbers={numbers}
            answers={answers}
            setAnswers={setAnswers}
            selectedCell={selectedCell}
            setSelectedCell={setSelectedCell}
            gameState={gameState}
            inputRefs={inputRefs}
            operation={operation}
          />
          {gameState === "completed" && <ResultsSummary results={results} />}
        </div>
      </div>
    </div>
  );
};

export default MathOperationsGame;
