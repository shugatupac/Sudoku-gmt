import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Play, BarChart2, BookOpen, Settings } from "lucide-react";

interface MainMenuProps {
  onPlayGame?: () => void;
  onViewProgress?: () => void;
  onLearningResources?: () => void;
  onSettings?: () => void;
  userName?: string;
  currentLevel?: string;
  completedPuzzles?: number;
}

const MainMenu = ({
  onPlayGame = () => console.log("Play Game clicked"),
  onViewProgress = () => console.log("View Progress clicked"),
  onLearningResources = () => console.log("Learning Resources clicked"),
  onSettings = () => console.log("Settings clicked"),
  userName = "Player",
  currentLevel = "Beginner",
  completedPuzzles = 0,
}: MainMenuProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50">
      <Card className="w-full max-w-md shadow-lg bg-white">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold text-primary">
            Sudoku AI Challenge
          </CardTitle>
          <p className="text-muted-foreground mt-2">Welcome back, {userName}</p>
          <div className="flex justify-center items-center gap-2 mt-2">
            <span className="text-sm font-medium">Level: {currentLevel}</span>
            <span className="text-sm font-medium">•</span>
            <span className="text-sm font-medium">
              {completedPuzzles} puzzles completed
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <Button
            variant="default"
            size="lg"
            className="w-full flex items-center justify-start gap-3 h-14"
            onClick={onPlayGame}
          >
            <Play className="h-5 w-5" />
            <span className="flex-1 text-left">Play Game</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full flex items-center justify-start gap-3 h-14"
            onClick={onViewProgress}
          >
            <BarChart2 className="h-5 w-5" />
            <span className="flex-1 text-left">View Progress</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full flex items-center justify-start gap-3 h-14"
            onClick={onLearningResources}
          >
            <BookOpen className="h-5 w-5" />
            <span className="flex-1 text-left">Learning Resources</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full flex items-center justify-start gap-3 h-14"
            onClick={onSettings}
          >
            <Settings className="h-5 w-5" />
            <span className="flex-1 text-left">Settings</span>
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Your puzzles adapt to your skill level using AI
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainMenu;
