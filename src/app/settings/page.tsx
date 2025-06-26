'use client';

import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const SETTINGS_KEY = 'agentSettings';

const DEFAULT_SETTINGS = {
  agentName: 'Marketing Maven',
  agentRole: 'creative-writer',
  agentInstructions:
    'Always respond in a witty and engaging tone. Prioritize content that is shareable on social media.',
  webBrowsing: true,
  dataAnalysis: true,
  codeExecution: false,
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Failed to parse settings from localStorage', error);
    }
    setIsLoaded(true);
  }, []);

  const handleSave = (section: 'Persona' | 'Capabilities') => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      toast({
        title: `${section} Saved`,
        description: `Your agent's ${section.toLowerCase()} has been updated.`,
      });
    } catch (error) {
      console.error('Failed to save settings to localStorage', error);
      toast({
        title: 'Error',
        description: 'Could not save settings.',
        variant: 'destructive',
      });
    }
  };

  const handleValueChange = (key: keyof typeof DEFAULT_SETTINGS, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };
  
  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex h-screen flex-col">
      <AppHeader title="Agent Customization" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Persona</CardTitle>
              <CardDescription>
                Define the personality and role of your AI agent.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agent-name">Agent Name</Label>
                <Input
                  id="agent-name"
                  placeholder="e.g., Marketing Maven"
                  value={settings.agentName}
                  onChange={(e) => handleValueChange('agentName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agent-role">Role</Label>
                <Select
                  value={settings.agentRole}
                  onValueChange={(value) => handleValueChange('agentRole', value)}
                >
                  <SelectTrigger id="agent-role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="research-analyst">
                      Research Analyst
                    </SelectItem>
                    <SelectItem value="creative-writer">
                      Creative Writer
                    </SelectItem>
                    <SelectItem value="code-generator">
                      Code Generator
                    </SelectItem>
                    <SelectItem value="project-manager">
                      Project Manager
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="agent-instructions">
                  Custom Instructions
                </Label>
                <Textarea
                  id="agent-instructions"
                  placeholder="e.g., 'Always respond in a formal tone. Prioritize data from academic sources.'"
                  value={settings.agentInstructions}
                  onChange={(e) =>
                    handleValueChange('agentInstructions', e.target.value)
                  }
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave('Persona')}>Save Persona</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Capabilities</CardTitle>
              <CardDescription>
                Enable or disable tools the agent can use.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="tool-web-browsing" className="text-base">
                    Web Browsing
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Allow the agent to search the internet for information.
                  </p>
                </div>
                <Switch
                  id="tool-web-browsing"
                  checked={settings.webBrowsing}
                  onCheckedChange={(checked) =>
                    handleValueChange('webBrowsing', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="tool-data-analysis" className="text-base">
                    Data Analysis
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Allow the agent to analyze data from uploaded files.
                  </p>
                </div>
                <Switch
                  id="tool-data-analysis"
                  checked={settings.dataAnalysis}
                  onCheckedChange={(checked) =>
                    handleValueChange('dataAnalysis', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="tool-code-execution" className="text-base">
                    Code Execution
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Allow the agent to write and execute code snippets.
                  </p>
                </div>
                <Switch
                  id="tool-code-execution"
                  checked={settings.codeExecution}
                  onCheckedChange={(checked) =>
                    handleValueChange('codeExecution', checked)
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave('Capabilities')}>
                Save Capabilities
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
