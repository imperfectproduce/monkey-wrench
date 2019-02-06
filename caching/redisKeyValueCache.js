const redis = require('redis');
const Promise = require('bluebird');
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
    getTimeoutMs = 500
  } = options;

  if (!host) throw new Error('Missing redis host');
  if (!port) throw new Error('Missing redis port');

  const client = redis.createClient({ host, port });
  if (onConnectionEvent) {
    subscribeToConnectionEvents(client, onConnectionEvent);
  }

  this.get = (key) => {
    return client.getAsync(key)
      .timeout(getTimeoutMs)
      .then(result => JSON.parse(result)); // deserialize
  };

  this.set = (key, value, expirationSeconds = 60) => {
    const serializedValue = JSON.stringify(value);
    return client.setAsync(key, serializedValue, 'EX', expirationSeconds);
  };

  this.deleteKey = (key) => {
    return client.delAsync(key);
  };
}

module.exports = RedisKeyValueCache;
