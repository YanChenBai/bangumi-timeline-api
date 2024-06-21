import { load } from "cheerio";
import { getSeasonName } from "../utils";
import type { Bangumi } from "../types";
import puppeteer from "puppeteer";
async function get() {
  const y = new Date().getFullYear();
  const url = `https://anilist.co/search/anime?year=${y}&season=${getSeasonName()}`;

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: process.env.BROWSER_PATH,
    args: [
      "--disable-gpu",
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--no-zygote",
    ],
  });

  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto(url);

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  //   await page.waitForSelector("#content");

  await browser.close();

  return [];
}

export default { get, name: "AniList" };
