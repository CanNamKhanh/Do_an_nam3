import { env } from "./config/env";
import { prisma } from "./lib/prisma";
import { createApp } from "./app";

const server = createApp().listen(env.PORT, env.HOST, () => {
  console.log(`API chạy tại http://${env.HOST}:${env.PORT}/api`);
});

function shutdown(): void {
  server.close(() => {
    void prisma.$disconnect().finally(() => process.exit(0));
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
