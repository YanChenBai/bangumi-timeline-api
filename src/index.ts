import { CronJob } from "cron";
import { tencent, bilibili, mikanani, tl5dm } from "./bangumi";
import { BangumiDB } from "./db";

const db = new BangumiDB();

async function bootstrap() {
  const server = Bun.serve({
    fetch: async () => {
      const data = await db.all();
      return new Response(JSON.stringify(data));
    },
    port: 3000,
  });

  console.log(
    `Listening on http://localhost:${server.port}, start time ${new Date()}`
  );
}

await bootstrap();
