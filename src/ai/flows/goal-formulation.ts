// Goal formulation flow to create a detailed plan with actionable steps from a high-level objective.
'use server';
/**
 * @fileOverview Goal formulation AI agent.
 *
 * - formulatePlan - A function that formulates a detailed plan from a high-level objective.
 * - FormulatePlanInput - The input type for the formulatePlan function.
 * - FormulatePlanOutput - The return type for the formulatePlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FormulatePlanInputSchema = z.object({
  objective: z
    .string()
    .describe('The high-level objective or task for the AI agent.'),
});
export type FormulatePlanInput = z.infer<typeof FormulatePlanInputSchema>;

const FormulatePlanOutputSchema = z.object({
  plan: z
    .string()
    .describe(
      'A detailed plan with actionable steps to achieve the objective.'
    ),
});
export type FormulatePlanOutput = z.infer<typeof FormulatePlanOutputSchema>;

export async function formulatePlan(input: FormulatePlanInput): Promise<FormulatePlanOutput> {
  return formulatePlanFlow(input);
}

const formulatePlanPrompt = ai.definePrompt({
  name: 'formulatePlanPrompt',
  input: {schema: FormulatePlanInputSchema},
  output: {schema: FormulatePlanOutputSchema},
  prompt: `You are an AI agent tasked with creating detailed plans to achieve user objectives.

  Objective: {{{objective}}}

  Formulate a comprehensive plan, breaking down the objective into smaller, actionable steps. Return a well-structured plan that can be easily executed.`,
});

const formulatePlanFlow = ai.defineFlow(
  {
    name: 'formulatePlanFlow',
    inputSchema: FormulatePlanInputSchema,
    outputSchema: FormulatePlanOutputSchema,
  },
  async input => {
    const {output} = await formulatePlanPrompt(input);
    return output!;
  }
);
