'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { formulatePlan } from '@/ai/flows/goal-formulation';
import { taskExecutionFeedback } from '@/ai/flows/task-execution-feedback';
import type { Task, TaskStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AppHeader } from '@/components/app-header';
import {
  Bot,
  CircleDashed,
  Loader,
  CheckCircle2,
  XCircle,
  Play,
  BrainCircuit,
  Lightbulb,
} from 'lucide-react';

const TaskStatusIcon = ({ status }: { status: TaskStatus }) => {
  switch (status) {
    case 'pending':
      return <CircleDashed className="text-muted-foreground" />;
    case 'running':
      return <Loader className="animate-spin text-primary" />;
    case 'completed':
      return <CheckCircle2 className="text-green-500" />;
    case 'error':
      return <XCircle className="text-destructive" />;
    default:
      return <CircleDashed className="text-muted-foreground" />;
  }
};

const TaskCard = ({
  task,
  onFeedbackSubmit,
}: {
  task: Task;
  onFeedbackSubmit: (taskId: string, feedback: string, refinedApproach: string) => void;
}) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const { toast } = useToast();

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast({
        title: 'Feedback Required',
        description: 'Please enter your feedback before submitting.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmittingFeedback(true);
    try {
      const result = await taskExecutionFeedback({
        taskId: task.id,
        taskDescription: task.description,
        completionResult: task.result || 'No result generated.',
        feedback,
      });
      onFeedbackSubmit(task.id, feedback, result.refinedApproach);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
        <TaskStatusIcon status={task.status} />
        <div className="flex-1">
          <CardTitle className="text-base font-medium">{task.description}</CardTitle>
        </div>
        <Badge variant={task.status === 'completed' ? 'secondary' : 'outline'} className="capitalize">
          {task.status}
        </Badge>
      </CardHeader>
      {task.status === 'completed' && (
        <CardContent className="space-y-4 pl-14">
          <div>
            <h4 className="font-semibold text-sm mb-1 text-muted-foreground">Execution Result</h4>
            <p className="text-sm p-3 bg-muted/50 rounded-md">{task.result}</p>
          </div>
          {task.refinedApproach ? (
            <div>
              <h4 className="font-semibold text-sm mb-1 text-muted-foreground flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Refined Approach
              </h4>
              <p className="text-sm p-3 bg-accent/20 border border-accent/50 rounded-md">
                {task.refinedApproach}
              </p>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-2">
              <Label htmlFor={`feedback-${task.id}`} className="font-semibold text-sm text-muted-foreground">
                Provide Feedback to Refine Agent
              </Label>
              <Textarea
                id={`feedback-${task.id}`}
                placeholder="e.g., 'Try using a different library for data analysis.'"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                disabled={isSubmittingFeedback}
              />
              <Button type="submit" size="sm" disabled={isSubmittingFeedback}>
                {isSubmittingFeedback && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Submit Feedback
              </Button>
            </form>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default function AgentVersePage() {
  const [objective, setObjective] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!objective.trim()) {
      toast({ title: 'Objective is empty', description: 'Please enter a goal for the agent.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setTasks([]);
    try {
      const result = await formulatePlan({ objective });
      const taskDescriptions = result.plan.split('\n').filter(line => line.trim().startsWith('- ')).map(line => line.substring(2).trim());
      
      if (taskDescriptions.length === 0) {
        toast({ title: 'No tasks generated', description: 'The AI could not formulate a plan. Try rephrasing your objective.', variant: 'destructive' });
        setTasks([]);
      } else {
        setTasks(
          taskDescriptions.map((desc, index) => ({
            id: `task-${Date.now()}-${index}`,
            description: desc,
            status: 'pending',
          }))
        );
      }

    } catch (error) {
      console.error('Error formulating plan:', error);
      toast({ title: 'Error', description: 'Failed to formulate a plan. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecute = () => {
    setIsExecuting(true);
    setCurrentTaskIndex(0);
  };
  
  const handleFeedbackSubmit = useCallback((taskId: string, feedback: string, refinedApproach: string) => {
      setTasks(currentTasks => currentTasks.map(t => 
        t.id === taskId ? { ...t, feedback, refinedApproach } : t
      ));
      toast({ title: "Feedback Received", description: "The agent's approach has been updated." });
  }, [toast]);


  useEffect(() => {
    if (isExecuting && currentTaskIndex !== null && currentTaskIndex < tasks.length) {
      setTasks(currentTasks =>
        currentTasks.map((task, index) =>
          index === currentTaskIndex ? { ...task, status: 'running' } : task
        )
      );

      const timeoutId = setTimeout(() => {
        setTasks(currentTasks =>
          currentTasks.map((task, index) =>
            index === currentTaskIndex
              ? {
                  ...task,
                  status: 'completed',
                  result: `Successfully completed: '${task.description}'. A mock report has been generated.`,
                }
              : task
          )
        );

        if (currentTaskIndex + 1 < tasks.length) {
          setCurrentTaskIndex(currentTaskIndex + 1);
        } else {
          setIsExecuting(false);
          setCurrentTaskIndex(null);
          toast({ title: 'Execution Complete', description: 'All tasks have been successfully executed.' });
        }
      }, 2000 + Math.random() * 1500); // Simulate work

      return () => clearTimeout(timeoutId);
    }
  }, [isExecuting, currentTaskIndex, tasks.length, toast]);

  return (
    <div className="flex h-screen flex-col">
      <AppHeader title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BrainCircuit className="h-6 w-6 text-primary" />
                Define Your Agent's Goal
              </CardTitle>
              <CardDescription>
                Enter a high-level objective and our AI agent will create and execute a plan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGoalSubmit} className="flex gap-2">
                <Input
                  placeholder="e.g., 'Analyze market trends for AI startups in Europe'"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  disabled={isLoading || isExecuting}
                  className="text-base"
                />
                <Button type="submit" disabled={isLoading || isExecuting}>
                  {isLoading ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Bot className="mr-2 h-4 w-4" />
                  )}
                  Formulate Plan
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {(isLoading || tasks.length > 0) && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Execution Plan</CardTitle>
                  <CardDescription>The agent will follow these steps to achieve the objective.</CardDescription>
                </div>
                {tasks.length > 0 && !isExecuting && (
                  <Button onClick={handleExecute} disabled={currentTaskIndex !== null}>
                    <Play className="mr-2 h-4 w-4" />
                    Execute Plan
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </>
                  ) : (
                    tasks.map((task) => <TaskCard key={task.id} task={task} onFeedbackSubmit={handleFeedbackSubmit} />)
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
