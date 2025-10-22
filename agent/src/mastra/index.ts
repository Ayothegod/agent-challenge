import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
import { orchestratorAgent } from "./agents/orchestrator";
import { apiRoutes } from "./server/routes";

export const mastra = new Mastra({
  agents: { orchestratorAgent },
  // storage: new LibSQLStore({url: ":memory:"}),
  storage: new LibSQLStore({ url: "file:../mastra.db" }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  observability: {
    // Enables DefaultExporter and CloudExporter for AI tracing
    default: { enabled: true },
  },
  server: {
    build: { swaggerUI: true }, // /swagger-ui
    apiRoutes,
  },
});
