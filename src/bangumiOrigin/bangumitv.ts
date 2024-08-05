import { load } from "cheerio";
import type { Bangumi } from "../types";

const regex = /url\(['"]?([^'"]*)['"]?\)/;
async function get() {
	const $ = await fetch("https://bangumi.tv/calendar")
		.then((res) => res.text())
		.then((content) => load(content));

	return $("#colunmSingle")
		.find(".week")
		.map((_i, weekEl) => {
			return [
				$(weekEl)
					.find(".coverList li")
					.map((_index, el) => {
						const $el = $(el);
						const name = $el.find(".info").text().trim();
						const url = $el.find(".info p").eq(0).find("a").attr("href");

						/** 匹配style里的background图片的路径 */
						const match = $el.attr("style")?.match(regex);

						let cover = "";
						if (match) cover = match[1];

						const data: Bangumi = {
							name,
							url: `https://bangumi.tv${url}`,
							cover: `https:${cover}`,
							episode: "",
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
	name: "番组计划",
	get,
};
