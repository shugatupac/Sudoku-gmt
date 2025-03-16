import React, { useState } from "react";
import { cn } from "../lib/utils";

interface SudokuGridProps {
  grid?: number[][];
  initialGrid?: number[][];
  onCellChange?: (row: number, col: number, value: number) => void;
  highlightMistakes?: boolean;
  selectedCell?: { row: number; col: number } | null;
  onCellSelect?: (row: number, col: number) => void;
  candidates?: Record<string, number[]>;
  onCandidateToggle?: (row: number, col: number, value: number) => void;
  showCandidates?: boolean;
}

// Create a proper deep copy of a 2D array for default grid values
const createDefaultGrid = () => {
  return Array(9)
    .fill(0)
    .map(() => Array(9).fill(0));
};

const SudokuGrid: React.FC<SudokuGridProps> = ({
  grid = createDefaultGrid(),
  initialGrid = createDefaultGrid(),
  onCellChange = () => {},
  highlightMistakes = true,
  selectedCell = null,
  onCellSelect = () => {},
  candidates = {},
  onCandidateToggle = () => {},
  showCandidates = true,
}) => {
  // Generate a default grid if none is provided
  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // Helper function to check if a cell is part of the initial grid
  const isInitialCell = (row: number, col: number) => {
    return initialGrid[row][col] !== 0;
  };

  // Helper function to check if a cell has a mistake
  const hasMistake = (row: number, col: number) => {
    // This is a placeholder for actual mistake detection logic
    // In a real implementation, this would check against the solution
    return false;
  };

  // Helper function to get cell candidates
  const getCellCandidates = (row: number, col: number) => {
    const key = `${row}-${col}`;
    return candidates[key] || [];
  };

  // Helper function to render candidates in a cell
  const renderCandidates = (row: number, col: number) => {
    const cellCandidates = getCellCandidates(row, col);

    return (
      <div className="grid grid-cols-3 grid-rows-3 gap-0 w-full h-full text-[8px] opacity-70">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <div key={num} className="flex items-center justify-center">
            {cellCandidates.includes(num) ? num : ""}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-[540px] h-[540px]">
      <div className="grid grid-cols-9 grid-rows-9 gap-0 w-full h-full border-2 border-gray-800">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected =
              selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
            const isHovered =
              hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex;
            const isInitial = isInitialCell(rowIndex, colIndex);
            const hasError =
              highlightMistakes && hasMistake(rowIndex, colIndex);

            // Determine borders for 3x3 boxes
            const rightBorder =
              (colIndex + 1) % 3 === 0 && colIndex < 8
                ? "border-r-2 border-r-gray-800"
                : "border-r border-r-gray-300";
            const bottomBorder =
              (rowIndex + 1) % 3 === 0 && rowIndex < 8
                ? "border-b-2 border-b-gray-800"
                : "border-b border-b-gray-300";

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "relative flex items-center justify-center cursor-pointer transition-colors",
                  rightBorder,
                  bottomBorder,
                  isSelected ? "bg-blue-100" : "",
                  isHovered && !isSelected ? "bg-gray-100" : "",
                  hasError ? "text-red-500" : "",
                  isInitial ? "font-bold" : "font-normal",
                )}
                onClick={() => onCellSelect(rowIndex, colIndex)}
                onMouseEnter={() =>
                  setHoveredCell({ row: rowIndex, col: colIndex })
                }
                onMouseLeave={() => setHoveredCell(null)}
              >
                {cell === 0 ? (
                  showCandidates ? (
                    renderCandidates(rowIndex, colIndex)
                  ) : null
                ) : (
                  <span className="text-xl">{cell}</span>
                )}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
};

export default SudokuGrid;
