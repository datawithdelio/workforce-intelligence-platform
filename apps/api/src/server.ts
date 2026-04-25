import { createApp } from "./app";
import { env } from "./env";

async function bootstrap() {
  const app = await createApp();
  const host = "0.0.0.0";

  app.listen(env.API_PORT, host, () => {
    console.log(`Workforce API listening on ${host}:${env.API_PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("API bootstrap failed", error);
  process.exit(1);
});
