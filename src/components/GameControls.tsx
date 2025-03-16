import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Separator } from "./ui/separator";
import {
  Undo2,
  HelpCircle,
  CheckCircle,
  X,
  Home,
  Lightbulb,
  Plus,
  RefreshCw,
} from "lucide-react";

interface GameControlsProps {
  onNumberSelect?: (number: number) => void;
  onCandidateToggle?: (isCandidate: boolean) => void;
  onHint?: () => void;
  onUndo?: () => void;
  onCheckProgress?: () => void;
  onExit?: () => void;
  disabledNumbers?: number[];
  candidateMode?: boolean;
  onGenerateNewGrid?: () => void;
  onRearrangeGrid?: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  onNumberSelect = () => {},
  onCandidateToggle = () => {},
  onHint = () => {},
  onUndo = () => {},
  onCheckProgress = () => {},
  onExit = () => {},
  disabledNumbers = [],
  candidateMode = false,
  onGenerateNewGrid = () => {},
  onRearrangeGrid = () => {},
}) => {
  const [isCandidateMode, setIsCandidateMode] = useState(candidateMode);

  const handleCandidateToggle = () => {
    const newMode = !isCandidateMode;
    setIsCandidateMode(newMode);
    onCandidateToggle(newMode);
  };

  const handleNumberSelect = (number: number) => {
    onNumberSelect(number);
  };

  return (
    <Card className="p-4 bg-white shadow-md flex flex-col h-full justify-between">
      <div className="space-y-6">
        {/* Number Pad */}
        <div>
          <h3 className="text-lg font-medium mb-2">Number Pad</h3>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <Button
                key={number}
                variant={
                  disabledNumbers.includes(number) ? "outline" : "default"
                }
                className={`h-12 text-xl ${disabledNumbers.includes(number) ? "opacity-50" : ""}`}
                onClick={() => handleNumberSelect(number)}
                disabled={disabledNumbers.includes(number)}
              >
                {number}
              </Button>
            ))}
            <Button
              variant="outline"
              className="h-12 text-xl col-span-3"
              onClick={() => handleNumberSelect(0)}
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Candidate Mode Toggle */}
        <div>
          <h3 className="text-lg font-medium mb-2">Input Mode</h3>
          <div className="flex gap-2">
            <Button
              variant={isCandidateMode ? "outline" : "default"}
              className="flex-1"
              onClick={handleCandidateToggle}
            >
              Normal
            </Button>
            <Button
              variant={isCandidateMode ? "default" : "outline"}
              className="flex-1"
              onClick={handleCandidateToggle}
            >
              Candidates
            </Button>
          </div>
        </div>

        <Separator />

        {/* Game Actions */}
        <div>
          <h3 className="text-lg font-medium mb-2">Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={onHint}
                    className="flex items-center gap-2"
                  >
                    <Lightbulb className="h-4 w-4" />
                    AI Hint
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Get a hint for your next move</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={onUndo}
                    className="flex items-center gap-2"
                  >
                    <Undo2 className="h-4 w-4" />
                    Undo
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Undo your last move</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={onCheckProgress}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    AI Check
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Check your progress with AI</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={onGenerateNewGrid}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    New Grid
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate a new puzzle</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={onRearrangeGrid}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    AI Fix
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Let AI fix arrangement errors</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={onExit}
                    className="flex items-center gap-2 text-red-500 col-span-2"
                  >
                    <X className="h-4 w-4" />
                    Exit
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Exit the current game</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Return to Main Menu */}
      <Button
        variant="ghost"
        onClick={onExit}
        className="mt-4 w-full flex items-center justify-center gap-2"
      >
        <Home className="h-4 w-4" />
        Main Menu
      </Button>
    </Card>
  );
};

export default GameControls;
