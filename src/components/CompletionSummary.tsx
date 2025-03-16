import React from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Clock, Award, Brain, BarChart2, ArrowRight, Home } from "lucide-react";

interface CompletionSummaryProps {
  timeTaken?: string;
  difficulty?: string;
  score?: number;
  mistakesMade?: number;
  hintsUsed?: number;
  techniquesUsed?: string[];
  newDifficulty?: string;
  performanceRating?: number;
  isOpen?: boolean;
  onPlayAgain?: () => void;
  onReturnToMenu?: () => void;
}

const CompletionSummary = ({
  timeTaken = "12:45",
  difficulty = "Intermediate",
  score = 850,
  mistakesMade = 3,
  hintsUsed = 2,
  techniquesUsed = ["Naked Singles", "Hidden Pairs", "X-Wing"],
  newDifficulty = "Advanced",
  performanceRating = 78,
  isOpen = true,
  onPlayAgain = () => {},
  onReturnToMenu = () => {},
}: CompletionSummaryProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-[600px] bg-white shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="text-2xl font-bold text-center">
            Puzzle Completed!
          </CardTitle>
          <CardDescription className="text-white/90 text-center">
            Great job! Here's how you performed
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">{timeTaken}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Award className="text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Score</p>
                <p className="font-medium">{score} points</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Brain className="text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Difficulty</p>
                <p className="font-medium">{difficulty}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BarChart2 className="text-amber-500" />
              <div>
                <p className="text-sm text-gray-500">Mistakes/Hints</p>
                <p className="font-medium">
                  {mistakesMade} / {hintsUsed}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Performance Rating</p>
              <p className="text-sm font-medium">{performanceRating}%</p>
            </div>
            <Progress value={performanceRating} className="h-2" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Techniques Used</p>
            <div className="flex flex-wrap gap-2">
              {techniquesUsed.map((technique, index) => (
                <Badge key={index} variant="secondary">
                  {technique}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm font-medium text-blue-700">
              Based on your performance, we've adjusted your difficulty level
            </p>
            <div className="flex items-center mt-2">
              <p className="font-medium text-gray-600">{difficulty}</p>
              <ArrowRight className="mx-2 h-4 w-4 text-blue-500" />
              <p className="font-medium text-blue-700">{newDifficulty}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end bg-gray-50 p-6 rounded-b-lg">
          <Button
            variant="outline"
            onClick={onReturnToMenu}
            className="w-full sm:w-auto"
          >
            <Home className="mr-2 h-4 w-4" />
            Main Menu
          </Button>
          <Button
            onClick={onPlayAgain}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            Play Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CompletionSummary;
