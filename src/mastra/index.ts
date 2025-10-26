import { Mastra } from "@mastra/core/mastra";
import { weatherAgent } from "./agents/weather-agents";
 
export const mastra = new Mastra({
  agents: { weatherAgent }
});