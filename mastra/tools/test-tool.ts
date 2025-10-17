import { createTool } from "@mastra/core/tools";
import z from "zod";

export const testTool = createTool({
  id: "test tool",
  description: "generate random number for the joke agent",
  // inputSchema: z.object({
  //   location: z.string()
  // }),
  // outputSchema: z.object({
  //   weather: z.string()
  // }),
  execute: async ({ context }) => {
    // const { location } = context;

    // const response = await fetch(`https://wttr.in/${location}?format=3`);
    // const weather = await response.text();

    return { randomNumber: 4 };
  },
});
