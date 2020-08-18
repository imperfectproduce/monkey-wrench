/*
Generic read-through cache wrapper to cache the result of any function returning a promise.
Safe - Failures to read from the cache result in the underlying function being called.
*/
const lzo = require('lzo');

// concatates and serializes args
const argsCacheKeySerializer = (...args) => {
  return args.map(JSON.stringify).join('-');
};

const tryGetFromCache = ({ cache, key, logger, name }) => {
  return cache.get(key)
    .then(cachedValue => {
      return [cachedValue, false];
    })
    .catch(error => {
      // if something goes wrong reading from cache
      logger.error({
        message: 'Error accessing cache',
        name,
        key,
        error
      });
      return [null,  true];
    });
};

/*
Read-through cache wrapper function to enhance any fn returning a promise
*/
const cacheWrapper = (fn, cache, logger, params = {}) => {
  const {
    name = null, // optionally included in logging if provided
    cacheKeySerializer = argsCacheKeySerializer,
    options = {}
  } = params;
  const {
    expirationSeconds = 300, // 5 mins
    withCompression = false,
    compressionLib = lzo
  } = options;

  return (...args) => {
    const start = Date.now();
    const key = cacheKeySerializer.apply(null, args);

    return tryGetFromCache({ cache, key, logger, name })
      .then(([cachedValue, didError]) => {

        if (!cachedValue) {
          return fn.apply(null, args)
            .then(result => ({ result, cacheHit: false, didError }));
        }

        const finalCachedValue = withCompression ? compressionLib.decompress(cachedValue) : cachedValue;
        return { result: finalCachedValue, cacheHit: true, didError };
      })
      .then(({ result, cacheHit, didError }) => {
        logger.info({
          name,
          key,
          cacheHit,
          ms: Date.now() - start
        }, ['cache-metrics']);

        // add to cache if this request was not a cache hit, we got a result (truthy value),
        // and there was no error reading from the cache
        if (!cacheHit && result && !didError) {
          const finalResultForCache = withCompression ? compressionLib.compress(result) : result;
          // fire and forget
          cache.set(key, finalResultForCache, expirationSeconds);
        }

        return result;
      })
      .catch(error => {
          return { result: null, cacheHit: false, error };
      });
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
