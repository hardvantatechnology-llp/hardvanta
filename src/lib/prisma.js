// Prisma client singleton — avoids exhausting DB connections in dev (hot reload).
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

// Slow-query threshold for the diagnostic log below — deliberately not
// logging every query (that'd be noisy and adds overhead on every request);
// this is for spotting which query is actually eating the connection-pool
// wait time on a pgbouncer(connection_limit=N) setup, not routine tracing.
const SLOW_QUERY_MS = 300;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: [
      { emit: "event", level: "query" },
      { emit: "stdout", level: "error" },
    ],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (!globalForPrisma.prismaSlowQueryLoggerAttached) {
  prisma.$on("query", (e) => {
    if (e.duration >= SLOW_QUERY_MS) {
      console.warn(`[prisma:slow-query] ${e.duration}ms — ${e.query}`);
    }
  });
  globalForPrisma.prismaSlowQueryLoggerAttached = true;
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}