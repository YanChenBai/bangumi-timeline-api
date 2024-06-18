import sharp from "sharp";
import { BangumiDB } from "./db";
import { resolve } from "path";
import fs from "node:fs/promises";

const SUFFIX = "webp";
const CACHE_PATH = "./cache";

function joinSuffix(name: string) {
  return [name, SUFFIX].join(".");
}

function joinPath(name: string) {
  return resolve(__dirname, CACHE_PATH, joinSuffix(name));
}

async function cehckCacheDir() {
  const path = resolve(__dirname, CACHE_PATH);
  const exists = await fs.exists(path);
  if (!exists) {
    await fs.mkdir(path);
  }
}

function getCacheImgName(url: string) {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(url);
  return hasher.digest("hex");
}

async function isCacheImg(url: string) {
  const imgName = getCacheImgName(url);
  const path = joinPath(joinSuffix(imgName));
  const exists = await Bun.file(path).exists();
  return exists;
}

async function cacheImg(url: string) {
  const isCache = await isCacheImg(url);
  if (isCache) return;

  const imgName = getCacheImgName(url);

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    },
    verbose: true,
    proxy: "http://127.0.0.1:20171",
  });
  console.log(response.status);

  if (!response.ok) throw new Error("fetch error");

  const buffer = await response.arrayBuffer();

  const path = joinPath(joinSuffix(imgName));
  return await sharp(buffer).webp().toFile(path);
}

async function bootstrap() {
  await cehckCacheDir();

  const db = new BangumiDB();

  const data = await db.all();
  const imgs = data
    .map((item) =>
      item.value.reduce(
        (acc, cur) => acc.concat(cur.map((item) => item.cover)),
        [] as string[]
      )
    )
    .reduce((acc, cur) => acc.concat(cur), [] as string[]);

  for (const img of imgs) {
    try {
      await cacheImg(img);
    } catch (error) {
      console.log(error);
    }
  }
}

await bootstrap();
