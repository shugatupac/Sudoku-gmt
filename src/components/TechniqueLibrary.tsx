import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import {
  Search,
  BookOpen,
  Play,
  ArrowRight,
  Star,
  ChevronRight,
} from "lucide-react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";

interface TechniqueProps {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  category: string;
  videoUrl?: string;
  examples?: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}

const TechniqueLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data for techniques
  const techniques: TechniqueProps[] = [
    {
      title: "Naked Singles",
      description:
        "When a cell has only one possible value, that value must be placed in that cell.",
      difficulty: "beginner",
      category: "basic",
      videoUrl: "#",
      examples: [
        {
          id: "ns1",
          title: "Simple Naked Single",
          description:
            "A cell with 8 eliminated candidates has only one possible value.",
        },
        {
          id: "ns2",
          title: "Naked Single in Box",
          description: "Finding a naked single by analyzing a 3x3 box.",
        },
      ],
    },
    {
      title: "Hidden Singles",
      description:
        "When a value can only go in one cell within a unit (row, column, or box), that value must be placed in that cell.",
      difficulty: "beginner",
      category: "basic",
      videoUrl: "#",
      examples: [
        {
          id: "hs1",
          title: "Hidden Single in Row",
          description: "Finding a hidden single by analyzing a row.",
        },
      ],
    },
    {
      title: "Pointing Pairs",
      description:
        "When a value in a box can only be placed in cells that share a row or column, that value can be eliminated from other cells in that row or column.",
      difficulty: "intermediate",
      category: "intermediate",
      videoUrl: "#",
    },
    {
      title: "X-Wing",
      description:
        "When a value appears in exactly two cells in each of two different rows, and these cells are aligned in the same columns, that value can be eliminated from other cells in those columns.",
      difficulty: "advanced",
      category: "advanced",
      videoUrl: "#",
    },
    {
      title: "Swordfish",
      description:
        "An extension of X-Wing involving three rows and three columns.",
      difficulty: "expert",
      category: "advanced",
      videoUrl: "#",
    },
  ];

  const filteredTechniques = techniques.filter((technique) => {
    const matchesSearch =
      technique.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      technique.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || technique.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const difficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-blue-100 text-blue-800";
      case "advanced":
        return "bg-orange-100 text-orange-800";
      case "expert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white min-h-screen">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Sudoku Technique Library</h1>
          <p className="text-gray-600">
            Learn and master various Sudoku solving techniques to improve your
            skills
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-1/2">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search techniques..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs
            defaultValue="all"
            className="w-full md:w-1/2"
            onValueChange={setSelectedCategory}
          >
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTechniques.map((technique, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{technique.title}</CardTitle>
                  <Badge className={`${difficultyColor(technique.difficulty)}`}>
                    {technique.difficulty.charAt(0).toUpperCase() +
                      technique.difficulty.slice(1)}
                  </Badge>
                </div>
                <CardDescription className="mt-2">
                  {technique.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <BookOpen size={16} />
                        <span>Learn</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Play size={16} />
                        <span>Watch</span>
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <span>Practice</span>
                      <ArrowRight size={16} />
                    </Button>
                  </div>

                  {technique.examples && technique.examples.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-2">Examples:</p>
                      <div className="space-y-2">
                        {technique.examples.map((example) => (
                          <div
                            key={example.id}
                            className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded-md"
                          >
                            <ChevronRight size={14} className="text-gray-400" />
                            <div>
                              <p className="font-medium">{example.title}</p>
                              <p className="text-gray-600 text-xs">
                                {example.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="text-yellow-500" size={20} />
              <span>Your Technique Mastery</span>
            </CardTitle>
            <CardDescription>
              Track your progress with different solving techniques
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Naked Singles</span>
                  <span className="text-sm text-gray-500">95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Hidden Singles</span>
                  <span className="text-sm text-gray-500">80%</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Pointing Pairs</span>
                  <span className="text-sm text-gray-500">60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">X-Wing</span>
                  <span className="text-sm text-gray-500">25%</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Overall Technique Mastery
                </span>
                <span className="text-sm font-medium">65%</span>
              </div>
              <Progress value={65} className="h-3 bg-gray-100" />

              <div className="flex justify-end mt-4">
                <Button className="flex items-center gap-1">
                  <span>View Detailed Progress</span>
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechniqueLibrary;
