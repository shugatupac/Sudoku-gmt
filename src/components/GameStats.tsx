import React from "react";
import { Clock, Target, AlertTriangle, Lightbulb } from "lucide-react";
import { Card } from "./ui/card";

interface GameStatsProps {
  timeElapsed: string;
  difficultyLevel: string;
  mistakesMade: number;
  hintsUsed: number;
  maxMistakes?: number;
  maxHints?: number;
}

const GameStats = ({
  timeElapsed = "00:00",
  difficultyLevel = "Medium",
  mistakesMade = 0,
  hintsUsed = 0,
  maxMistakes = 3,
  maxHints = 3,
}: GameStatsProps) => {
  return (
    <Card className="w-full p-4 bg-white shadow-sm">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-gray-700">Time</p>
            <p className="text-lg font-bold">{timeElapsed}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          <div>
            <p className="text-sm font-medium text-gray-700">Difficulty</p>
            <p className="text-lg font-bold">{difficultyLevel}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <div>
            <p className="text-sm font-medium text-gray-700">Mistakes</p>
            <div className="flex items-center gap-1">
              <p className="text-lg font-bold">{mistakesMade}</p>
              <span className="text-sm text-gray-500">/ {maxMistakes}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-gray-700">Hints</p>
            <div className="flex items-center gap-1">
              <p className="text-lg font-bold">{hintsUsed}</p>
              <span className="text-sm text-gray-500">/ {maxHints}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GameStats;
