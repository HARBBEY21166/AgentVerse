# AgentVerse

## Description

AgentVerse is a Next.js application built within Firebase Studio. It leverages various technologies and libraries to provide a rich user experience, including:

- **Next.js:** A React framework for server-side rendering and static site generation.
- **Tailwind CSS:** A utility-first CSS framework for rapid styling.
- **shadcn/ui:** A collection of reusable UI components.
- **Genkit:** A framework for building AI applications, used here for defining different AI flows.
- **Firebase:** A platform for building web and mobile applications, potentially used for backend services or hosting.

## Getting Started

To get started with AgentVerse, explore the following key files and directories:

- `/src/app/page.tsx`: The main application page.
- `/src/ai/genkit.ts`: The main configuration file for Genkit.
- `/src/ai/flows`: Contains AI flow definitions (e.g., chat, code generation, TTS).
- `/src/components/ui`: Reusable UI components from shadcn/ui.

## Available Scripts

In the project directory, you can run the following scripts:

- `npm run dev`: Starts the development server for the Next.js application on port 9002.
- `npm run genkit:dev`: Starts the Genkit development server using `tsx` to run the `/src/ai/dev.ts` file.
- `npm run genkit:watch`: Starts the Genkit development server with file watching, automatically restarting on changes in `/src/ai/dev.ts`.
- `npm run build`: Builds the Next.js application for production.
- `npm run start`: Starts the production Next.js server.
- `npm run lint`: Runs ESLint to check for code errors and stylistic issues.
- `npm run typecheck`: Runs the TypeScript compiler to check for type errors without emitting output.
- `npm run postinstall`: Runs `patch-package` after dependencies are installed, applying any patches in the `patches` directory.

## Dependencies

The project uses a variety of dependencies, including:

- `@genkit-ai/googleai`: Google AI plugin for Genkit.
- `@genkit-ai/next`: Next.js integration for Genkit.
- `@hookform/resolvers`: Resolvers for React Hook Form.
- `@radix-ui/*`: Various Radix UI components used by shadcn/ui.
- `class-variance-authority`: Helps with creating component variants.
- `clsx`: A utility for constructing `className` strings.
- `date-fns`: A modern JavaScript date utility library.
- `dotenv`: Loads environment variables from a `.env` file.
- `embla-carousel-react`: A carousel library for React.
- `firebase`: The Firebase JavaScript SDK.
- `genkit`: The core Genkit framework.
- `lucide-react`: A collection of beautiful open-source icons.
- `next`: The Next.js framework.
- `patch-package`: A tool to modify installed node modules.
- `prism-react-renderer`: Renders code blocks with syntax highlighting.
- `react`, `react-dom`: The core React libraries.
- `react-day-picker`: A flexible date picker component.
- `react-hook-form`: A library for form management in React.
- `react-live`: A flexible playground for live editing React code.
- `recharts`: A composable charting library built with React and D3.
- `tailwind-merge`: Merges Tailwind CSS classes without style conflicts.
- `tailwindcss-animate`: Adds animatable utilities to Tailwind CSS.
- `wav`: A library for working with WAV audio files.
- `zod`: A TypeScript-first schema declaration and validation library.

## Styling

This project uses Tailwind CSS for styling. The main configuration file is located at `/tailwind.config.ts`. The color palette and other theme customizations can be found within this file.

## UI Components

Reusable UI components are built using `shadcn/ui`. These components are located in the `/src/components/ui` directory.

## AI Flows

The application leverages Genkit for defining various AI flows. These flows are located in the `/src/ai/flows` directory and include:

- `/src/ai/flows/chat.ts`: Defines the chat completion flow.
- `/src/ai/flows/generate-code.ts`: Defines the code generation flow.
- `/src/ai/flows/tts.ts`: Defines the text-to-speech flow.

## Chat Feature

The main chat interface is implemented in `/src/app/chat/[conversationId]/page.tsx`. This component is responsible for displaying the conversation history. It differentiates between user and assistant messages and uses `prism-react-renderer` to format code blocks within messages for improved readability.
