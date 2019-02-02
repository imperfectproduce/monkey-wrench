import redis from 'redis';
import Promise from 'bluebird';
import * as logger from './lib/logger';
Promise.promisifyAll(redis);

// redis looks to hang when it gets disconnected
const GET_TIMEOUT_MS = process.env.GET_TIMEOUT_MS || 500; // half a second by default

// only create client if env vars are there? (don't want to fallback on default)
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

const logRedisEvent = (level, message, data) => {
  const content = { message };
  if (data) content.data = data;

  return logger[level](content, ['redis-event']);
};

const logRedisInfoEvent = (message, data) => logRedisEvent('info', message, data);
const logRedisErrorEvent = (message, data) => logRedisEvent('error', message, data);
const logRedisWarningEvent = (message, data) => logRedisEvent('warn', message, data);

client.on('ready', () => logRedisInfoEvent('Redis ready'));
client.on('connect', () => logRedisInfoEvent('Redis connected'));
client.on('reconnecting', (data) => logRedisInfoEvent('Redis reconnecting', data));
client.on('error', (err) => logRedisErrorEvent('Redis error', err));
client.on('warning', (warning) => logRedisWarningEvent('Redis error', warning));
client.on('end', () => logRedisInfoEvent('Redis end'));

export const get = (key) => {
  return client.getAsync(key)
    .timeout(GET_TIMEOUT_MS)
    .then(result => JSON.parse(result)); // deserialize
};

export const set = (key, value, expirationSeconds = 60) => {
  const serializedValue = JSON.stringify(value);
  return client.setAsync(key, serializedValue, 'EX', expirationSeconds);
};

export const deleteKey = (key) => {
  return client.delAsync(key);
};
