import React, { useEffect } from "react";
import {
  calculateExpectedAnswer,
  calculateRowTotal,
  calculateColumnTotal,
  calculateGrandTotal,
  getOperatorSymbol,
} from "../../utils/mathUtils";

const GameTable = ({
  numbers,
  answers,
  setAnswers,
  selectedCell,
  setSelectedCell,
  gameState,
  inputRefs,
  operation,
}) => {
  const isInputDisabled = gameState !== "playing";

  const getCellStyle = (cellId, expectedAnswer) => {
    const isSelected =
      selectedCell &&
      (cellId === `${selectedCell.row}-${selectedCell.col}` ||
        (cellId === `row-total-${selectedCell.row}` &&
          selectedCell.col === numbers.colHeaders.length) ||
        (cellId === `col-total-${selectedCell.col}` &&
          selectedCell.row === numbers.rowHeaders.length) ||
        (cellId === "grand-total" &&
          selectedCell.row === numbers.rowHeaders.length &&
          selectedCell.col === numbers.colHeaders.length));

    if (isInputDisabled) {
      if (!(cellId in answers) || answers[cellId] === "") return "bg-gray-200";
      return parseFloat(answers[cellId]) === expectedAnswer
        ? "bg-green-200"
        : "bg-red-200";
    }
    return isSelected ? "bg-blue-100" : "bg-white";
  };

  const isHighlighted = (index, type) =>
    selectedCell &&
    ((type === "row" && selectedCell.row === index) ||
      (type === "col" && selectedCell.col === index));

  const handleInputChange = (e, cellId) => {
    const value = e.target.value;
    if (
      value === "" ||
      (operation === "division"
        ? /^-?\d*\.?\d*$/.test(value)
        : /^-?\d*$/.test(value))
    ) {
      setAnswers((prev) => ({ ...prev, [cellId]: value }));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState === "completed") return;
      const { row, col } = selectedCell || { row: 0, col: 0 };
      const maxRow = numbers.rowHeaders.length;
      const maxCol = numbers.colHeaders.length;

      const move = (r, c) => {
        e.preventDefault();
        setSelectedCell({ row: r, col: c });
        const cellId =
          r === maxRow && c === maxCol
            ? "grand-total"
            : r === maxRow
            ? `col-total-${c}`
            : c === maxCol
            ? `row-total-${r}`
            : `${r}-${c}`;
        if (inputRefs.current[cellId]) inputRefs.current[cellId].focus();
      };

      switch (e.key) {
        case "ArrowUp":
          move(row - 1, col);
          break;
        case "ArrowDown":
          move(row + 1, col);
          break;
        case "ArrowLeft":
          move(row, col - 1);
          break;
        case "ArrowRight":
          move(row, col + 1);
          break;
        case "Tab":
          e.preventDefault();
          if (e.shiftKey) {
            if (col > 0) move(row, col - 1);
            else if (row > 0) move(row - 1, maxCol);
          } else {
            if (col < maxCol) move(row, col + 1);
            else if (row < maxRow) move(row + 1, 0);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCell, gameState, numbers]);

  return (
    <div className="overflow-x-auto rounded shadow">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-100">
              <span className="inline-block p-1">
                {getOperatorSymbol(operation)}
              </span>
            </th>
            {numbers.colHeaders.map((num, index) => (
              <th
                key={index}
                className={`border p-2 text-center ${
                  isHighlighted(index, "col") ? "bg-blue-200" : "bg-gray-100"
                }`}
              >
                {num}
              </th>
            ))}
            <th className="border p-2 text-center bg-gray-200 font-bold">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {numbers.rowHeaders.map((rowNum, rowIndex) => (
            <tr key={rowIndex}>
              <th
                className={`border p-2 text-center ${
                  isHighlighted(rowIndex, "row") ? "bg-blue-200" : "bg-gray-100"
                }`}
              >
                {rowNum}
              </th>
              {numbers.colHeaders.map((colNum, colIndex) => (
                <td
                  key={colIndex}
                  className={`border p-2 ${getCellStyle(
                    `${rowIndex}-${colIndex}`,
                    calculateExpectedAnswer(rowNum, colNum, operation)
                  )}`}
                >
                  <input
                    ref={(el) =>
                      (inputRefs.current[`${rowIndex}-${colIndex}`] = el)
                    }
                    type="text"
                    value={answers[`${rowIndex}-${colIndex}`] || ""}
                    onChange={(e) =>
                      handleInputChange(e, `${rowIndex}-${colIndex}`)
                    }
                    onFocus={() =>
                      setSelectedCell({ row: rowIndex, col: colIndex })
                    }
                    disabled={isInputDisabled}
                    className="w-full h-full p-1 text-center focus:outline-none bg-transparent"
                    placeholder="?"
                  />
                </td>
              ))}
              <td
                className={`border p-2 ${getCellStyle(
                  `row-total-${rowIndex}`,
                  calculateRowTotal(numbers, rowIndex, operation)
                )}`}
              >
                <input
                  ref={(el) =>
                    (inputRefs.current[`row-total-${rowIndex}`] = el)
                  }
                  type="text"
                  value={answers[`row-total-${rowIndex}`] || ""}
                  onChange={(e) =>
                    handleInputChange(e, `row-total-${rowIndex}`)
                  }
                  onFocus={() =>
                    setSelectedCell({
                      row: rowIndex,
                      col: numbers.colHeaders.length,
                    })
                  }
                  disabled={isInputDisabled}
                  className="w-full h-full p-1 text-center focus:outline-none bg-transparent font-bold"
                  placeholder="Total?"
                />
              </td>
            </tr>
          ))}
          <tr>
            <th className="border p-2 text-center bg-gray-200 font-bold">
              Total
            </th>
            {numbers.colHeaders.map((_, colIndex) => (
              <td
                key={colIndex}
                className={`border p-2 ${getCellStyle(
                  `col-total-${colIndex}`,
                  calculateColumnTotal(numbers, colIndex, operation)
                )}`}
              >
                <input
                  ref={(el) =>
                    (inputRefs.current[`col-total-${colIndex}`] = el)
                  }
                  type="text"
                  value={answers[`col-total-${colIndex}`] || ""}
                  onChange={(e) =>
                    handleInputChange(e, `col-total-${colIndex}`)
                  }
                  onFocus={() =>
                    setSelectedCell({
                      row: numbers.rowHeaders.length,
                      col: colIndex,
                    })
                  }
                  disabled={isInputDisabled}
                  className="w-full h-full p-1 text-center focus:outline-none bg-transparent font-bold"
                  placeholder="Total?"
                />
              </td>
            ))}
            <td
              className={`border p-2 ${getCellStyle(
                "grand-total",
                calculateGrandTotal(numbers, operation)
              )}`}
            >
              <input
                ref={(el) => (inputRefs.current["grand-total"] = el)}
                type="text"
                value={answers["grand-total"] || ""}
                onChange={(e) => handleInputChange(e, "grand-total")}
                onFocus={() =>
                  setSelectedCell({
                    row: numbers.rowHeaders.length,
                    col: numbers.colHeaders.length,
                  })
                }
                disabled={isInputDisabled}
                className="w-full h-full p-1 text-center focus:outline-none bg-transparent font-bold"
                placeholder="Grand Total?"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default GameTable;
