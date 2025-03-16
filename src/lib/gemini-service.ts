import { GoogleGenerativeAI } from "@google/generative-ai";

// Get the API key from local storage
const getApiKey = (): string | null => {
  return localStorage.getItem("gemini_api_key");
};

// Initialize the Google Generative AI SDK with the API key from local storage
const createGenAI = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Gemini API key not found");
  }
  return new GoogleGenerativeAI(apiKey);
};

export interface SudokuValidationResult {
  isValid: boolean;
  reason?: string;
  suggestions?: string[];
}

export async function validateSudokuArrangement(
  grid: number[][],
): Promise<SudokuValidationResult> {
  try {
    // Convert the grid to a string representation for the AI
    const gridString = grid.map((row) => row.join(" ")).join("\n");

    const genAI = createGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      I have a Sudoku puzzle. Please analyze it and tell me if it's valid according to Sudoku rules.
      If it's not valid, explain why and suggest corrections.
      
      Here's the grid (0 represents empty cells):
      ${gridString}
      
      Please respond in JSON format with the following structure:
      {
        "isValid": boolean,
        "reason": string (explanation if invalid),
        "suggestions": array of strings (suggestions for improvement)
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    try {
      return JSON.parse(text) as SudokuValidationResult;
    } catch (e) {
      // If the AI didn't return valid JSON, try to extract information manually
      const isValid =
        text.toLowerCase().includes("valid") &&
        !text.toLowerCase().includes("not valid");
      return {
        isValid,
        reason: isValid ? undefined : "The arrangement appears to have issues",
        suggestions: isValid
          ? undefined
          : ["Consider reviewing the puzzle rules"],
      };
    }
  } catch (error) {
    console.error("Error validating Sudoku with Gemini:", error);
    return {
      isValid: false,
      reason: "Failed to validate with AI service",
      suggestions: ["Try again later or check your internet connection"],
    };
  }
}

export async function rearrangeSudokuGrid(
  grid: number[][],
): Promise<number[][] | null> {
  try {
    // Convert the grid to a string representation for the AI
    const gridString = grid.map((row) => row.join(" ")).join("\n");

    const genAI = createGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      I have a Sudoku puzzle that may have arrangement errors. Please fix the arrangement to make it a valid Sudoku puzzle.
      
      Here's the current grid (0 represents empty cells):
      ${gridString}
      
      Please respond with a valid Sudoku puzzle grid in the following format:
      1 2 3 4 5 6 7 8 9
      4 5 6 7 8 9 1 2 3
      ...
      
      Make sure to maintain as many of the original numbers as possible, only changing what's necessary to make it valid.
      If there are empty cells (0s), you can fill them in with valid numbers or leave them as 0s.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Parse the grid from the response
    const lines = text
      .split("\n")
      .filter(
        (line) =>
          line.trim().length > 0 &&
          !line.includes("Here's") &&
          !line.includes("Valid") &&
          !line.includes("Sudoku"),
      );

    if (lines.length >= 9) {
      const newGrid: number[][] = [];

      // Take only the first 9 lines that look like grid rows
      for (let i = 0; i < 9; i++) {
        if (i < lines.length) {
          const row = lines[i]
            .trim()
            .split(/\s+/)
            .map((num) => {
              const parsed = parseInt(num, 10);
              return isNaN(parsed) ? 0 : parsed;
            });

          // Ensure we have exactly 9 numbers in each row
          while (row.length < 9) row.push(0);
          newGrid.push(row.slice(0, 9));
        } else {
          newGrid.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
      }

      return newGrid;
    }

    return null;
  } catch (error) {
    console.error("Error rearranging Sudoku grid with Gemini:", error);
    return null;
  }
}

export async function generateValidSudokuGrid(): Promise<number[][] | null> {
  try {
    const genAI = createGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Generate a valid Sudoku puzzle with some cells filled in (about 25-30 cells).
      The puzzle should be challenging but solvable.
      
      Please respond with the Sudoku grid in the following format:
      1 2 3 4 5 6 7 8 9
      4 5 6 7 8 9 1 2 3
      ...
      
      Use 0 for empty cells that the player needs to fill in.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Parse the grid from the response
    const lines = text
      .split("\n")
      .filter(
        (line) =>
          line.trim().length > 0 &&
          !line.includes("Here's") &&
          !line.includes("Valid") &&
          !line.includes("Sudoku"),
      );

    if (lines.length >= 9) {
      const newGrid: number[][] = [];

      // Take only the first 9 lines that look like grid rows
      for (let i = 0; i < 9; i++) {
        if (i < lines.length) {
          const row = lines[i]
            .trim()
            .split(/\s+/)
            .map((num) => {
              const parsed = parseInt(num, 10);
              return isNaN(parsed) ? 0 : parsed;
            });

          // Ensure we have exactly 9 numbers in each row
          while (row.length < 9) row.push(0);
          newGrid.push(row.slice(0, 9));
        } else {
          newGrid.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
      }

      return newGrid;
    }

    return null;
  } catch (error) {
    console.error("Error generating Sudoku grid with Gemini:", error);
    return null;
  }
}

export async function getSudokuHint(
  grid: number[][],
  row: number,
  col: number,
): Promise<number | null> {
  try {
    // Convert the grid to a string representation for the AI
    const gridString = grid.map((row) => row.join(" ")).join("\n");

    const genAI = createGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      I have a Sudoku puzzle and I need a hint for the cell at row ${row + 1}, column ${col + 1}.
      Please analyze the puzzle and tell me what number should go in that cell.
      
      Here's the grid (0 represents empty cells):
      ${gridString}
      
      Please respond with just a single number that should go in the cell.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Try to extract a number from the response
    const numberMatch = text.match(/\d+/);
    if (numberMatch && numberMatch[0]) {
      const number = parseInt(numberMatch[0], 10);
      if (number >= 1 && number <= 9) {
        return number;
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting Sudoku hint with Gemini:", error);
    return null;
  }
}
