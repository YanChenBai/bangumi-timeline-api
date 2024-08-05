import BangumiOrigin from "./bangumiOrigin";

type Origin = keyof typeof BangumiOrigin;

const origin = process.env.origin as Origin | undefined;
let key: Origin;
if (origin) {
	key = origin;
} else {
	key = "mikanani";
}

console.log("Test:", BangumiOrigin[key].name);
console.log(await BangumiOrigin[key].get());
