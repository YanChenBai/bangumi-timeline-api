import type { Bangumi } from "../types";
import { getPuppeteer } from "../utils";

async function get(): Promise<Bangumi[][]> {
	const browser = await getPuppeteer("tl5dm");

	try {
		const page = await browser.newPage();

		// Navigate the page to a URL
		await page.goto("https://www.5dm.link/timeline");

		// Set screen size
		await page.setViewport({ width: 1080, height: 1024 });

		await page.waitForSelector("#content");

		const resp = await page.$eval("#content", (content) => {
			function matchEpisode(str: string) {
				const regex = /【([^【】]*)】/;
				const match = str.match(regex);

				if (match?.[1]) {
					const content = match[1];
					return content;
				}
				return "";
			}

			const days: Bangumi[][] = [];

			content.querySelectorAll(".wpb_wrapper .smart-box").forEach((dayEl) => {
				const day: Bangumi[] = [];
				dayEl.querySelectorAll(".video-item").forEach((item) => {
					const cover =
						item.querySelector("img")?.getAttribute("data-original")?.trim() ??
						"";
					const url =
						item.querySelector("a")?.getAttribute("href")?.trim() ?? "";
					const head =
						item.querySelector(".item-head")?.textContent?.trim() ?? "";
					const episode = matchEpisode(head);
					const name = head.replace(`【${episode}】`, "");

					day.push({
						cover,
						url,
						name,
						episode,
						updateTime: "",
					});
				});

				days.push(day);
			});

			return days;
		});

		return resp;
	} finally {
		await browser.close();
	}
}

export default {
	name: "5DM",
	get,
};
