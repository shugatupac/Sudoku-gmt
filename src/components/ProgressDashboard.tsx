import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import {
  ArrowRight,
  Award,
  Brain,
  ChevronRight,
  Target,
  Trophy,
} from "lucide-react";
import DifficultyChart from "./DifficultyChart";
import TechniqueMastery from "./TechniqueMastery";

interface ProgressDashboardProps {
  playerName?: string;
  totalGames?: number;
  winRate?: number;
  averageDifficulty?: number;
  achievements?: {
    name: string;
    description: string;
    earned: boolean;
    date?: string;
  }[];
  nextChallengeLevel?: string;
  nextChallengeDifficulty?: number;
}

const ProgressDashboard = ({
  playerName = "Player",
  totalGames = 42,
  winRate = 87,
  averageDifficulty = 3.8,
  achievements = [
    {
      name: "First Victory",
      description: "Complete your first Sudoku puzzle",
      earned: true,
      date: "2023-01-05",
    },
    {
      name: "Speed Demon",
      description: "Complete an easy puzzle in under 5 minutes",
      earned: true,
      date: "2023-01-12",
    },
    {
      name: "No Mistakes",
      description: "Complete a medium puzzle with zero mistakes",
      earned: true,
      date: "2023-01-28",
    },
    {
      name: "Technique Master",
      description: "Use 5 different advanced techniques in one puzzle",
      earned: false,
    },
    {
      name: "Expert Solver",
      description: "Complete an expert puzzle without hints",
      earned: false,
    },
  ],
  nextChallengeLevel = "Advanced",
  nextChallengeDifficulty = 4.5,
}: ProgressDashboardProps) => {
  return (
    <div className="w-full h-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Progress Dashboard
            </h1>
            <p className="text-gray-500">
              Track your Sudoku journey and skill development
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            Back to Menu
            <ChevronRight size={16} />
          </Button>
        </div>

        {/* Player Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <Trophy className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium">Total Games</h3>
                <p className="text-3xl font-bold text-blue-600">{totalGames}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium">Win Rate</h3>
                <p className="text-3xl font-bold text-green-600">{winRate}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-medium">Avg. Difficulty</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {averageDifficulty}
                </p>
                <p className="text-sm text-gray-500">out of 10</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                  <Award className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-medium">Achievements</h3>
                <p className="text-3xl font-bold text-amber-600">
                  {achievements.filter((a) => a.earned).length}/
                  {achievements.length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Difficulty Chart */}
          <div className="lg:col-span-2">
            <DifficultyChart />
          </div>

          {/* Right Column - Technique Mastery */}
          <div>
            <TechniqueMastery />
          </div>
        </div>

        {/* Achievements Section */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${achievement.earned ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50 opacity-70"}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 p-2 rounded-full ${achievement.earned ? "bg-green-100" : "bg-gray-100"}`}
                    >
                      <Trophy
                        className={`h-5 w-5 ${achievement.earned ? "text-green-600" : "text-gray-400"}`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{achievement.name}</h3>
                        {achievement.earned && (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 border-green-200"
                          >
                            Earned
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {achievement.description}
                      </p>
                      {achievement.earned && achievement.date && (
                        <p className="text-xs text-gray-500 mt-2">
                          Earned on {achievement.date}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Challenge Section */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-xl font-bold">
                  Ready for your next challenge?
                </h3>
                <p className="opacity-90 mt-1">
                  We recommend trying a {nextChallengeLevel} puzzle (difficulty{" "}
                  {nextChallengeDifficulty}/10)
                </p>
              </div>
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                Start Challenge <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressDashboard;
