import puppeteer from "puppeteer";
import type { Bangumi } from "../types";

async function get(): Promise<Bangumi[][]> {
  const browser = await puppeteer.launch({
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
  await page.goto("https://www.5dm.link/timeline");

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  await page.waitForSelector("#content");

  const resp = await page.$eval("#content", (content) => {
    function matchEpisode(str: string) {
      const regex = /【([^【】]*)】/;
      const match = str.match(regex);

      if (match && match[1]) {
        const content = match[1];
        return content;
      } else {
        return "";
      }
    }

    const days: Bangumi[][] = [];

    content.querySelectorAll(".wpb_wrapper .smart-box").forEach((dayEl) => {
      const day: Bangumi[] = [];
      dayEl.querySelectorAll(".video-item").forEach((item) => {
        const cover =
          item.querySelector("img")?.getAttribute("data-original")?.trim() ??
          "";
        const url = item.querySelector("a")?.getAttribute("href")?.trim() ?? "";
        const head =
          item.querySelector(".item-head")?.textContent?.trim() ?? "";
        const episode = matchEpisode(head);
        const name = head.replace(`【${episode}】`, "");

        day.push({
          cover,
          url,
          name,
          episode,
          updateTime: "",
        });
      });

      days.push(day);
    });

    return days;
  });

  await browser.close();
  return resp;
}

export default {
  name: "5DM",
  get,
};
