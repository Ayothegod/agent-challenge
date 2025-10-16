import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const greetingTool = createTool({
  id: "greet-visitors",
  description: "Greet every new visitor that visits this tool.",
  // inputSchema: z.object({
  //   location: z.string().describe('City name'),
  // }),
  // outputSchema: WeatherToolResultSchema,
  execute: async ({ context }) => {
    return { msg: "Welcome to the swarm OS hub" };
  },
});
