// import redis,  from "redis";

// class Redis {
//   connected: boolean = false;
//   private client: redis.RedisClientType = null;

//   constructor() {
//     const redisClient = redis.createClient();
//     redisClient.connect().then(() => {
//       this.client = redisClient;
//       this.connected = true;
//     });
//     redisClient.on("error", (err: any) => {
//       this.connected = false;
//       console.error("Redis error:", err);
//     });
//   }

//   getClient() {
//     if (!this.connected) return null;
//     return this.client;
//   }

// export default new Redis();

/* eslint-disable no-inline-comments */
import type { RedisClientType } from "redis";
import { createClient } from "redis";

let redisClient: RedisClientType;
let isReady: boolean;

function getCache<T>(key: string): Promise<T | null> {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await getRedisClient();
      const cacheData = await client.get(key);
      if (cacheData) {
        resolve(JSON.parse(cacheData));
      } else {
        resolve(null);
      }
    } catch (error) {
      reject(error);
    }
  });
}

function getOrSetCache<T>(
  key: string,
  cb: () => Promise<T>,
  exp: number | null = null
): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    try {
      const client = await getRedisClient();
      const cacheData = await client.get(key);
      if (cacheData) {
        resolve(JSON.parse(cacheData));
      } else {
        const freshData = await cb();
        if (exp) {
          await client.setEx(key, exp, JSON.stringify(freshData));
        } else {
          await client.set(key, JSON.stringify(freshData));
        }
        resolve(freshData);
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function getRedisClient(): Promise<RedisClientType> {
  if (!isReady) {
    redisClient = createClient();
    redisClient.on("error", (err) => console.log(`Redis Error 🚨: ${err}`));
    redisClient.on("connect", () => console.log("Redis connected ✅"));
    redisClient.on("reconnecting", () => console.log("Redis reconnecting"));
    redisClient.on("ready", () => {
      isReady = true;
      console.log("Redis ready!");
    });
    await redisClient.connect();
  }
  return redisClient;
}

getRedisClient()
  .then((connection) => {
    redisClient = connection;
  })
  .catch((err) => {
    console.log(err, "Failed to connect to Redis");
  });

async function gracefulShutdown() {
  const client = await getRedisClient();
  console.log("closing Redis connection...");
  client.quit();
}

export { getRedisClient, getOrSetCache, getCache, gracefulShutdown };
