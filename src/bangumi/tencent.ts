import puppeteer, { Page } from "puppeteer";
import type { Bangumi } from "../types";

export default async function (): Promise<Bangumi[][]> {
  async function getCurList(page: Page) {
    const res = await page.$eval(".form-banner-module", (el) => {
      const list = el.querySelectorAll(
        ".form-banner-item-wrap>.video-banner-item"
      );
      const arr: Bangumi[] = [];
      list.forEach((item) => {
        item.classList.add("switch-await");
        const name =
          item.querySelector(".banner-title")?.textContent?.trim() ?? "";

        const episode =
          item
            .querySelector(
              ".banner-corner-wrap.corner-wrap.corner-mark--medium.corner-mark--rightBottom"
            )
            ?.textContent?.trim() ?? "";

        const updateTime =
          item.querySelector(".banner-subtitle")?.textContent?.trim() ?? "";

        const cover =
          item.querySelector("img")?.getAttribute("data-src")?.trim() ?? "";

        const url = item.querySelector("a")?.getAttribute("href")?.trim() ?? "";

        arr.push({
          name,
          url: `https:${url}`,
          cover: `https:${cover}`,
          updateTime,
          episode,
        });
      });
      return arr;
    });

    return res;
  }

  async function findStartIndex(page: Page) {
    return await page.$eval(".form-banner-head", (el) => {
      let startIndex = 0;
      el.querySelectorAll("banner-filter-wrap").forEach((item, index) => {
        if (item.classList.contains("banner-filter-item-activ")) {
          startIndex = index;
        }
      });
      return startIndex + 1;
    });
  }

  function clickAwait(page: Page, index: number) {
    return new Promise<void>(async (res, rej) => {
      const startContent = await page.$eval(
        ".form-banner-item-wrap",
        (el) => el.textContent ?? ""
      );

      const startHash = Bun.hash(startContent);

      const timeOutTimer = setTimeout(() => {
        clearInterval(timer);
        clearTimeout(timeOutTimer);
        rej("超时");
      }, 1000 * 60);

      const timer = setInterval(async () => {
        await page.click(
          `div.form-banner-head > div.banner-filter-wrap > span:nth-child(${index})`
        );
        const nowContent = await page.$eval(
          ".form-banner-item-wrap",
          (el) => el.textContent ?? ""
        );

        const nowHash = Bun.hash(nowContent);

        if (nowHash !== startHash) {
          clearInterval(timer);
          clearTimeout(timeOutTimer);
          res();
        }
      }, 1000);
    });
  }

  const list: Bangumi[][] = [[], [], [], [], [], [], []];

  const browser = await puppeteer.launch({
    //   headless: false,
  });

  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto("https://v.qq.com/channel/cartoon");

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  await page.waitForSelector(".form-banner-module");

  // 获取第一次进来的数据
  const startIndex = await findStartIndex(page);
  const startRes = await getCurList(page);
  list[startIndex - 1] = startRes;

  for (let i = 1; i <= 7; i++) {
    if (i === startIndex) continue;

    await clickAwait(page, i);
    const res = await getCurList(page);

    list[i - 1] = res;
  }

  await browser.close();

  return list;
}
