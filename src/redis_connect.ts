import { createClient } from "redis";
import logger from "./logger";

// Redis connect
const redis_client = createClient(
  process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379,
  process.env.REDIS_HOST || "127.0.0.1"
);

redis_client.on("connect", () => {
  logger.info("Redis connected successfully.");
});

redis_client.on("ready", () => {
  logger.info(`Redis is ready to use.`);
});

redis_client.on("error", (err) => {
  logger.error(`Redis not connected. ${err.message}`);
});

redis_client.on("end", () => {
  logger.warn(`Redis is disconnected.`);
});

process.on("SIGINT", () => {
  redis_client.quit();
});

export default redis_client;
