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
    output: {schema: GenerateCodeOutputSchema },
    prompt: `You are an expert code generator. Your task is to generate a single, self-contained code snippet based on the user's prompt. You can generate either a React component or a complete HTML file with embedded CSS and JavaScript.

Determine the user's intent from the prompt:
- If the prompt asks for a React component, or mentions React, JSX, or shadcn/ui, generate a self-contained JSX expression.
- If the prompt asks for vanilla HTML, CSS, and/or JavaScript, generate a complete, single HTML file with embedded <style> and <script> tags.

**JSON Output Format**
Your output MUST be a valid JSON object with a single key "code". The value of this key should be a string containing the generated code. Do not include any explanations or markdown fences like \`\`\`json.

**React Component Guidelines:**
1.  **Self-Contained**: The code must be a single component or expression that can be rendered directly. It should manage its own state if necessary using React hooks (e.g., useState).
2.  **Use Provided Components**: The execution environment has access to 'React', 'useState', 'useEffect' and all components from 'lucide-react'.
    The following shadcn/ui components are also available: Avatar, AvatarFallback, AvatarImage, Badge, Button, Calendar, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Checkbox, Input, Label, Popover, PopoverContent, PopoverTrigger, Progress, RadioGroup, RadioGroupItem, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Slider, Switch, Textarea.
3.  **No Imports**: Do not include any \`import\` or \`require\` statements.
4.  **Return a Function**: The final code should be an anonymous function that returns a JSX element. Example: \`() => <Button>Click Me</Button>\`.

**HTML/CSS/JS Guidelines:**
1.  **Single File**: All HTML, CSS, and JavaScript must be in a single HTML file. CSS should be inside a <style> tag in the <head>, and JavaScript should be inside a <script> tag at the end of the <body>. The HTML should start with \`<!DOCTYPE html>\`.
2.  **No External Files**: Do not link to external CSS or JavaScript files.

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
    // Generate code
    const {output} = await codeGenPrompt(input);

    if (!output) {
      throw new Error('The AI failed to generate a response in the expected format.');
    }
    
    return output;
  }
);
