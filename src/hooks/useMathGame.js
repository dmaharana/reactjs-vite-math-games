import { useState, useEffect, useRef } from "react";
import {
  generateRandomNumbers,
  calculateExpectedAnswer,
  calculateRowTotal,
  calculateColumnTotal,
  calculateGrandTotal,
} from "../utils/mathUtils";

export const useMathGame = () => {
  const [numbers, setNumbers] = useState({ rowHeaders: [], colHeaders: [] });
  const [answers, setAnswers] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [gameState, setGameState] = useState("ready");
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [results, setResults] = useState({
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    totalTime: 0,
    averageTimePerAnswer: 0,
  });
  const [operation, setOperation] = useState("addition");
  const [difficulty, setDifficulty] = useState("medium");
  const inputRefs = useRef({});

  // Initialize numbers
  useEffect(() => {
    setNumbers(generateRandomNumbers(operation, difficulty));
  }, [operation, difficulty]);

  // Timer controls
  const startTimer = () => {
    if (gameState === "ready" || gameState === "paused") {
      setGameState("playing");
      const interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
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
      calculateResults();
    }
  };

  const resetGame = () => {
    clearInterval(timerInterval);
    setTimerInterval(null);
    setTimer(0);
    setGameState("ready");
    setNumbers(generateRandomNumbers(operation, difficulty));
    setAnswers({});
    setSelectedCell(null);
    setResults({
      correct: 0,
      incorrect: 0,
      unanswered: 0,
      totalTime: 0,
      averageTimePerAnswer: 0,
    });
  };

  const newNumberSet = () => {
    if (gameState !== "playing") {
      setNumbers(generateRandomNumbers(operation, difficulty));
      setAnswers({});
      setSelectedCell(null);
    }
  };

  const calculateResults = () => {
    let correct = 0,
      incorrect = 0,
      unanswered = 0;

    for (let r = 0; r < numbers.rowHeaders.length; r++) {
      for (let c = 0; c < numbers.colHeaders.length; c++) {
        const cellId = `${r}-${c}`;
        const expected = calculateExpectedAnswer(
          numbers.rowHeaders[r],
          numbers.colHeaders[c],
          operation
        );
        if (!(cellId in answers) || answers[cellId] === "") unanswered++;
        else if (parseFloat(answers[cellId]) === expected) correct++;
        else incorrect++;
      }
    }

    for (let r = 0; r < numbers.rowHeaders.length; r++) {
      const cellId = `row-total-${r}`;
      const expected = calculateRowTotal(numbers, r, operation);
      if (!(cellId in answers) || answers[cellId] === "") unanswered++;
      else if (parseFloat(answers[cellId]) === expected) correct++;
      else incorrect++;
    }

    for (let c = 0; c < numbers.colHeaders.length; c++) {
      const cellId = `col-total-${c}`;
      const expected = calculateColumnTotal(numbers, c, operation);
      if (!(cellId in answers) || answers[cellId] === "") unanswered++;
      else if (parseFloat(answers[cellId]) === expected) correct++;
      else incorrect++;
    }

    const grandTotalId = "grand-total";
    const expectedGrandTotal = calculateGrandTotal(numbers, operation);
    if (!(grandTotalId in answers) || answers[grandTotalId] === "")
      unanswered++;
    else if (parseFloat(answers[grandTotalId]) === expectedGrandTotal)
      correct++;
    else incorrect++;

    const answeredCells = correct + incorrect;
    const averageTimePerAnswer = answeredCells > 0 ? timer / answeredCells : 0;

    setResults({
      correct,
      incorrect,
      unanswered,
      totalTime: timer,
      averageTimePerAnswer,
    });
  };

  const moveToCell = (rowIndex, colIndex) => {
    const maxRow = numbers.rowHeaders.length;
    const maxCol = numbers.colHeaders.length;
    if (
      rowIndex >= 0 &&
      rowIndex <= maxRow &&
      colIndex >= 0 &&
      colIndex <= maxCol
    ) {
      setSelectedCell({ row: rowIndex, col: colIndex });
      const cellId =
        rowIndex === maxRow && colIndex === maxCol
          ? "grand-total"
          : rowIndex === maxRow
          ? `col-total-${colIndex}`
          : colIndex === maxCol
          ? `row-total-${rowIndex}`
          : `${rowIndex}-${colIndex}`;
      if (inputRefs.current[cellId]) inputRefs.current[cellId].focus();
    }
  };

  return {
    numbers,
    setNumbers,
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
    moveToCell,
    calculateResults,
  };
};
