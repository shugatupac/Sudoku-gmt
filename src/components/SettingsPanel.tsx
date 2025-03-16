import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Moon,
  Sun,
  Palette,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  User,
  LogOut,
  Save,
} from "lucide-react";

interface SettingsPanelProps {
  onSave?: () => void;
  onLogout?: () => void;
  defaultTheme?: "light" | "dark" | "system";
  defaultDifficulty?: string;
  defaultShowMistakes?: boolean;
  defaultShowHints?: boolean;
  defaultSoundEnabled?: boolean;
}

const SettingsPanel = ({
  onSave = () => {},
  onLogout = () => {},
  defaultTheme = "system",
  defaultDifficulty = "adaptive",
  defaultShowMistakes = true,
  defaultShowHints = true,
  defaultSoundEnabled = true,
}: SettingsPanelProps) => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">(defaultTheme);
  const [difficulty, setDifficulty] = useState(defaultDifficulty);
  const [showMistakes, setShowMistakes] = useState(defaultShowMistakes);
  const [showHints, setShowHints] = useState(defaultShowHints);
  const [soundEnabled, setSoundEnabled] = useState(defaultSoundEnabled);

  const handleSave = () => {
    // In a real implementation, this would save settings to a database or local storage
    onSave();
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-background">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Settings</CardTitle>
          <CardDescription>Customize your Sudoku experience</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="visual" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8 w-full">
          <TabsTrigger value="visual">
            <Palette className="mr-2 h-4 w-4" />
            Visual
          </TabsTrigger>
          <TabsTrigger value="gameplay">
            <Eye className="mr-2 h-4 w-4" />
            Gameplay
          </TabsTrigger>
          <TabsTrigger value="account">
            <User className="mr-2 h-4 w-4" />
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visual Settings</CardTitle>
              <CardDescription>
                Customize the appearance of the game
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Theme</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred theme
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-4 w-4 mr-1" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-4 w-4 mr-1" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("system")}
                  >
                    System
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Sound Effects</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable game sounds
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Switch
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gameplay" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gameplay Settings</CardTitle>
              <CardDescription>Customize how the game behaves</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Difficulty Level</h3>
                  <p className="text-sm text-muted-foreground">
                    Set your preferred difficulty
                  </p>
                </div>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                    <SelectItem value="adaptive">AI Adaptive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Show Mistakes</h3>
                  <p className="text-sm text-muted-foreground">
                    Highlight incorrect entries
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {showMistakes ? (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Switch
                    checked={showMistakes}
                    onCheckedChange={setShowMistakes}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Show Hints</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable hint system
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {showHints ? (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Switch checked={showHints} onCheckedChange={setShowHints} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Profile Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Update your profile details
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Reset Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    Clear all your game progress
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Reset
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Log Out</h3>
                  <p className="text-sm text-muted-foreground">
                    Sign out of your account
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsPanel;
