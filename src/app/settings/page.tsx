
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { AgentSettings, UserProfile } from '@/lib/settings';
import {
  SETTINGS_KEY,
  DEFAULT_SETTINGS,
  USER_PROFILE_KEY,
  DEFAULT_USER_PROFILE,
} from '@/lib/settings';

export default function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AgentSettings>(DEFAULT_SETTINGS);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
      }
      const savedProfile = localStorage.getItem(USER_PROFILE_KEY);
      if (savedProfile) {
        setProfile({ ...DEFAULT_USER_PROFILE, ...JSON.parse(savedProfile) });
      }
    } catch (error) {
      console.error('Failed to parse settings from localStorage', error);
    }
    setIsLoaded(true);
  }, []);

  const handleSaveAgent = () => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      toast({
        title: `Persona Saved`,
        description: `Your agent's persona has been updated.`,
      });
    } catch (error) {
      console.error('Failed to save agent settings to localStorage', error);
      toast({
        title: 'Error',
        description: 'Could not save agent settings.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveProfile = () => {
    try {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
      toast({
        title: 'Profile Saved',
        description: `Your name has been updated.`,
      });
      // Force a re-render of other components that might use this, like the sidebar
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Failed to save profile to localStorage', error);
      toast({
        title: 'Error',
        description: 'Could not save your profile.',
        variant: 'destructive',
      });
    }
  };

  const handleAgentValueChange = (key: keyof AgentSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleProfileValueChange = (key: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex h-screen flex-col">
      <AppHeader title="Customization" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>
                This information will be used to personalize your experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">Name</Label>
                <Input
                  id="user-name"
                  placeholder="Enter your name"
                  value={profile.name}
                  onChange={(e) =>
                    handleProfileValueChange('name', e.target.value)
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Save Profile</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agent Persona</CardTitle>
              <CardDescription>
                Define the personality and role of your AI agent. This will
                affect its responses in the chat.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agent-name">Agent Name</Label>
                <Input
                  id="agent-name"
                  placeholder="e.g., AgentVerse"
                  value={settings.agentName}
                  onChange={(e) =>
                    handleAgentValueChange('agentName', e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agent-role">Role</Label>
                <Select
                  value={settings.agentRole}
                  onValueChange={(value) =>
                    handleAgentValueChange('agentRole', value)
                  }
                >
                  <SelectTrigger id="agent-role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="helpful-assistant">
                      Helpful Assistant
                    </SelectItem>
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
                    handleAgentValueChange('agentInstructions', e.target.value)
                  }
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveAgent}>Save Persona</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
