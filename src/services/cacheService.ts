// services/cacheService.ts
import Redis from 'ioredis';

const redis = new Redis(); // Uses default localhost:6379

// Set data to cache
export const setCache = async (key: string, value: any, expireInSec = 3600) => {
  await redis.set(key, JSON.stringify(value), 'EX', expireInSec);
};

// Get data from cache
export const getCache = async (key: string) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

// Clear cache (optional)
export const clearCache = async (key: string) => {
  await redis.del(key);
};
