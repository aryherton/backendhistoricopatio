import dotenv from "dotenv";
dotenv.config();

import { createClient } from "redis";
const client = createClient({
  url: `redis://192.168.1.150:6379`,
});

(async () => {
  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();
})();

const salvarRedisExpire = async (nomeHash, key, value) => {
  await client.HSET(nomeHash, key, value);
  await client.expire(nomeHash, 86400);
};

const salvarRedis = async (nomeHash, key, value) => {
  await client.HSET(nomeHash, key, value);
};

const getAllRedis = async (category) => {
  const result = await client.HGETALL(category);
  return result;
};

const getValueRedis = async (key) => {
  const result = await client.MGET([key]);
  return result;
};

const getAllKeys = async (category) => {
  const result = await client.keys(category);
  return result;
};

const hdelRedis = async (category, key) => {
  await client.HDEL(category, key);
};

const delAllRedis = async (category) => {
  await client.DEL(category);
};

const getOneRedis = async (category, key) => {
  const result = await client.HGET(category, key);
  return result;
};

export default {
  salvarRedisExpire,
  salvarRedis,
  getAllRedis,
  getOneRedis,
  delAllRedis,
  hdelRedis,
  getAllKeys,
  getValueRedis,
};
