import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import { performance } from "perf_hooks";
import * as util from "util";

const libsql = createClient({
  url: "file:./replica.db",
  syncUrl: `${process.env.TURSO_DATABASE_URL}`,
  authToken: `${process.env.TURSO_AUTH_TOKEN}`,
});

const adapter = new PrismaLibSQL({
  url: `${process.env.TURSO_DATABASE_URL}`,
  authToken: `${process.env.TURSO_AUTH_TOKEN}`,
});

const prismaClientSingle = () => {
  libsql.sync();
  return new PrismaClient({ adapter }).$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, model, args, query }) {
          const start = performance.now();
          const result = await query(args);
          const end = performance.now();
          const time = end - start;
          console.log(
            util.inspect(
              { model, operation, time, args },
              { showHidden: false, depth: null, colors: true }
            )
          );

          if (["create", "update", "delete"].includes(operation)) {
            await libsql.sync();
          }

          return result;
        },
      },
    },
  });
};

type PrismaClientSingle = ReturnType<typeof prismaClientSingle>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingle | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingle();

export default prisma;
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
