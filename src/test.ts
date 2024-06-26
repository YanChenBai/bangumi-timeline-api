import bangumiOrigin from "./bangumi";

type Origin = keyof typeof bangumiOrigin;

const origin = process.env.origin as Origin | undefined;
let key: Origin;
if (origin) {
  key = origin;
} else {
  key = "mikanani";
}

console.log("Test:", bangumiOrigin[key].name);
console.log(await bangumiOrigin[key].get());
