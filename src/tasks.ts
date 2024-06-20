import { CronJob } from "cron";
import bangumiOrigin from "./bangumi";
import cacheImagesTask from "./cacheImgs";
import { BangumiDB } from "./db";
import { logger } from "./log";

const db = new BangumiDB();

async function runGetTimelineTask() {
  logger.info("Start get timeline..");

  const data = new Date();
  const startTime = data.getTime();

  for (const [key, task] of Object.entries(bangumiOrigin)) {
    try {
      const bangumi = await task.get();
      await db.set(key, task.name, bangumi);
      logger.info(`${key} done..`);
    } catch (error) {
      logger.error(`Get ${key} error..`);
      logger.error(error);
    }
  }

  const diff = Date.now() - startTime;
  logger.info("End get timeline");
  logger.info("Used time:", `${(diff / 1000).toFixed(2)}s`);
}

async function runTaks() {
  logger.info("---------- Get Timeline Task ----------");
  await runGetTimelineTask();
  logger.info("---------- Cache Images Task ----------");
  await cacheImagesTask();
}

const createJob = (cronTime: string) =>
  new CronJob(
    cronTime,
    runTaks,
    null, // onComplete
    true, // start
    "Asia/Shanghai" // timeZone
  );
function bootstrap() {
  const job_12_00 = createJob("0 0 12 * * *");
  const job_24_00 = createJob("0 0 0 * * *");
  job_12_00.fireOnTick();
}

bootstrap();
