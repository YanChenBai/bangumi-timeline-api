import sharp from "sharp";
import { BangumiDB } from "./db";
import { resolve } from "path";
import fs from "node:fs/promises";
import { logger } from "./log";

const SUFFIX = "webp";
const CACHE_PATH = "./cache";

export function joinSuffix(name: string) {
  return [name, SUFFIX].join(".");
}

export function joinPath(name: string) {
  return resolve(__dirname, CACHE_PATH, name);
}

async function cehckCacheDir() {
  const path = resolve(__dirname, CACHE_PATH);
  const exists = await fs.exists(path);
  if (!exists) {
    await fs.mkdir(path);
  }
}

export function getCacheImgName(url: string) {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(url);
  return hasher.digest("hex");
}

export async function isCacheImg(url: string) {
  const imgName = getCacheImgName(url);
  const path = joinPath(joinSuffix(imgName));
  const exists = await Bun.file(path).exists();
  return exists;
}

async function cacheImg(url: string) {
  const isCache = await isCacheImg(url);
  if (isCache) return;

  const imgName = getCacheImgName(url);

  url = (url.includes("mikanani") ? "https://wsrv.nl/?url=" : "") + url;

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    },
  });

  if (!response.ok) throw new Error("fetch error");

  const buffer = await response.arrayBuffer();

  const path = joinPath(joinSuffix(imgName));
  return await sharp(buffer)
    .resize({
      width: 290,
      height: 290,
      fit: "cover",
      position: "centre",
    })
    .webp()
    .toFile(path);
}

export default async function start() {
  const date = new Date();
  const startTime = Date.now();
  logger.info("Start cache images");

  await cehckCacheDir();

  const db = new BangumiDB();

  const data = await db.all();

  for (const platform of data) {
    const timeline = platform.value;
    const allCount = timeline.reduce((a, b) => a + b.length, 0);
    let counter = 0;
    for (const day of timeline) {
      for (const bangumi of day) {
        try {
          counter++;
          await cacheImg(bangumi.cover);
        } catch (error) {
          logger.error(`Cache ${platform.key} image error..`);
          logger.error(error);
        }
      }
    }
    logger.info(`${platform.key} (${counter}/${allCount}) done..`);
  }

  logger.info("End cache images");
  logger.info(`Used time: ${(Date.now() - startTime).toFixed(2)}s`);
}
