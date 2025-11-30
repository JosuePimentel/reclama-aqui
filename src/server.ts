import { app } from "./app.js";
import { env } from "@env";

app
  .listen({ port: env!.PORT, host: env!.ENVIRONMENT !== 'dev' ? '0.0.0.0' : 'localhost' })
  .then(() => console.log(`HTTP SERVER Running in port ${env!.PORT}!`))