'use server';
/**
 * @fileOverview A code generation flow using Genkit.
 *
 * - generateCode - A function that takes a prompt and returns generated code and a preview image.
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
  previewImageUrl: z.string().describe('A data URI for an image preview of the code.'),
});
export type GenerateCodeOutput = z.infer<typeof GenerateCodeOutputSchema>;

export async function generateCode(input: GenerateCodeInput): Promise<GenerateCodeOutput> {
  return generateCodeFlow(input);
}

const codeGenPrompt = ai.definePrompt({
    name: 'codeGenPrompt',
    input: {schema: GenerateCodeInputSchema},
    output: {schema: z.object({ code: z.string().describe('The generated code snippet.') })},
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
    // Generate code first
    const {output} = await codeGenPrompt(input);
    const code = output!.code;

    // Then, generate image preview from the code.
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `Generate a clean, modern UI image that visually represents the following React component. The image should look like a screenshot of the rendered component on a webpage. Make it look professional.

        Component Code:
        \`\`\`
        ${code}
        \`\`\`
        `,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    const previewImageUrl = media?.url;
    if (!previewImageUrl) {
      throw new Error("Failed to generate image preview.");
    }
    
    return {
        code,
        previewImageUrl,
    };
  }
);
