import { load } from "cheerio";
import path from "path";
import type { Bangumi } from "../types";

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

async function get() {
  const $ = await fetch("https://www.5dm.link/timeline")
    .then((res) => res.text())
    .then((text) => load(text));

  return $(".wpb_wrapper .smart-box")
    .map((i, el) => {
      return [
        $(el)
          .find(".video-item")
          .map((i, vel) => {
            const $vel = $(vel);
            const cover = $vel.find("img").attr("data-original") ?? "";
            const url = $vel.find("a").attr("href") ?? "";
            const head = $vel.find(".item-head").text().trim();
            const episode = matchEpisode(head);
            const name = head.replace(`【${episode}】`, "");

            const data: Bangumi = {
              cover,
              url,
              name,
              episode,
              updateTime: "",
            };
            return data;
          })
          .toArray(),
      ];
    })
    .toArray();
}

export default {
  name: "5DM",
  get,
};
