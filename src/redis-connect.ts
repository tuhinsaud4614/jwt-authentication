import { createClient } from "redis";
import { promisify } from "util";
import logger from "./logger";

// Redis connect
const redisClient = createClient(
  process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379,
  process.env.REDIS_HOST || "127.0.0.1"
);

export const asyncRedisGet = promisify(redisClient.get).bind(redisClient);
export const asyncRedisSet = promisify(redisClient.set).bind(redisClient);
export const asyncRedisDel = promisify(redisClient.del).bind(redisClient);

redisClient.on("connect", () => {
  logger.info("Redis connected successfully.");
});

redisClient.on("ready", () => {
  logger.info(`Redis is ready to use.`);
});

redisClient.on("error", (err) => {
  logger.error(`Redis not connected. ${err.message}`);
});

redisClient.on("end", () => {
  logger.warn(`Redis is disconnected.`);
});

process.on("SIGINT", () => {
  redisClient.quit();
});

export default redisClient;
