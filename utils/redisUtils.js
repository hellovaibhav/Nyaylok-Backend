import redis from "ioredis";


const redisClient = new redis(process.env.REDIS_URL);

export const setRedisData = async (key, data) => {
    await redisClient.set(key, JSON.stringify(data),'EX',60);
};

export const getRedisData = async (key) => {

    const cachedData = await redisClient.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
};