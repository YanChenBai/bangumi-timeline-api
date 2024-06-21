import { load } from "cheerio";
import type { Bangumi } from "../types";
import { getQuarter } from "../utils";
async function get(): Promise<Bangumi[][]> {
  const url = `https://yuc.wiki/${getQuarter()}`;

  const $ = await fetch(url)
    .then((res) => res.text())
    .then((res) => load(res));

  return $("article table.date_")
    .map((_i, el) => {
      const list = $(el).parent("div").next();
      return [
        list
          .find(".div_date")
          .map((_i2, item) => {
            const $el = $(item);
            const episode = $el.find("p").eq(0).text().trim();
            const updateTime = $el.find("p").eq(1).text().trim();
            const cover = $el.find("img").attr("src") ?? "";
            const name = $el.next().find("td").eq(0).text().trim();

            const data: Bangumi = { episode, updateTime, url, cover, name };

            return data;
          })
          .toArray(),
      ];
    })
    .toArray();
}

export default {
  name: "Yuc WIKI",
  get,
};
