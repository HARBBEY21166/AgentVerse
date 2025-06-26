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
    output: {schema: z.object({ code: z.string().describe('The generated code snippet.') })},
    prompt: `You are an expert code generator specializing in creating self-contained React components using TypeScript, Tailwind CSS, and shadcn/ui.

Your task is to generate a single, functional, and self-contained JSX expression based on the user's prompt.

Please adhere to the following guidelines:
1.  **Code Only**: Your output MUST be ONLY the raw JSX code. Do not include any explanations, introductory phrases like "Here is the code:", or markdown fences like \`\`\`jsx.
2.  **Self-Contained**: The code must be a single component or expression that can be rendered directly. It should manage its own state if necessary using React hooks (e.g., useState).
3.  **Use Provided Components**: The execution environment has access to 'React', 'useState', 'useEffect' and all components from 'lucide-react'.
    The following shadcn/ui components are also available: Avatar, AvatarFallback, AvatarImage, Badge, Button, Calendar, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Checkbox, Input, Label, Popover, PopoverContent, PopoverTrigger, Progress, RadioGroup, RadioGroupItem, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Slider, Switch, Textarea.
4.  **No Imports**: Do not include any \`import\` or \`require\` statements.
5.  **Return a Function**: The final code should be an anonymous function that returns a JSX element. Example: \`() => <Button>Click Me</Button>\`.

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

    if (!output || !output.code) {
      throw new Error('The AI failed to generate a response in the expected format.');
    }
    
    const code = output.code;
    
    return {
        code,
    };
  }
);
