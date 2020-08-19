/*
Generic read-through cache wrapper to cache the result of any function returning a promise.
Zero dependencies, these are all passed as function arguments.
Safe - Failures to read from the cache result in the underlying function being called.
*/

// concatates and serializes args
const argsCacheKeySerializer = (...args) => {
  return args.map(JSON.stringify).join('-');
};

const tryGetFromCache = ({ cache, key, logger, name }) => {
  return cache.get(key)
    .catch(error => {
      // we should not error here - but swallow errors here as we don't want to fail
      // if something goes wrong reading from cache
      logger.error({
        message: 'Error accessing cache',
        name,
        key,
        error
      });

      return null;
    });
};

const isLogger = thing =>
  thing && ['debug', 'info', 'warn', 'error'].every(fn => typeof thing[fn] === 'function');

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
    expirationSeconds = 300 // 5 mins
  } = options;

  return (...args) => {
    const start = Date.now();
    const key = cacheKeySerializer.apply(null, args.filter(arg => !isLogger(arg)));
	const contextualLogger = args.find(isLogger);
	if (contextualLogger) {
	  // eslint-disable-next-line
	  logger = contextualLogger;
	}

    return tryGetFromCache({ cache, key, logger, name })
      .then(cachedValue => {
        if (!cachedValue) {
          return fn.apply(null, args)
            .then(result => ({ result, cacheHit: false }));
        }

        return { result: cachedValue, cacheHit: true };
      })
      .then(({ result, cacheHit }) => {
        logger.info({
          name,
          key,
          cacheHit,
          ms: Date.now() - start
        }, ['cache-metrics']);

        // add to cache if this request was not a cache hit, and we got a result (truthy value)
        if (!cacheHit && result) {
          // fire and forget
          cache.set(key, result, expirationSeconds);
        }

        return result;
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
