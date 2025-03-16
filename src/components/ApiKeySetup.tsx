import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Key } from "lucide-react";

interface ApiKeySetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveApiKey: (apiKey: string) => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({
  open,
  onOpenChange,
  onSaveApiKey,
}) => {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError("Please enter a valid API key");
      return;
    }

    // Basic validation - Gemini API keys are typically longer than 20 characters
    if (apiKey.length < 20) {
      setError("This doesn't look like a valid Gemini API key");
      return;
    }

    onSaveApiKey(apiKey);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-blue-500" />
          Gemini API Setup
        </DialogTitle>
        <DialogDescription>
          To use AI features, you need to provide a Google Gemini API key.
        </DialogDescription>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Gemini API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your Gemini API key"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError(null);
              }}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <div className="text-sm text-gray-500">
            <p>
              You can get a Gemini API key from the{" "}
              <a
                href="https://ai.google.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Google AI Studio
              </a>
              .
            </p>
            <p className="mt-2">
              Your API key is stored locally in your browser and is never sent
              to our servers.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save API Key</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeySetup;
