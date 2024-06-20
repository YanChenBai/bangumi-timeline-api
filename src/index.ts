import { getCacheImgName, isCacheImg, joinPath, joinSuffix } from "./cacheImgs";
import { BangumiDB } from "./db";
import { logger } from "./log";

const db = new BangumiDB();

async function getImgCache(url: URL) {
  const img = url.searchParams.get("img");

  if (img) {
    const isCache = await isCacheImg(img);

    if (isCache) {
      const path = joinPath(getCacheImgName(img));
      return new Response(Bun.file(path));
    } else {
      return new Response(Bun.file("./src/imgerror.png"));
    }
  } else {
    return new Response("Params Error", { status: 400 });
  }
}

async function getTimeline() {
  const data = await db.all();
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function bootstrap() {
  const server = Bun.serve({
    fetch: async (req) => {
      let response: Response;
      const url = new URL(req.url);

      if (url.pathname === "/timeline") {
        response = await getTimeline();
      } else if (url.pathname === "/img") {
        response = await getImgCache(url);
      } else {
        response = new Response("Hello World!");
      }

      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set("Access-Control-Allow-Methods", "GET, POST");
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );

      return response;
    },
    port: Number(process.env.PORT || 3000),
  });

  logger.info(
    `Listening on http://localhost:${server.port}, start time ${new Date()}`
  );

  Bun.spawn(["bun", "run", "tasks.ts"], {
    cwd: "./src",
    stdin: "inherit",
    stdio: ["inherit", "inherit", "inherit"],
    onExit: (code) => {
      logger.info(
        `child process exited with code ${code.exitCode}, ${new Date()}`
      );
    },
  });
}

await bootstrap();
