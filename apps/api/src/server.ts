import { createApp } from "./app";
import { env } from "./env";

async function bootstrap() {
  const app = await createApp();

  app.listen(env.API_PORT, () => {
    console.log(`Workforce API listening on port ${env.API_PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("API bootstrap failed", error);
  process.exit(1);
});
