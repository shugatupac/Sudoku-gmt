import React, { useState, useEffect } from "react";
import SudokuGrid from "./SudokuGrid";
import GameControls from "./GameControls";
import GameStats from "./GameStats";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { AlertTriangle, Trophy, CheckCircle2, Key } from "lucide-react";
import {
  validateSudokuArrangement,
  getSudokuHint,
  rearrangeSudokuGrid,
  generateValidSudokuGrid,
} from "../lib/gemini-service";
import ApiKeySetup from "./ApiKeySetup";

// Generate an empty grid for initial state
function generateEmptyGrid(): number[][] {
  return Array(9)
    .fill(0)
    .map(() => Array(9).fill(0));
}

// Generate a sample grid with some numbers for testing
function generateSampleGrid(): number[][] {
  const grid = generateEmptyGrid();

  // Add some fixed numbers (this is a valid sudoku puzzle)
  grid[0][0] = 5;
  grid[0][1] = 3;
  grid[0][4] = 7;
  grid[1][0] = 6;
  grid[1][3] = 1;
  grid[1][4] = 9;
  grid[1][5] = 5;
  grid[2][1] = 9;
  grid[2][2] = 8;
  grid[2][7] = 6;
  grid[3][0] = 8;
  grid[3][4] = 6;
  grid[3][8] = 3;
  grid[4][0] = 4;
  grid[4][3] = 8;
  grid[4][5] = 3;
  grid[4][8] = 1;
  grid[5][0] = 7;
  grid[5][4] = 2;
  grid[5][8] = 6;
  grid[6][1] = 6;
  grid[6][6] = 2;
  grid[6][7] = 8;
  grid[7][3] = 4;
  grid[7][4] = 1;
  grid[7][5] = 9;
  grid[7][8] = 5;
  grid[8][4] = 8;
  grid[8][7] = 7;
  grid[8][8] = 9;

  return grid;
}

// Shuffle a grid by randomly swapping numbers and positions while maintaining Sudoku validity
function shuffleGrid(grid: number[][]): number[][] {
  // Create a deep copy of the grid
  const newGrid = grid.map((row) => [...row]);

  // Step 1: Randomly swap digits (1-9) to create a different valid puzzle
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }

  // Create a mapping from original digits to new digits
  const digitMap: Record<number, number> = {};
  for (let i = 0; i < 9; i++) {
    digitMap[i + 1] = digits[i];
  }

  // Apply the digit mapping
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (newGrid[row][col] !== 0) {
        newGrid[row][col] = digitMap[newGrid[row][col]];
      }
    }
  }

  // Step 2: Randomly swap rows within the same block
  for (let block = 0; block < 3; block++) {
    for (let i = 0; i < 3; i++) {
      const row1 = block * 3 + i;
      const row2 = block * 3 + Math.floor(Math.random() * 3);
      if (row1 !== row2) {
        [newGrid[row1], newGrid[row2]] = [newGrid[row2], newGrid[row1]];
      }
    }
  }

  // Step 3: Randomly swap columns within the same block
  for (let block = 0; block < 3; block++) {
    for (let i = 0; i < 3; i++) {
      const col1 = block * 3 + i;
      const col2 = block * 3 + Math.floor(Math.random() * 3);
      if (col1 !== col2) {
        for (let row = 0; row < 9; row++) {
          [newGrid[row][col1], newGrid[row][col2]] = [
            newGrid[row][col2],
            newGrid[row][col1],
          ];
        }
      }
    }
  }

  // Step 4: Randomly swap entire row blocks (groups of 3 rows)
  for (let i = 0; i < 2; i++) {
    const block1 = Math.floor(Math.random() * 3);
    const block2 = Math.floor(Math.random() * 3);
    if (block1 !== block2) {
      for (let j = 0; j < 3; j++) {
        const row1 = block1 * 3 + j;
        const row2 = block2 * 3 + j;
        [newGrid[row1], newGrid[row2]] = [newGrid[row2], newGrid[row1]];
      }
    }
  }

  // Step 5: Randomly swap entire column blocks (groups of 3 columns)
  for (let i = 0; i < 2; i++) {
    const block1 = Math.floor(Math.random() * 3);
    const block2 = Math.floor(Math.random() * 3);
    if (block1 !== block2) {
      for (let j = 0; j < 3; j++) {
        const col1 = block1 * 3 + j;
        const col2 = block2 * 3 + j;
        for (let row = 0; row < 9; row++) {
          [newGrid[row][col1], newGrid[row][col2]] = [
            newGrid[row][col2],
            newGrid[row][col1],
          ];
        }
      }
    }
  }

  return newGrid;
}

interface SudokuGameProps {
  difficulty?: "Easy" | "Medium" | "Hard" | "Expert";
  onExit?: () => void;
  onComplete?: (stats: GameCompletionStats) => void;
  initialGrid?: number[][];
}

interface GameCompletionStats {
  timeElapsed: string;
  difficultyLevel: string;
  mistakesMade: number;
  hintsUsed: number;
  techniquesUsed: string[];
}

const SudokuGame: React.FC<SudokuGameProps> = ({
  difficulty = "Medium",
  onExit = () => {},
  onComplete = () => {},
  initialGrid = generateSampleGrid(), // Use sample grid with numbers by default
}) => {
  // Game state
  const [grid, setGrid] = useState<number[][]>(initialGrid);
  const [originalGrid, setOriginalGrid] = useState<number[][]>(initialGrid);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [candidates, setCandidates] = useState<Record<string, number[]>>({});
  const [candidateMode, setCandidateMode] = useState<boolean>(false);
  const [moveHistory, setMoveHistory] = useState<any[]>([]);

  // Game statistics
  const [timeElapsed, setTimeElapsed] = useState<string>("00:00");
  const [seconds, setSeconds] = useState<number>(0);
  const [mistakesMade, setMistakesMade] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState<number>(0);

  // Game status
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [showCompletionDialog, setShowCompletionDialog] =
    useState<boolean>(false);
  const [showExitConfirmation, setShowExitConfirmation] =
    useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    reason?: string;
    suggestions?: string[];
  } | null>(null);
  const [showValidationDialog, setShowValidationDialog] =
    useState<boolean>(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState<boolean>(false);
  const [apiKeySet, setApiKeySet] = useState<boolean>(false);

  // Timer effect
  useEffect(() => {
    if (isPaused || isComplete) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
      const minutes = Math.floor((seconds + 1) / 60);
      const remainingSeconds = (seconds + 1) % 60;
      setTimeElapsed(
        `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`,
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, isPaused, isComplete]);

  // Check if API key is set
  useEffect(() => {
    const apiKey = localStorage.getItem("gemini_api_key");
    setApiKeySet(!!apiKey);

    // If no API key is set, show the dialog
    if (!apiKey) {
      setShowApiKeyDialog(true);
    }
  }, []);

  // Helper function to check if the grid is complete
  const isGridComplete = (grid: number[][]): boolean => {
    return grid.flat().every((cell) => cell !== 0);
  };

  // Handle cell selection
  const handleCellSelect = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  // Handle number input
  const handleNumberSelect = (number: number) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;

    // Don't allow changing original cells
    if (originalGrid[row][col] !== 0) return;

    if (candidateMode) {
      // Handle candidate mode
      const cellKey = `${row}-${col}`;
      const currentCandidates = candidates[cellKey] || [];

      let newCandidates;
      if (number === 0) {
        // Clear all candidates for this cell
        newCandidates = [];
      } else if (currentCandidates.includes(number)) {
        // Remove the number if it's already a candidate
        newCandidates = currentCandidates.filter((n) => n !== number);
      } else {
        // Add the number as a candidate
        newCandidates = [...currentCandidates, number].sort((a, b) => a - b);
      }

      // Save the move to history
      setMoveHistory((prev) => [
        ...prev,
        {
          type: "candidate",
          row,
          col,
          previous: [...currentCandidates],
          current: newCandidates,
        },
      ]);

      setCandidates((prev) => ({
        ...prev,
        [cellKey]: newCandidates,
      }));
    } else {
      // Handle normal number input
      const newGrid = grid.map((r) => [...r]);

      // Save the move to history
      setMoveHistory((prev) => [
        ...prev,
        { type: "number", row, col, previous: grid[row][col], current: number },
      ]);

      newGrid[row][col] = number;
      setGrid(newGrid);

      // Check if the move was correct (simplified logic)
      // In a real implementation, this would check against the solution
      const isCorrect = true; // Placeholder

      if (!isCorrect) {
        setMistakesMade((prev) => prev + 1);
      }

      // Check if the puzzle is complete
      checkCompletion(newGrid);
    }
  };

  // Handle candidate mode toggle
  const handleCandidateToggle = (isCandidate: boolean) => {
    setCandidateMode(isCandidate);
  };

  // Handle hint request using Gemini AI
  const handleHint = async () => {
    if (!selectedCell) return;

    // Check if API key is set
    if (!apiKeySet) {
      setShowApiKeyDialog(true);
      return;
    }

    // Increment hint counter
    setHintsUsed((prev) => prev + 1);

    // Use Gemini AI to get a hint for the selected cell
    const { row, col } = selectedCell;

    try {
      const hintValue = await getSudokuHint(grid, row, col);

      if (hintValue) {
        const newGrid = grid.map((r) => [...r]);
        newGrid[row][col] = hintValue;

        // Save the move to history
        setMoveHistory((prev) => [
          ...prev,
          {
            type: "hint",
            row,
            col,
            previous: grid[row][col],
            current: hintValue,
          },
        ]);

        setGrid(newGrid);

        // Clear candidates for this cell
        const cellKey = `${row}-${col}`;
        setCandidates((prev) => ({
          ...prev,
          [cellKey]: [],
        }));

        // Check if the puzzle is complete
        checkCompletion(newGrid);
      } else {
        // If AI couldn't provide a hint, use a fallback method
        // For now, we'll just use a placeholder value
        const fallbackValue = 5; // Placeholder

        const newGrid = grid.map((r) => [...r]);
        newGrid[row][col] = fallbackValue;

        // Save the move to history
        setMoveHistory((prev) => [
          ...prev,
          {
            type: "hint",
            row,
            col,
            previous: grid[row][col],
            current: fallbackValue,
          },
        ]);

        setGrid(newGrid);

        // Clear candidates for this cell
        const cellKey = `${row}-${col}`;
        setCandidates((prev) => ({
          ...prev,
          [cellKey]: [],
        }));

        // Check if the puzzle is complete
        checkCompletion(newGrid);
      }
    } catch (error) {
      console.error("Error getting hint:", error);
      // Use fallback method if AI fails
      const fallbackValue = 5; // Placeholder

      const newGrid = grid.map((r) => [...r]);
      newGrid[row][col] = fallbackValue;

      setMoveHistory((prev) => [
        ...prev,
        {
          type: "hint",
          row,
          col,
          previous: grid[row][col],
          current: fallbackValue,
        },
      ]);

      setGrid(newGrid);

      const cellKey = `${row}-${col}`;
      setCandidates((prev) => ({
        ...prev,
        [cellKey]: [],
      }));

      checkCompletion(newGrid);
    }
  };

  // Handle undo
  const handleUndo = () => {
    if (moveHistory.length === 0) return;

    const lastMove = moveHistory[moveHistory.length - 1];
    const { type, row, col, previous } = lastMove;

    if (type === "number" || type === "hint") {
      const newGrid = grid.map((r) => [...r]);
      newGrid[row][col] = previous;
      setGrid(newGrid);
    } else if (type === "candidate") {
      const cellKey = `${row}-${col}`;
      setCandidates((prev) => ({
        ...prev,
        [cellKey]: previous,
      }));
    }

    // Remove the last move from history
    setMoveHistory((prev) => prev.slice(0, -1));
  };

  // Handle check progress with Gemini AI
  const handleCheckProgress = async () => {
    // Check if API key is set
    if (!apiKeySet) {
      setShowApiKeyDialog(true);
      return;
    }

    setIsValidating(true);

    try {
      // Call the Gemini AI service to validate the current grid
      const result = await validateSudokuArrangement(grid);
      setValidationResult(result);
      setShowValidationDialog(true);
    } catch (error) {
      console.error("Error validating Sudoku:", error);
      setValidationResult({
        isValid: false,
        reason: "Failed to validate with AI service",
        suggestions: ["Try again later or check your internet connection"],
      });
      setShowValidationDialog(true);
    } finally {
      setIsValidating(false);
    }
  };

  // Handle saving the API key
  const handleSaveApiKey = (apiKey: string) => {
    localStorage.setItem("gemini_api_key", apiKey);
    setApiKeySet(true);
  };

  // Check if the puzzle is complete
  const checkCompletion = (currentGrid: number[][]) => {
    // Simple completion check: all cells filled
    const isGridFilled = currentGrid.flat().every((cell) => cell !== 0);

    // In a real implementation, this would also check if the solution is correct
    const isSolutionCorrect = true; // Placeholder

    if (isGridFilled && isSolutionCorrect) {
      setIsComplete(true);
      setShowCompletionDialog(true);

      // Prepare completion stats
      const stats: GameCompletionStats = {
        timeElapsed,
        difficultyLevel: difficulty,
        mistakesMade,
        hintsUsed,
        techniquesUsed: ["Basic Elimination", "Naked Singles"], // Placeholder
      };

      onComplete(stats);
    }
  };

  // Handle exit confirmation
  const handleExitConfirm = () => {
    setShowExitConfirmation(false);
    onExit();
  };

  // Handle generating a new grid
  const handleGenerateNewGrid = async () => {
    // Check if API key is set
    if (!apiKeySet) {
      setShowApiKeyDialog(true);
      return;
    }

    // Show loading state
    setIsValidating(true);

    try {
      // Try to generate a new grid using Gemini AI
      const aiGrid = await generateValidSudokuGrid();

      if (aiGrid) {
        // Use the AI-generated grid and then shuffle it for more randomness
        const shuffledAiGrid = shuffleGrid(aiGrid);
        setGrid(shuffledAiGrid);
        setOriginalGrid(shuffledAiGrid);
      } else {
        // Fallback to shuffling the sample grid if AI fails
        const shuffledGrid = shuffleGrid(generateSampleGrid());
        setGrid(shuffledGrid);
        setOriginalGrid(shuffledGrid);
      }

      // Reset game state
      setSelectedCell(null);
      setCandidates({});
      setMoveHistory([]);
      setSeconds(0);
      setTimeElapsed("00:00");
      setMistakesMade(0);
      setHintsUsed(0);
      setIsComplete(false);

      // Show success message
      setValidationResult({
        isValid: true,
        reason: "A new randomized Sudoku puzzle has been generated.",
        suggestions: [
          "The numbers have been shuffled and rearranged while maintaining Sudoku validity.",
        ],
      });
      setShowValidationDialog(true);
    } catch (error) {
      console.error("Error generating new grid:", error);
      // Fallback to shuffling the sample grid
      const shuffledGrid = shuffleGrid(generateSampleGrid());
      setGrid(shuffledGrid);
      setOriginalGrid(shuffledGrid);

      // Show fallback message
      setValidationResult({
        isValid: true,
        reason:
          "A new randomized Sudoku puzzle has been generated using the fallback method.",
        suggestions: [
          "The AI service couldn't be reached, but a valid puzzle has been created.",
        ],
      });
      setShowValidationDialog(true);
    } finally {
      setIsValidating(false);
    }
  };

  // Handle AI rearrangement of the grid
  const handleRearrangeGrid = async () => {
    // Check if API key is set
    if (!apiKeySet) {
      setShowApiKeyDialog(true);
      return;
    }

    // Show loading state
    setIsValidating(true);

    try {
      // Use Gemini AI to rearrange the grid
      const rearrangedGrid = await rearrangeSudokuGrid(grid);

      if (rearrangedGrid) {
        // Update the grid with the rearranged version
        setGrid(rearrangedGrid);
        setOriginalGrid(rearrangedGrid);

        // Reset game state
        setSelectedCell(null);
        setCandidates({});
        setMoveHistory([]);
        setSeconds(0);
        setTimeElapsed("00:00");
        setMistakesMade(0);
        setHintsUsed(0);
        setIsComplete(false);

        // Show success message
        setValidationResult({
          isValid: true,
          reason: "The grid has been successfully rearranged by AI.",
          suggestions: ["You can now continue playing with the fixed grid."],
        });
        setShowValidationDialog(true);
      } else {
        // Show error message if AI couldn't rearrange
        setValidationResult({
          isValid: false,
          reason: "AI couldn't rearrange the grid successfully.",
          suggestions: ["Try generating a new grid instead."],
        });
        setShowValidationDialog(true);
      }
    } catch (error) {
      console.error("Error rearranging grid:", error);
      setValidationResult({
        isValid: false,
        reason: "Failed to rearrange the grid with AI service.",
        suggestions: ["Try again later or check your internet connection."],
      });
      setShowValidationDialog(true);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg w-full max-w-[1000px] h-full">
      {/* Game Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Sudoku - {difficulty}
        </h1>
      </div>

      {/* Game Stats */}
      <div className="mb-4">
        <GameStats
          timeElapsed={timeElapsed}
          difficultyLevel={difficulty}
          mistakesMade={mistakesMade}
          hintsUsed={hintsUsed}
          maxMistakes={3}
          maxHints={3}
        />
      </div>

      {/* Game Area */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Sudoku Grid */}
        <div className="flex-1 flex justify-center">
          <SudokuGrid
            grid={grid}
            initialGrid={originalGrid}
            onCellSelect={handleCellSelect}
            selectedCell={selectedCell}
            candidates={candidates}
            showCandidates={true}
          />
        </div>

        {/* Game Controls */}
        <div className="w-full md:w-[300px]">
          <GameControls
            onNumberSelect={handleNumberSelect}
            onCandidateToggle={handleCandidateToggle}
            onHint={handleHint}
            onUndo={handleUndo}
            onCheckProgress={handleCheckProgress}
            onExit={() => setShowExitConfirmation(true)}
            candidateMode={candidateMode}
            onGenerateNewGrid={handleGenerateNewGrid}
            onRearrangeGrid={handleRearrangeGrid}
          />
        </div>
      </div>

      {/* Completion Dialog */}
      <Dialog
        open={showCompletionDialog}
        onOpenChange={setShowCompletionDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Puzzle Complete!
          </DialogTitle>
          <div className="py-4">
            <p className="mb-2">
              Congratulations! You've completed the puzzle.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">{timeElapsed}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Difficulty</p>
                <p className="font-medium">{difficulty}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mistakes</p>
                <p className="font-medium">{mistakesMade}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Hints Used</p>
                <p className="font-medium">{hintsUsed}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCompletionDialog(false)}
            >
              Close
            </Button>
            <Button onClick={onExit}>Return to Menu</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Exit Confirmation Dialog */}
      <Dialog
        open={showExitConfirmation}
        onOpenChange={setShowExitConfirmation}
      >
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            Exit Game?
          </DialogTitle>
          <div className="py-4">
            <p>Are you sure you want to exit? Your progress will be saved.</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowExitConfirmation(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleExitConfirm}>
              Exit Game
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Validation Result Dialog */}
      <Dialog
        open={showValidationDialog}
        onOpenChange={setShowValidationDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="flex items-center gap-2">
            {validationResult?.isValid ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Sudoku Validation
              </>
            ) : (
              <>
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                Sudoku Validation
              </>
            )}
          </DialogTitle>
          <div className="py-4">
            {isValidating ? (
              <p>Analyzing your Sudoku puzzle with AI...</p>
            ) : validationResult ? (
              <div className="space-y-4">
                <p
                  className={
                    validationResult.isValid
                      ? "text-green-600 font-medium"
                      : "text-amber-600 font-medium"
                  }
                >
                  {validationResult.isValid
                    ? "Your Sudoku arrangement is valid!"
                    : "There are some issues with your Sudoku arrangement."}
                </p>

                {validationResult.reason && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Reason:</p>
                    <p className="text-sm">{validationResult.reason}</p>
                  </div>
                )}

                {validationResult.suggestions &&
                  validationResult.suggestions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Suggestions:
                      </p>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {validationResult.suggestions.map(
                          (suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            ) : (
              <p>Failed to analyze the Sudoku puzzle.</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            {!validationResult?.isValid && (
              <Button
                variant="outline"
                onClick={handleRearrangeGrid}
                className="mr-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 mr-2"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                  <path d="M8 16H3v5"></path>
                </svg>
                Fix with AI
              </Button>
            )}
            <Button onClick={() => setShowValidationDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* API Key Setup Dialog */}
      <ApiKeySetup
        open={showApiKeyDialog}
        onOpenChange={setShowApiKeyDialog}
        onSaveApiKey={handleSaveApiKey}
      />
    </div>
  );
};

export default SudokuGame;
