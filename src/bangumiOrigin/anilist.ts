import { getSeasonName } from "../utils";
import type { Bangumi } from "../types";
import { uniqBy } from "lodash-es";

interface Media {
  id: number;
  episodes: number | null;
  siteUrl: string;
  coverImage: {
    large: string;
  };
  nextAiringEpisode: {
    airingAt: number;
  } | null;
  title: {
    native: string;
    chinese?: string;
  };
  startDate: {
    year: number;
    month: number;
    day: number | null;
  };
}

interface Resp {
  data: {
    Page: {
      media: Media[];
      pageInfo: {
        hasNextPage: boolean;
      };
    };
  };
}

async function getData(page: number) {
  const query = `
  query($page: Int, $season: MediaSeason, $seasonYear: Int) {
    Page(page: $page, perPage: 50) {
      media(season: $season, seasonYear: $seasonYear, type: ANIME, sort: TRENDING_DESC, isAdult: false) {
        id
        episodes
        siteUrl
        coverImage {
          large
        }
        nextAiringEpisode {
          airingAt
        }
        title {
          native
        }
        startDate {
          year
          month
          day
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

  const y = new Date().getFullYear();

  const resp = await fetch("https://trace.moe/anilist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: {
        page,
        season: getSeasonName(),
        seasonYear: y,
      },
    }),
  }).then(async (res) => (await res.json()) as Resp);

  return resp.data;
}

async function get() {
  let medias: Media[] = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const data = await getData(page);
    medias.push(...data.Page.media);
    hasNextPage = data.Page.pageInfo.hasNextPage;
    page++;
  }

  medias = uniqBy(medias, "id");

  const bangumis: Bangumi[][] = [[], [], [], [], [], [], [], []];

  for (const media of medias) {
    let index = 7;
    if (media.startDate.day) {
      const startDate = new Date(
        media.startDate.year,
        media.startDate.month - 1,
        media.startDate.day
      );

      const startDay = startDate.getDay();
      index = startDay === 0 ? 6 : startDay - 1;
    }

    bangumis[index].push({
      name: media.title.chinese ? media.title.chinese : media.title.native,
      cover: media.coverImage.large,
      url: media.siteUrl,
      episode: media.episodes ? `共${media.episodes}集` : "",
      updateTime:
        `放送时间` +
        (media.startDate.day
          ? `${media.startDate.month}月${media.startDate.day}日`
          : `${media.startDate.month}月`),
    });
  }

  return bangumis;
}

export default { get, name: "AniList" };
