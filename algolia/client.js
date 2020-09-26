const algoliasearch = require('algoliasearch');

function Client(appId, key) {
  if (!appId || !key) throw new Error('Must provide appId and key constructor values');

  const client = algoliasearch(appId, key);

  this.getAllRecords = (indexName) => {
    return new Promise((resolve, reject) => {
      const index = client.initIndex(indexName);
      const browser = index.browseAll();
      let records = [];

      browser.on('result', (content) => {
        records = [
          ...records,
          ...content.hits
        ];
      });
      browser.on('end', () => resolve(records));
      browser.on('error', reject);
    });
  };

  /**
   * Create or update (overwrite whole) records by their objectID
   * @param {string} indexName The name of the index.
   * @param {array} records
   */
  this.saveRecords = (indexName, records) => {
    const index = client.initIndex(indexName);
    return index.saveObjects(records);
  };

  /**
   * Create or update (overwrite whole) record by its objectID
   * @param {string} indexName The name of the index.
   * @param {object} record
   */
  this.saveRecord = (indexName, record) => {
    const index = client.initIndex(indexName);
    return index.saveObject(record);
  };

  /**
   * Delete records by Id.
   * @param {string} indexName The name of the index.
   * @param {array} objectIDs
   */
  this.deleteRecordsByIds = (indexName, objectIDs) => {
    const index = client.initIndex(indexName);
    return index.deleteObjects(objectIDs);
  };

  /**
   * Delete record by Id.
   * @param {string} indexName The name of the index.
   * @param {string} objectID
   */
  this.deleteRecord = (indexName, objectID) => {
    const index = client.initIndex(indexName);
    return index.deleteObject(objectID);
  };

  /**
   * Delete record by Id.
   * @param {string} indexName The name of the index.
   * @param {string} params Algolia filtering parameters.  Cannot be empty.
   * @param {string} options Request options for the query. 
   */
  this.deleteRecordsBy = (indexName, params, options = {}) => {
    const index = client.initIndex(indexName);
    return index.deleteBy(params, options);
  };

  /**
   * Batch update records.
   * @param {string} indexName The name of the index.
   * @param {string} operations Algolia filtering parameters.  Cannot be empty.
   * @param {string} options Request options for the query. 
   */
  this.batch = (indexName, operations) => {
    const index = client.initIndex(indexName);
    return index.batch(operations);
  };


  /**
   * Search
   * @param {string} indexName The name of the index.
   * @param {string} query Search query text.
   * @param {object} options Algolia options
   */
  this.search = (indexName, query, options = {}) => {
    const index = client.initIndex(indexName);
    return index.search(query, options);
  };
}

module.exports = Client;
