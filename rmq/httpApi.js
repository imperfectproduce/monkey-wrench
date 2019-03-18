const fetch = require('isomorphic-fetch');

const RMQ_ENVS = [
  'debug',
  'dev',
  'prod'
];
const VHOST = process.env.RMQ_VHOST;
const baseUrl = `https://${VHOST}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_HOST}/api`;

/**
 * If the queue name is fully formed with the env, it will be returned as is.
 * Else, it prepends the RMQ_ENVIRONMENT to the queue name.
 */
const getQueueNameWithEnv = (queue) => {
  // leave it alone if already prefixed
  if (RMQ_ENVS.some(env => queue.startsWith(`${env}.`))) return queue;

  // else prepend base on RMQ_ENVIRONMENT, with fallback to debug
  return `${process.env.RMQ_ENVIRONMENT || 'debug'}.${queue}`;
};

const getQueue = (queue, options = {}) => {
  const {
    lengthsAge = 60, // 1 minute
    lengthsIncr = 1 // 1 second
  } = options;

  const query = `lengths_age=${lengthsAge}&lengths_incr=${lengthsIncr}`;
  const url = `${baseUrl}/queues/${VHOST}/${getQueueNameWithEnv(queue)}?${query}`;

  return fetch(url)
    .then(response => response.json());
};

module.exports = {
  getQueue
};
