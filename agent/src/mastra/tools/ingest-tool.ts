import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { Link, UnifiedDocsSchema } from "../types/index";

export const ingestTool = createTool({
  id: "ingest-tool",
  description: "Get Unified docs from API and send to other tools.",
  // "Get input data, clean the data, tranform the data and return structured chunks.",
  inputSchema: UnifiedDocsSchema,
  outputSchema: UnifiedDocsSchema,
  // inputSchema: z.object({
    // msg: z.string(),
  // }),
  // outputSchema: z.string(),
  execute: async ({ context }) => {
    console.log({context});

    return context
  },
});

const getUnifiedDocs = async () => {
  return { msg: "" };
  // return {
  //   temperature: data.current.temperature_2m,
  //   feelsLike: data.current.apparent_temperature,
  //   humidity: data.current.relative_humidity_2m,
  //   windSpeed: data.current.wind_speed_10m,
  //   windGust: data.current.wind_gusts_10m,
  //   conditions: getWeatherCondition(data.current.weather_code),
  //   location: name,
  // };
};
