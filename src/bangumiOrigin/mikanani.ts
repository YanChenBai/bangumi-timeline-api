import { load } from "cheerio";
import type { Bangumi } from "../types";

function getOrgin(url: string) {
	const u = new URL(url);
	return `${u.origin}${u.pathname}`;
}

async function get(): Promise<Bangumi[][]> {
	const $ = await fetch("https://mikan.bycrx.ltd")
		.then((res) => res.text())
		.then((text) => load(text));

	const list: Bangumi[][] = [[], [], [], [], [], [], [], []];

	$(".sk-bangumi").map((_i, el) => {
		const indexStr = Number($(el).attr("data-dayofweek") ?? 0);

		let index: number;

		// 蜜柑的周日是0, 周一到周六时1-6, 大于7的都是其他番
		if (indexStr >= 7) {
			index = 7;
		} else if (indexStr === 0) {
			index = 6;
		} else {
			index = indexStr - 1;
		}

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
					cover: getOrgin(`https://mikanani.me${cover}`),
					episode: "",
				};
				return data;
			})
			.toArray();

		list[index] = item;
	});

	return list;
}

export default {
	name: "蜜柑计划",
	get,
};
