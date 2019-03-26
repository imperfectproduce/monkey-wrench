const fetch = require('isomorphic-fetch');

const VHOST = process.env.RMQ_VHOST;
const baseUrl = `https://${VHOST}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_HOST}/api`;

/**
 * Fetches the queue entity from RMQ
 * @param {string} queueName Fully qualified queue name including env prefix
 * @param {object} options
 */
const getQueue = (queueName, options = {}) => {
  const {
    lengthsAge = 60, // 1 minute
    lengthsIncr = 1 // 1 second
  } = options;

  const query = `lengths_age=${lengthsAge}&lengths_incr=${lengthsIncr}`;
  const url = `${baseUrl}/queues/${VHOST}/${queueName}?${query}`;

  return fetch(url)
    .then(response => response.json());
};

module.exports = {
  getQueue
};
