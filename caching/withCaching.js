/*
Generic read-through cache wrapper to cache the result of any function returning a promise.
Safe - Failures to read from the cache result in the underlying function being called.
*/
const snappy = require('snappy');

// concatates and serializes args
const argsCacheKeySerializer = (...args) => {
  return args.map(JSON.stringify).join('-');
};

const tryGetFromCache = ({ cache, key, logger, name }) => {
  return cache
    .get(key)
    .catch((error) => {
      // if something goes wrong reading from cache
      logger.error({
        message: 'Error accessing cache, backing off',
        name,
        key,
        error,
      });
      throw error;
    });
};

/*
Read-through cache wrapper function to enhance any fn returning a promise
*/
const cacheWrapper = (fn, cache, logger, params = {}) => {
  const {
    name = null, // optionally included in logging if provided
    cacheKeySerializer = argsCacheKeySerializer,
    options = {},
  } = params;
  const {
    expirationSeconds = 300, // 5 mins
    withCompression = false,
    compressionLib = snappy,
  } = options;

  return (...args) => {
    const start = Date.now();
    const key = cacheKeySerializer.apply(null, args);

    return tryGetFromCache({ cache, key, logger, name })
      .then((cachedValue) => {

        if (!cachedValue) {
          return fn
            .apply(null, args)
            .then((result) => ({ result, cacheHit: false }));
        }

        const finalCachedValue = withCompression
          ? new Promise((resolve, reject) => {
            compressionLib.uncompress(Buffer.from(cachedValue), { asBuffer: true }, (err, uncompressed) => {
              if (err){
                reject(err);
              }
              resolve(JSON.parse(uncompressed));
            })
          })
          : Promise.resolve(cachedValue);

          return finalCachedValue.then((cacheValue) => {
            return { result: cacheValue, cacheHit: true };
          })
      })
      .then(({ result, cacheHit }) => {
        logger.info(
          {
            name,
            key,
            cacheHit,
            ms: Date.now() - start,
          },
          ['cache-metrics']
        );

        // add to cache if this request was not a cache hit, we got a result (truthy value),
        // and there was no error reading from the cache
        if (!cacheHit && result) {
          if (withCompression) {
            compressionLib.compress(JSON.stringify(result), (err, compressed) => {
              if (err){
                throw err;
              }
              cache.set(
                key,
                compressed,
                expirationSeconds
              );
            });
          } else {
            // fire and forget
            cache.set(key, result, expirationSeconds);
          }
        }
        return result;
      })
  };
};

// adds a closure around the cache and logger dependencies
const buildCacheWrapper = ({ cache, logger }) => {
  if (!cache || !cache.get || !cache.set) {
    throw new Error('Must provide a cache interface with get, and set');
  }
  if (logger && (!logger.error || !logger.info)) {
    throw new Error('Logger must have an error and info function');
  }

  return (fn, params = {}) => cacheWrapper(fn, cache, logger, params);
};

module.exports = buildCacheWrapper;
