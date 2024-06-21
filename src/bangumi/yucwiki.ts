import { load } from "cheerio";
import type { Bangumi } from "../types";

function getQuarter() {
  const date = new Date();
  const m = date.getMonth();
  const y = date.getFullYear();
  let quarter = "";
  if (m >= 1 && m < 4) {
    quarter = "01";
  } else if (m >= 4 && m < 7) {
    quarter = "04";
  } else if (m >= 7 && m < 10) {
    quarter = "07";
  } else if (m >= 10) {
    quarter = "10";
  }
  return `${y}${quarter}`;
}

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
