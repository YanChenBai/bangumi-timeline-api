import { load } from "cheerio";
import { getQuarter } from "../utils";
import type { Bangumi } from "../types";
async function get() {
  const url = `https://acgsecrets.hk/bangumi/${getQuarter()}`;

  const $ = await fetch(url)
    .then((res) => res.text())
    .then((res) => load(res));

  const days = ["一", "二", "三", "四", "五", "六", "日"];
  const data = $("#acgs-anime-icons");

  return days.map((day) => {
    const list = data.find(`[weektoday=${day}]`);
    return list
      .map((_i, el) => {
        const $el = $(el);
        const name = $el.find(".anime_name").text().trim();
        const updateTime = $el
          .find(".anime_airtime.time_today .time")
          .text()
          .trim();
        const firstTime = $el.attr("datetoday");
        const cover = $el.find("img").attr("src") ?? "";
        const anchor = $el.find("a").attr("href") ?? "";

        const data: Bangumi = {
          name,
          updateTime,
          episode: firstTime ? `${firstTime}首播` : "",
          cover,
          url: `${url}/${anchor}`,
        };

        return data;
      })
      .toArray();
  });
}

export default { get, name: "ACG Secrets" };
