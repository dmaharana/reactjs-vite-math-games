import React, { useState, useEffect } from 'react';

const MathAdditionGame = () => {
  // State for the game
  const [numbers, setNumbers] = useState({ rowHeaders: [], colHeaders: [] });
  const [answers, setAnswers] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [gameState, setGameState] = useState("ready"); // ready, playing, paused, completed
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [results, setResults] = useState({
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    totalTime: 0,
    averageTimePerAnswer: 0
  });

  // Generate random numbers between 10-99
  const generateRandomNumbers = () => {
    const rowHeaders = Array(10).fill().map(() => Math.floor(Math.random() * 90) + 10);
    const colHeaders = Array(10).fill().map(() => Math.floor(Math.random() * 90) + 10);
    setNumbers({ rowHeaders, colHeaders });
    setAnswers({});
    return { rowHeaders, colHeaders };
  };

  // Initialize the game
  useEffect(() => {
    generateRandomNumbers();
  }, []);

  // Timer control functions
  const startTimer = () => {
    if (gameState === "ready" || gameState === "paused") {
      setGameState("playing");
      const interval = setInterval(() => {
        setTimer(prevTime => prevTime + 1);
      }, 1000);
      setTimerInterval(interval);
    }
  };

  const pauseTimer = () => {
    if (gameState === "playing") {
      clearInterval(timerInterval);
      setTimerInterval(null);
      setGameState("paused");
    }
  };

  const stopGame = () => {
    if (gameState === "playing" || gameState === "paused") {
      clearInterval(timerInterval);
      setTimerInterval(null);
      setGameState("completed");
      
      // Calculate results
      let correct = 0;
      let incorrect = 0;
      let unanswered = 0;
      
      for (let r = 0; r < numbers.rowHeaders.length; r++) {
        for (let c = 0; c < numbers.colHeaders.length; c++) {
          const cellId = `${r}-${c}`;
          const expectedAnswer = numbers.rowHeaders[r] + numbers.colHeaders[c];
          
          if (!(cellId in answers)) {
            unanswered++;
          } else if (parseInt(answers[cellId]) === expectedAnswer) {
            correct++;
          } else {
            incorrect++;
          }
        }
      }
      
      const totalCells = numbers.rowHeaders.length * numbers.colHeaders.length;
      const answeredCells = correct + incorrect;
      const averageTimePerAnswer = answeredCells > 0 ? timer / answeredCells : 0;
      
      setResults({
        correct,
        incorrect,
        unanswered,
        totalTime: timer,
        averageTimePerAnswer
      });
    }
  };

  const resetGame = () => {
    clearInterval(timerInterval);
    setTimerInterval(null);
    setTimer(0);
    setGameState("ready");
    generateRandomNumbers();
    setSelectedCell(null);
  };

  // Handle input change
  const handleInputChange = (e, rowIndex, colIndex) => {
    const cellId = `${rowIndex}-${colIndex}`;
    const value = e.target.value;
    
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setAnswers(prev => ({
        ...prev,
        [cellId]: value
      }));
    }
  };

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Determine cell styling
  const getCellStyle = (rowIndex, colIndex) => {
    const cellId = `${rowIndex}-${colIndex}`;
    const isSelected = selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex;
    
    if (gameState === "completed") {
      const expectedAnswer = numbers.rowHeaders[rowIndex] + numbers.colHeaders[colIndex];
      
      if (!(cellId in answers) || answers[cellId] === '') {
        return "bg-gray-200"; // Unanswered - gray
      } else if (parseInt(answers[cellId]) === expectedAnswer) {
        return "bg-green-200"; // Correct - green
      } else {
        return "bg-red-200"; // Incorrect - red
      }
    }
    
    return isSelected ? "bg-blue-100" : "bg-white";
  };

  // Determine if a row or column should be highlighted
  const isHighlighted = (index, type) => {
    if (selectedCell === null) return false;
    return (type === 'row' && selectedCell.row === index) || 
           (type === 'col' && selectedCell.col === index);
  };
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-4">Math Addition Practice Game</h1>
      
      {/* Timer and Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-xl">
          Timer: <span className="font-mono">{formatTime(timer)}</span>
        </div>
        <div className="space-x-2">
          <button 
            onClick={startTimer} 
            disabled={gameState === "completed" || gameState === "playing"}
            className={`px-4 py-2 rounded ${gameState === "completed" || gameState === "playing" ? 'bg-gray-300' : 'bg-green-500 text-white hover:bg-green-600'}`}
          >
            Start
          </button>
          <button 
            onClick={pauseTimer} 
            disabled={gameState !== "playing"}
            className={`px-4 py-2 rounded ${gameState !== "playing" ? 'bg-gray-300' : 'bg-yellow-500 text-white hover:bg-yellow-600'}`}
          >
            Pause
          </button>
          <button 
            onClick={stopGame} 
            disabled={gameState === "ready" || gameState === "completed"}
            className={`px-4 py-2 rounded ${gameState === "ready" || gameState === "completed" ? 'bg-gray-300' : 'bg-red-500 text-white hover:bg-red-600'}`}
          >
            Stop
          </button>
          <button 
            onClick={resetGame} 
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Reset
          </button>
        </div>
      </div>
      
      {/* Game Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-100"></th>
              {numbers.colHeaders.map((num, index) => (
                <th 
                  key={index} 
                  className={`border p-2 text-center ${isHighlighted(index, 'col') ? 'bg-blue-200' : 'bg-gray-100'}`}
                >
                  {num}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {numbers.rowHeaders.map((rowNum, rowIndex) => (
              <tr key={rowIndex}>
                <th 
                  className={`border p-2 text-center ${isHighlighted(rowIndex, 'row') ? 'bg-blue-200' : 'bg-gray-100'}`}
                >
                  {rowNum}
                </th>
                {numbers.colHeaders.map((colNum, colIndex) => (
                  <td 
                    key={colIndex} 
                    className={`border p-2 ${getCellStyle(rowIndex, colIndex)}`}
                  >
                    <input
                      type="text"
                      value={answers[`${rowIndex}-${colIndex}`] || ''}
                      onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                      onFocus={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                      disabled={gameState === "completed"}
                      className="w-full h-full p-1 text-center focus:outline-none bg-transparent"
                      placeholder="?"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Results Summary */}
      {gameState === "completed" && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-2">Results Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-semibold">Total Time:</span> {formatTime(results.totalTime)}</p>
              <p><span className="font-semibold">Average Time Per Answer:</span> {results.averageTimePerAnswer.toFixed(2)} seconds</p>
            </div>
            <div>
              <p><span className="font-semibold text-green-600">Correct Answers:</span> {results.correct}</p>
              <p><span className="font-semibold text-red-600">Incorrect Answers:</span> {results.incorrect}</p>
              <p><span className="font-semibold text-gray-600">Unanswered:</span> {results.unanswered}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MathAdditionGame;
