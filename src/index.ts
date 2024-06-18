import { getCacheImgName, isCacheImg, joinPath, joinSuffix } from "./cacheImgs";
import { BangumiDB } from "./db";

const db = new BangumiDB();

async function bootstrap() {
  const server = Bun.serve({
    fetch: async (req) => {
      const url = new URL(req.url);
      if (url.pathname === "/timeline") {
        const data = await db.all();
        return new Response(JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else if (url.pathname === "/img") {
        const img = url.searchParams.get("img");

        if (img) {
          const isCache = await isCacheImg(img);

          if (isCache) {
            const path = joinPath(joinSuffix(getCacheImgName(img)));
            return new Response(Bun.file(path));
          }
        }
      }

      return new Response("Hello World!");
    },
    port: 3000,
  });

  console.log(
    `Listening on http://localhost:${server.port}, start time ${new Date()}`
  );

  // Bun.spawn(["bun", "run", "tasks.ts"], {
  //   cwd: "./src",
  //   stdin: "inherit",
  //   stdio: ["inherit", "inherit", "inherit"],
  //   onExit: (code) => {
  //     console.log(
  //       `child process exited with code ${code.exitCode}, ${new Date()}`
  //     );
  //   },
  // });
}

await bootstrap();
