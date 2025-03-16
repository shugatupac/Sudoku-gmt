import React, { useState } from "react";
import { Check, ChevronRight, HelpCircle, Info } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface TutorialProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Tutorial = ({ isOpen = true, onClose = () => {} }: TutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Welcome to Sudoku AI Challenge",
      description:
        "Learn the basics of playing Sudoku with our adaptive AI system.",
      content: (
        <div className="space-y-4">
          <p>
            Sudoku is a logic-based number placement puzzle. The objective is to
            fill a 9×9 grid with digits so that each column, each row, and each
            of the nine 3×3 subgrids contains all of the digits from 1 to 9.
          </p>
          <div className="bg-muted p-4 rounded-md">
            <p className="flex items-center text-sm">
              <Info className="h-4 w-4 mr-2" /> Our AI will adapt to your skill
              level, providing increasingly challenging puzzles as you improve.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "How to Play",
      description: "Basic rules and controls for playing Sudoku.",
      content: (
        <div className="space-y-4">
          <ul className="space-y-2">
            <li className="flex items-start">
              <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
              <span>Click on an empty cell and enter a number from 1-9</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
              <span>
                Each row, column, and 3×3 box must contain numbers 1-9 without
                repetition
              </span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
              <span>
                Use candidate markers to note possible numbers for a cell
              </span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
              <span>Request hints when you're stuck</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Game Features",
      description: "Helpful tools to enhance your Sudoku experience.",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted p-3 rounded-md">
              <h4 className="font-medium mb-1">Hint System</h4>
              <p className="text-sm">
                Get contextual hints based on your current progress
              </p>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <h4 className="font-medium mb-1">Mistake Highlighting</h4>
              <p className="text-sm">
                Immediate feedback when you make an error
              </p>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <h4 className="font-medium mb-1">Candidate Marking</h4>
              <p className="text-sm">Note possible numbers for cells</p>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <h4 className="font-medium mb-1">Progress Tracking</h4>
              <p className="text-sm">Monitor your improvement over time</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Adaptive Difficulty",
      description:
        "Our AI learns from your play style to create personalized challenges.",
      content: (
        <div className="space-y-4">
          <p>
            The Sudoku AI Challenge uses machine learning to analyze your
            solving patterns and adjust difficulty accordingly:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 mr-2 text-blue-500 shrink-0 mt-0.5" />
              <span>Beginners receive more guidance and simpler puzzles</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 mr-2 text-blue-500 shrink-0 mt-0.5" />
              <span>As you improve, puzzles become more challenging</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 mr-2 text-blue-500 shrink-0 mt-0.5" />
              <span>The system identifies techniques you've mastered</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 mr-2 text-blue-500 shrink-0 mt-0.5" />
              <span>
                Puzzles will gradually introduce new solving techniques
              </span>
            </li>
          </ul>
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md border border-blue-200 dark:border-blue-800">
            <p className="flex items-center text-sm">
              <HelpCircle className="h-4 w-4 mr-2 text-blue-500" /> Visit the
              Learning Resources section to learn advanced solving techniques
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Ready to Play!",
      description: "You're all set to start your Sudoku journey.",
      content: (
        <div className="space-y-4 text-center">
          <div className="py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-medium">You're Ready to Go!</h3>
            <p className="mt-2 text-muted-foreground">
              Start with your first puzzle and begin your Sudoku journey.
            </p>
          </div>
          <p>
            Remember, you can always access this tutorial again from the
            settings menu.
          </p>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const currentTutorial = tutorialSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle>{currentTutorial.title}</DialogTitle>
          <DialogDescription>{currentTutorial.description}</DialogDescription>
        </DialogHeader>

        <div className="py-4">{currentTutorial.content}</div>

        <div className="mt-2 mb-2">
          <div className="flex justify-center space-x-1">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full w-8 ${index === currentStep ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <div>
            {currentStep > 0 ? (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            ) : (
              <Button variant="outline" onClick={handleSkip}>
                Skip Tutorial
              </Button>
            )}
          </div>
          <Button onClick={handleNext}>
            {currentStep < tutorialSteps.length - 1 ? "Next" : "Get Started"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Tutorial;
