import { BangumiDB } from "./db";

const db = new BangumiDB();

async function bootstrap() {
  // const server = Bun.serve({
  //   fetch: async () => {
  //     const data = await db.all();
  //     return new Response(JSON.stringify(data), {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //   },
  //   port: 3000,
  // });
  // console.log(
  //   `Listening on http://localhost:${server.port}, start time ${new Date()}`
  // );
  Bun.spawn(["bun", "run", "tasks.ts"], {
    cwd: "./src",
    stdin: "inherit",
    stdio: ["inherit", "inherit", "inherit"],
    onExit: (code) => {
      console.log(
        `child process exited with code ${code.exitCode}, ${new Date()}`
      );
    },
  });
}

await bootstrap();
