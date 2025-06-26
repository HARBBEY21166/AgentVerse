'use server';
/**
 * @fileOverview A code generation flow using Genkit.
 *
 * - generateCode - A function that takes a prompt and returns generated code.
 * - GenerateCodeInput - The input type for the generateCode function.
 * - GenerateCodeOutput - The return type for the generateCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCodeInputSchema = z.object({
  prompt: z.string().describe('A prompt describing the code to be generated.'),
});
export type GenerateCodeInput = z.infer<typeof GenerateCodeInputSchema>;

const GenerateCodeOutputSchema = z.object({
  code: z.string().describe('The generated code snippet.'),
});
export type GenerateCodeOutput = z.infer<typeof GenerateCodeOutputSchema>;

export async function generateCode(input: GenerateCodeInput): Promise<GenerateCodeOutput> {
  return generateCodeFlow(input);
}

const codeGenPrompt = ai.definePrompt({
    name: 'codeGenPrompt',
    input: {schema: GenerateCodeInputSchema},
    output: {schema: GenerateCodeOutputSchema},
    prompt: `You are an expert code generator. Your task is to generate a high-quality code snippet based on the user's prompt.
    
    Please adhere to the following guidelines:
    1.  **Code Only**: Your output must be ONLY the raw code. Do not include any explanations, introductory phrases like "Here is the code:", or markdown fences like \`\`\`typescript.
    2.  **Completeness**: Generate a complete, functional, and self-contained code snippet unless the prompt specifies otherwise.
    3.  **Best Practices**: Follow modern coding best practices, style guides, and conventions for the requested language.

    User Prompt: {{{prompt}}}
    `,
});


const generateCodeFlow = ai.defineFlow(
  {
    name: 'generateCodeFlow',
    inputSchema: GenerateCodeInputSchema,
    outputSchema: GenerateCodeOutputSchema,
  },
  async (input) => {
    const {output} = await codeGenPrompt(input);
    return output!;
  }
);
