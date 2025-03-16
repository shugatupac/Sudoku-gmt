import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface TechniqueData {
  name: string;
  mastery: number;
  usageCount: number;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
}

interface TechniqueMasteryProps {
  techniques?: TechniqueData[];
  title?: string;
}

const TechniqueMastery = ({
  techniques = [
    {
      name: "Naked Singles",
      mastery: 85,
      usageCount: 127,
      description: "Finding cells with only one possible value",
      difficulty: "beginner",
    },
    {
      name: "Hidden Singles",
      mastery: 72,
      usageCount: 93,
      description: "Finding values that can only go in one cell within a unit",
      difficulty: "beginner",
    },
    {
      name: "Naked Pairs",
      mastery: 58,
      usageCount: 64,
      description: "Two cells in a unit restricted to the same two candidates",
      difficulty: "intermediate",
    },
    {
      name: "X-Wing",
      mastery: 32,
      usageCount: 28,
      description:
        "Pattern where a candidate appears in exactly two cells in two different rows/columns",
      difficulty: "advanced",
    },
    {
      name: "Swordfish",
      mastery: 15,
      usageCount: 12,
      description: "Extension of X-Wing pattern across three rows/columns",
      difficulty: "expert",
    },
  ],
  title = "Technique Mastery",
}: TechniqueMasteryProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-blue-100 text-blue-800";
      case "advanced":
        return "bg-purple-100 text-purple-800";
      case "expert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return "bg-green-500";
    if (mastery >= 60) return "bg-blue-500";
    if (mastery >= 40) return "bg-yellow-500";
    if (mastery >= 20) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {techniques.map((technique, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{technique.name}</span>
                  <Badge className={getDifficultyColor(technique.difficulty)}>
                    {technique.difficulty}
                  </Badge>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-sm text-gray-500 cursor-help">
                        Used {technique.usageCount} times
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{technique.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2">
                <Progress
                  value={technique.mastery}
                  className={`h-2 ${getMasteryColor(technique.mastery)}`}
                />
                <span className="text-sm font-medium">
                  {technique.mastery}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TechniqueMastery;
