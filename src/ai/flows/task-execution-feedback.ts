'use server';

/**
 * @fileOverview AI agent task execution feedback flow.
 *
 * - taskExecutionFeedback - A function that handles the task execution feedback process.
 * - TaskExecutionFeedbackInput - The input type for the taskExecutionFeedback function.
 * - TaskExecutionFeedbackOutput - The return type for the taskExecutionFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TaskExecutionFeedbackInputSchema = z.object({
  taskId: z.string().describe('The ID of the task being reviewed.'),
  taskDescription: z.string().describe('A description of the task that was executed.'),
  completionResult: z.string().describe('The result of the task execution.'),
  feedback: z.string().describe('Feedback provided by the user on the task execution.'),
});
export type TaskExecutionFeedbackInput = z.infer<typeof TaskExecutionFeedbackInputSchema>;

const TaskExecutionFeedbackOutputSchema = z.object({
  refinedApproach: z.string().describe('The refined approach for subsequent task executions.'),
});
export type TaskExecutionFeedbackOutput = z.infer<typeof TaskExecutionFeedbackOutputSchema>;

export async function taskExecutionFeedback(input: TaskExecutionFeedbackInput): Promise<TaskExecutionFeedbackOutput> {
  return taskExecutionFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'taskExecutionFeedbackPrompt',
  input: {schema: TaskExecutionFeedbackInputSchema},
  output: {schema: TaskExecutionFeedbackOutputSchema},
  prompt: `You are an AI agent that refines its approach to task execution based on user feedback.

  Task ID: {{{taskId}}}
  Task Description: {{{taskDescription}}}
  Completion Result: {{{completionResult}}}
  Feedback: {{{feedback}}}

  Based on the user feedback, refine your approach for subsequent task executions.  What lessons did you learn, and what will you do differently next time?`,
});

const taskExecutionFeedbackFlow = ai.defineFlow(
  {
    name: 'taskExecutionFeedbackFlow',
    inputSchema: TaskExecutionFeedbackInputSchema,
    outputSchema: TaskExecutionFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
