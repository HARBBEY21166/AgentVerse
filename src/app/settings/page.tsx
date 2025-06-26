'use client';

import { useState } from 'react';
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

export default function SettingsPage() {
  const { toast } = useToast();
  const [agentName, setAgentName] = useState('Marketing Maven');
  const [agentRole, setAgentRole] = useState('creative-writer');
  const [agentInstructions, setAgentInstructions] = useState(
    'Always respond in a witty and engaging tone. Prioritize content that is shareable on social media.'
  );

  const [webBrowsing, setWebBrowsing] = useState(true);
  const [dataAnalysis, setDataAnalysis] = useState(true);
  const [codeExecution, setCodeExecution] = useState(false);

  const handleSavePersona = () => {
    toast({
      title: 'Persona Saved',
      description: 'Your agent persona has been updated.',
    });
  };

  const handleSaveCapabilities = () => {
    toast({
      title: 'Capabilities Saved',
      description: "Your agent's capabilities have been updated.",
    });
  };

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
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agent-role">Role</Label>
                <Select value={agentRole} onValueChange={setAgentRole}>
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
                  value={agentInstructions}
                  onChange={(e) => setAgentInstructions(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePersona}>Save Persona</Button>
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
                  checked={webBrowsing}
                  onCheckedChange={setWebBrowsing}
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
                  checked={dataAnalysis}
                  onCheckedChange={setDataAnalysis}
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
                  checked={codeExecution}
                  onCheckedChange={setCodeExecution}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveCapabilities}>
                Save Capabilities
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
