import { CronJob } from "cron";
import { tencent, bilibili, mikanani, tl5dm } from "./bangumi";
import cacheStart from "./cacheImgs";
import { BangumiDB } from "./db";

const db = new BangumiDB();

const tasks = {
  tencent,
  bilibili,
  mikanani,
  tl5dm,
};

async function runTasks() {
  console.log("start get timeline..");

  const data = new Date();
  const startTime = data.getTime();

  console.log("start time:", data);

  for (const [key, task] of Object.entries(tasks)) {
    try {
      const bangumi = await task.get();
      await db.set(key, task.name, bangumi);
      console.log(`${key} done..`);
    } catch (error) {
      console.error(`${key} erro..`);
      console.error(error);
    }
  }

  const diff = Date.now() - startTime;
  console.log("used time:", `${(diff / 1000).toFixed(2)}s`);
  console.log("end time:", new Date());
}

function bootstrap() {
  const job = new CronJob(
    "0 0 */12 * * *",
    async function () {
      await runTasks();
      console.log("------------------------------------");
      await cacheStart();
      console.log("------------------------------------");
    }, // onTick
    null, // onComplete
    true, // start
    "Asia/Shanghai" // timeZone
  );
  job.fireOnTick();
}

bootstrap();
