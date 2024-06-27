import type { Bangumi } from "../types";
import { getDay } from "../utils";

interface Resp {
  code: number;
  message: string;
  result: Result[];
}

interface Result {
  date: string;
  date_ts: number;
  day_of_week: number;
  episodes: Episode[];
  is_today: number;
}

interface Episode {
  cover: string;
  delay: number;
  delay_id: number;
  delay_index: string;
  delay_reason: string;
  enable_vt: boolean;
  ep_cover: string;
  episode_id: number;
  follows: string;
  icon_font: Iconfont;
  plays: string;
  pub_index: string;
  pub_time: string;
  pub_ts: number;
  published: number;
  season_id: number;
  square_cover: string;
  title: string;
}

interface Iconfont {
  name: string;
  text: string;
}

async function get(): Promise<Bangumi[][]> {
  const day = getDay();
  const before = day - 1;
  const after = 7 - day;
  return await fetch(
    `https://api.bilibili.com/pgc/web/timeline?types=1&before=${before}&after=${after}`
  )
    .then(async (res) => (await res.json()) as Resp)
    .then(({ code, message, result }) => {
      if (code !== 0) throw new Error(message);

      return result.map(({ episodes }) =>
        episodes.map(({ cover, title, pub_time, pub_index, season_id }) => {
          const item: Bangumi = {
            cover,
            name: title,
            updateTime: pub_time,
            episode: pub_index,
            url: `https://www.bilibili.com/bangumi/play/ss${season_id}`,
          };
          return item;
        })
      );
    });
}

export default {
  name: "哔哩哔哩",
  get,
};
