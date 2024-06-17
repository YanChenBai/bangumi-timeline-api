import { CronJob } from "cron";
import { tencent, bilibili, mikanani, tl5dm } from "./bangumi";
import { BangumiDB } from "./db";

const db = new BangumiDB();

const tasks = {
  tencent,
  bilibili,
  mikanani,
  tl5dm,
};

async function runTasks() {
  const data = new Date();
  const startTime = data.getTime();

  console.log("starttime:", data);

  for (const [key, task] of Object.entries(tasks)) {
    try {
      const bangumi = await task();
      await db.set(key, bangumi);
      console.log(`${key} done..`);
    } catch (error) {
      console.error(`${key} erro..`);
      console.error(error);
    }
  }

  const diff = Date.now() - startTime;
  console.log("使用时间:", `${(diff / 1000).toFixed(2)}s`);
  console.log("endtime:", new Date());
}

function bootstrap() {
  const job = new CronJob(
    "0 0 */12 * * *",
    function () {
      runTasks();
    }, // onTick
    null, // onComplete
    true, // start
    "Asia/Shanghai" // timeZone
  );
  job.fireOnTick();
}

bootstrap();
