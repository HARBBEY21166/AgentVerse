'use server';
/**
 * @fileOverview A chat flow that uses Genkit to generate responses.
 *
 * - chat - A function that takes a message history and returns a response.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatInputSchema = z.object({
  history: z.array(MessageSchema),
  message: z.string(),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  message: z.string(),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const history = input.history.map(msg => ({
        role: msg.role,
        content: [{text: msg.content}],
    }));

    const systemPrompt = `You are a helpful AI assistant named AgentVerse.`;

    const response = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      history: history,
      prompt: input.message,
      system: systemPrompt,
    });

    return {
      message: response.text,
    };
  }
);
