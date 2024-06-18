import { load } from "cheerio";
import type { Bangumi } from "../types";

function getOrgin(url: string) {
  const u = new URL(url);
  return `${u.origin}${u.pathname}`;
}

export default async function (): Promise<Bangumi[][]> {
  const $ = await fetch("https://mikan.bycrx.ltd")
    .then((res) => res.text())
    .then((text) => load(text));

  const list: Bangumi[][] = [[], [], [], [], [], [], []];

  $(".sk-bangumi").map((_i, el) => {
    const indexStr = $(el).attr("data-dayofweek");
    if (!indexStr || indexStr === "7") return;

    const index = indexStr === "0" ? 6 : Number(indexStr) - 1;

    const item = $(el)
      .find("li")
      .map((_ic, _el) => {
        const $el = $(_el);

        const bottom = $el.find(".an-info-group").children();
        const name = bottom.eq(1).text();
        const updateTime = bottom.eq(0).text();
        const url = $el.find("a").attr("href") ?? "";
        const cover = $el.find("span").attr("data-src") ?? "";

        const data: Bangumi = {
          name,
          updateTime,
          url: `https://mikanani.me${url}`,
          cover: getOrgin(`https://mikan.bycrx.ltd${cover}`),
          episode: "",
        };
        return data;
      })
      .toArray();

    list[index] = item;
  });

  return list;
}
