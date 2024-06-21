import { getCacheImgName, isCacheImg, joinPath, joinSuffix } from "./cacheImgs";
import { BangumiDB } from "./db";
import { logger } from "./log";

const db = new BangumiDB();

async function getImgCache(url: URL) {
  const filePath = joinPath(url.pathname.replace("/img/", ""));

  const imgFile = Bun.file(filePath);

  const isCache = await imgFile.exists();

  if (isCache) {
    return new Response(imgFile);
  } else {
    return new Response("Not Found", { status: 404 });
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
      } else if (url.pathname.startsWith("/img/")) {
        response = await getImgCache(url);
      } else {
        response = new Response("Hello World!");
      }

      response.headers.set(
        "Access-Control-Allow-Origin",
        process.env["DOMAIN"] ?? "*"
      );
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
