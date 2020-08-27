const redis = require('redis');
const Promise = require('bluebird');
const snappy = require('snappy');
Promise.promisifyAll(redis);

// http://redis.js.org/#api-connection-and-other-events
const REDIS_CONNECTION_EVENTS = {
  ready: 'info',
  connect: 'info',
  reconnecting: 'info',
  error: 'error',
  warning: 'warning',
  end: 'info'
};

// callback gets invoked with ({ level, event })
const subscribeToConnectionEvents = (client, callback) => {
  Object.keys(REDIS_CONNECTION_EVENTS)
    .forEach((connectionEvent) => {
      client.on(connectionEvent, (data) => {
        const event = {
          level: REDIS_CONNECTION_EVENTS[connectionEvent],
          event: {
            connectionEvent
          }
        };

        if (data) event.event.data = data;

        callback(event);
      });
    });
};

function RedisKeyValueCache(options = {}) {
  const {
    host, // required
    port, // required
    // optionally function subscriber to redis connection events: ({ level, event }) => {}
    onConnectionEvent = null,
    // don't get stuck not being able to access the cache
    // getAsync throws a bluebird Promise.TimeoutError error after specified milliseconds
    getTimeoutMs = 500,
    // 🚩 If you plan to flip this flag on a running cache, you'll have
    // ${expirationSeconds} where the cache will serve 500s.
    // 🤠 You could flush the cache on successful deploy to mitigate this.
    useCompression
  } = options;

  if (!host) throw new Error('Missing redis host');
  if (!port) throw new Error('Missing redis port');

  const client = redis.createClient({ host, port, ...(useCompression && { return_buffers: true }) });
  if (onConnectionEvent) {
    subscribeToConnectionEvents(client, onConnectionEvent);
  }

  this.deserializeCompressedResult = (result) => {
    if (result) {
      return new Promise((resolve, reject) => {
        snappy.uncompress(result, { asBuffer: true }, (err, uncompressed) => {
          if (err) {
            reject(new Error(`Snappy decompression failed with on type ${typeof result} with error: ${err}`));
          }
          resolve(JSON.parse(uncompressed));
        });
      });
    }
    return Promise.resolve(result);
  };

  this.deserializeResult = (result) => {
    if (useCompression) {
      return this.deserializeCompressedResult(result);
    }
    return Promise.resolve(JSON.parse(result));
  };

  this.get = (key) => {
    return client.getAsync(key)
      .timeout(getTimeoutMs)
      .then(this.deserializeResult); // deserialize
  };

  this.serializeCompressedResult = (value) => {
    return new Promise((resolve, reject) => {
      snappy.compress(JSON.stringify(value), (err, compressed) => {
        if (err) {
          reject(new Error(`Snappy compression failed on type ${typeof value} with error: ${err}`));
        }
        resolve(compressed);
      });
    });
  };

  this.serializeValue = (value) => {
    if (useCompression) {
      return this.serializeCompressedResult(value);
    }
    return Promise.resolve(JSON.stringify(value));
  };

  this.set = (key, value, expirationSeconds = 60) => {
    return this.serializeValue(value)
      .then(serializedValue => {
        const jitter = Math.floor(Math.random() * 10);
        const expires = expirationSeconds + jitter;
        return client.setAsync(key, serializedValue, 'EX', expires);
      });
  };

  this.deleteKey = (key) => {
    return client.delAsync(key);
  };
}

module.exports = RedisKeyValueCache;
