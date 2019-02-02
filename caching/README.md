## Caching

We use redis.  Instructions below use Homebrew on OSX.

###### Install

```sh
$ brew install redis
```

Helpful Reference:
https://gist.github.com/nrollr/eb24336b8fb8e7ba5630

###### Running Locally

Add the following env vars to `.env`.  These are the default values for running locally.
`DISABLE_CACHING` can be omitted, it is a safety net to flip on, effectively busting
the cache, in a pinch.

```
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
DISABLE_CACHING=false
```

```sh
$ brew services start redis # may show already started (and need restart)
$ brew services stop redis
$ brew services restart redis # sometimes needed if service is started but the ping (below) doesn't work
$ redis-cli ping # check if running
```

_Note: The redis client will periodically retry broken connections.  If you don't intend to
use caching, omitting the env vars or disabling is best._

It is possible to connect to AWS ElastiCache locally, but challenging and easier to run a local instance:
https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/accessing-elasticache.html#access-from-outside-aws

###### Cache Eviction Policy

When redis hits its memory limit, it must choose items to evict from the cache to allow new data in.

Good overview: https://redis.io/topics/lru-cache

This is a configuration value at the server level, and is different than an expiration value
set on items written to the cache, which is a client, app-level concern.
