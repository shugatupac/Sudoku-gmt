import React, { useState } from "react";
import MainMenu from "./MainMenu";
import SudokuGame from "./SudokuGame";
import ProgressDashboard from "./ProgressDashboard";
import TechniqueLibrary from "./TechniqueLibrary";
import SettingsPanel from "./SettingsPanel";
import Tutorial from "./Tutorial";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

interface GameCompletionStats {
  timeElapsed: string;
  difficultyLevel: string;
  mistakesMade: number;
  hintsUsed: number;
  techniquesUsed: string[];
}

const Home = () => {
  // State to track which component to display
  const [currentView, setCurrentView] = useState<
    "menu" | "game" | "progress" | "library" | "settings"
  >("menu");

  // State to track if tutorial should be shown (for first-time users)
  const [showTutorial, setShowTutorial] = useState(false);

  // Mock user data
  const [userData, setUserData] = useState({
    name: "Player",
    currentLevel: "Intermediate",
    completedPuzzles: 24,
    difficulty: "Medium" as "Easy" | "Medium" | "Hard" | "Expert",
  });

  // Handle game completion
  const handleGameComplete = (stats: GameCompletionStats) => {
    console.log("Game completed with stats:", stats);
    // In a real app, this would update the user's profile and ML model
    setUserData((prev) => ({
      ...prev,
      completedPuzzles: prev.completedPuzzles + 1,
    }));
  };

  // Navigation handlers
  const navigateToGame = () => setCurrentView("game");
  const navigateToProgress = () => setCurrentView("progress");
  const navigateToLibrary = () => setCurrentView("library");
  const navigateToSettings = () => setCurrentView("settings");
  const navigateToMenu = () => setCurrentView("menu");

  // Render the appropriate component based on current view
  const renderContent = () => {
    switch (currentView) {
      case "game":
        return (
          <div className="w-full max-w-6xl mx-auto">
            <div className="mb-4">
              <Button
                variant="ghost"
                onClick={navigateToMenu}
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Menu
              </Button>
            </div>
            <SudokuGame
              difficulty={userData.difficulty}
              onExit={navigateToMenu}
              onComplete={handleGameComplete}
            />
          </div>
        );
      case "progress":
        return <ProgressDashboard playerName={userData.name} />;
      case "library":
        return <TechniqueLibrary />;
      case "settings":
        return <SettingsPanel onLogout={navigateToMenu} />;
      case "menu":
      default:
        return (
          <MainMenu
            userName={userData.name}
            currentLevel={userData.currentLevel}
            completedPuzzles={userData.completedPuzzles}
            onPlayGame={navigateToGame}
            onViewProgress={navigateToProgress}
            onLearningResources={navigateToLibrary}
            onSettings={navigateToSettings}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {renderContent()}

      {/* Tutorial dialog for first-time users */}
      <Tutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
    </div>
  );
};

export default Home;
