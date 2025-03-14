export const generateRandomNumbers = (operation, difficulty) => {
  const generateNumber = () => {
    let min = 10,
      max = 99;
    switch (difficulty) {
      case "easy":
        min = operation === "division" ? 2 : 1;
        max = operation === "division" ? 10 : 20;
        break;
      case "medium":
        min = operation === "division" ? 2 : 10;
        max = operation === "division" ? 12 : 99;
        break;
      case "hard":
        min = operation === "division" ? 2 : 30;
        max = operation === "division" ? 20 : 999;
        break;
    }

    if (operation === "division")
      return Math.floor(Math.random() * (max - min + 1)) + min;
    else if (difficulty === "medium") {
      let num;
      do {
        num = Math.floor(Math.random() * (max - min + 1)) + min;
      } while (num % 10 === 0);
      return num;
    } else {
      let num;
      do {
        num = Math.floor(Math.random() * (max - min + 1)) + min;
      } while (operation === "multiplication" && num === 0);
      return num;
    }
  };

  const colHeaders = Array(10).fill().map(generateNumber);
  const rowHeaders =
    operation === "division"
      ? colHeaders.map(
          (divisor) => divisor * (Math.floor(Math.random() * 12) + 1)
        )
      : Array(10).fill().map(generateNumber);

  return { rowHeaders, colHeaders };
};

export const calculateExpectedAnswer = (a, b, operation) => {
  switch (operation) {
    case "addition":
      return a + b;
    case "subtraction":
      return a - b;
    case "multiplication":
      return a * b;
    case "division":
      return a / b;
    default:
      return a + b;
  }
};

export const calculateRowTotal = (numbers, rowIndex, operation) => {
  return numbers.colHeaders.reduce(
    (total, colNum) =>
      total +
      calculateExpectedAnswer(numbers.rowHeaders[rowIndex], colNum, operation),
    0
  );
};

export const calculateColumnTotal = (numbers, colIndex, operation) => {
  return numbers.rowHeaders.reduce(
    (total, rowNum) =>
      total +
      calculateExpectedAnswer(rowNum, numbers.colHeaders[colIndex], operation),
    0
  );
};

export const calculateGrandTotal = (numbers, operation) => {
  return numbers.rowHeaders.reduce(
    (total, rowNum, r) =>
      total +
      numbers.colHeaders.reduce(
        (subTotal, colNum) =>
          subTotal + calculateExpectedAnswer(rowNum, colNum, operation),
        0
      ),
    0
  );
};

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export const getOperatorSymbol = (operation) => {
  return (
    { addition: "+", subtraction: "-", multiplication: "×", division: "÷" }[
      operation
    ] || "+"
  );
};
