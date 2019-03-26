## RabbitMQ

Shared code for re-use in node.js services.

#### HTTP API

RabbitMQ exposes management and stats over an HTTP API.

[Docs](https://cdn.rawgit.com/rabbitmq/rabbitmq-management/v3.7.11/priv/www/api/index.html)
[Stats Docs](https://cdn.rawgit.com/rabbitmq/rabbitmq-management/v3.7.11/priv/www/doc/stats.html)

The `httpApi.js` is a client exporting functions to consume this HTTP API.
