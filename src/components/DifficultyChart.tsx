import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DifficultyChartProps {
  data?: {
    date: string;
    difficulty: number;
    completionTime: number;
    mistakes: number;
  }[];
  title?: string;
  description?: string;
}

const DifficultyChart = ({
  data = [
    { date: "2023-01-01", difficulty: 1, completionTime: 300, mistakes: 5 },
    { date: "2023-01-08", difficulty: 1.5, completionTime: 280, mistakes: 4 },
    { date: "2023-01-15", difficulty: 2, completionTime: 320, mistakes: 3 },
    { date: "2023-01-22", difficulty: 2.5, completionTime: 300, mistakes: 2 },
    { date: "2023-01-29", difficulty: 3, completionTime: 350, mistakes: 3 },
    { date: "2023-02-05", difficulty: 3.5, completionTime: 330, mistakes: 2 },
    { date: "2023-02-12", difficulty: 4, completionTime: 360, mistakes: 1 },
    { date: "2023-02-19", difficulty: 4.5, completionTime: 340, mistakes: 1 },
    { date: "2023-02-26", difficulty: 5, completionTime: 380, mistakes: 0 },
  ],
  title = "Difficulty Progression",
  description = "Track your Sudoku skill improvement over time",
}: DifficultyChartProps) => {
  return (
    <Card className="w-full h-full bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <p className="text-sm text-gray-500">{description}</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="difficulty" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="difficulty">Difficulty</TabsTrigger>
            <TabsTrigger value="time">Completion Time</TabsTrigger>
            <TabsTrigger value="mistakes">Mistakes</TabsTrigger>
          </TabsList>

          <TabsContent value="difficulty" className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="difficulty"
                  stroke="#8884d8"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>
                Your difficulty level has increased from 1 to 5 over the past 2
                months!
              </p>
              <p className="mt-1 font-medium text-green-600">
                You're making excellent progress!
              </p>
            </div>
          </TabsContent>

          <TabsContent value="time" className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completionTime"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>
                Your completion times are stable even as difficulty increases!
              </p>
              <p className="mt-1 font-medium text-blue-600">
                This shows your improving efficiency.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="mistakes" className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="mistakes"
                  stroke="#ff8042"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Your mistakes have decreased from 5 to 0 over time!</p>
              <p className="mt-1 font-medium text-purple-600">
                Your accuracy is improving significantly.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-3 bg-gray-50 rounded-md">
          <h4 className="font-medium text-sm mb-2">Milestones</h4>
          <div className="flex justify-between text-xs text-gray-600">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mb-1"></div>
              <span>Beginner</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mb-1"></div>
              <span>Intermediate</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mb-1"></div>
              <span>Advanced</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mb-1"></div>
              <span>Expert</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mb-1"></div>
              <span>Master</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DifficultyChart;
