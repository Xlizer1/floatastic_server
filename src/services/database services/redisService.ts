import { createClient } from "redis";

const { REDIS_HOST, REDIS_PORT, REDIS_USER, REDIS_PASSWORD} = process.env;

const user = REDIS_USER || "default";
const password = REDIS_PASSWORD || "";
const host = REDIS_HOST || "127.0.0.1";
const port = REDIS_PORT ? JSON.parse(REDIS_PORT) : 6379;

const redisClient = createClient({
    username: user,
    password: password,
    socket: {
        host: host,
        port: port,
    },
});

redisClient.on("error", (err) => console.error("Redis error:", err));
await redisClient.connect();

export async function cacheSkinData(key: string, data: any, ttl: number) {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
}

export async function getCachedSkinData(key: string) {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
}
