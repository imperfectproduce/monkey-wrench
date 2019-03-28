const Client = require('./client');

/*
Enhancements - configurable results cache - probably separate module
*/

function OfferingsSearchClient({ appId, key, env }) {
  const client = new Client(appId, key);
  if (!env) throw new Error('Must provide env to the constructor');

  this.search = ({ query, fc, date, options = {} }) => {
    const {
      tagFilters = []
    } = options;

    return client.search(`${env}_offerings_${fc}`, query, {
      // hitsPerPage,
      // page,
      // analytics,
      // attributesToRetrieve,
      // "getRankingInfo": true, // ??
      // "responseFields": "*", // can exclude however visibility is represented
      // "facets": "*," // probably none to start, we may not have any anyway
      ...options,
      tagFilters: tagFilters.concat(date)
    });
  };
}

module.exports = OfferingsSearchClient;
