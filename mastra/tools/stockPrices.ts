import { createTool } from "@mastra/core/tools";
import z from "zod";

const getStockPrice = async (symbol: string) => {
  const data: any = await fetch(
    `https://mastra-stock-data.vercel.app/api/stock-data?symbol=${symbol}`
  ).then((r) => r.json());

  return data.prices["4. close"];
};

export const stockPrices = createTool({
  id: "Get stock prices",
  inputSchema: z.object({
    symbol: z.string(),
  }),
  description: "Fetch the last days closing stock price for a given symbol",
  execute: async ({ context }) => {
    const { symbol } = context;
    console.log("Using tool  to fetch stock price for: ", symbol);

    return { symbol, currentPrice: await getStockPrice(symbol) };
  },
});
