import { app } from "./app.js";
import { env } from "@env";

app
  .listen({ port: env!.PORT })
  .then(() => console.log(`HTTP SERVER Running in port ${env!.PORT}!`))