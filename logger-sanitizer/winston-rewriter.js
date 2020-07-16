// winston-rewriter.js
//
// This file exports a function that implements winston's `rewriter` interface,
// which is used to mutate the meta object passed to a logging statement.
//
// Features:
//
// - Blacklist sanitization. Any value whose key appears in the `BLACKLIST`
//   array is redacted.
// - Decycling. Any circular references are removed.
// - JSON enrichment. Maps and Sets are serialized in a lossy but identifiable
//   way. Errors will delegate to the implementation's internal serialization
//   method if it's available; otherwise, the message and stack will be logged.
//
// Usage:
//
// const loggerSanitizer = require('<this module>');
// myWinstonLogger.rewriters.push(loggerSanitizer);

const traverse = require('traverse');

// Blacklist should contain only lowercase words. Sanitizer will case normalize
// when looking up keys.
const BLACKLIST = ['password', 'creditcard'];
const REDACTED = '[redacted]';

function enrichJSON(value) {
  switch (true) {
	case typeof value.toJSON === 'function':
	  return value.toJSON();
	case value instanceof Set:
	  return value.toString();
	case value instanceof Map:
	  return value.toString();
	case value instanceof Error:
	  return {
		message: value.message,
		stack: value.stack
	  };
	default:
	  return value;
  }
}

module.exports = function logSanitizer(level, message, meta) {
  const blackListed = term => term && BLACKLIST.includes(term.toLowerCase());

  return traverse(meta).map(function(v) {
	// Each value in the meta object has exactly one interpretation, as far as
	// serialization is concerned.
	switch (true) {
	  case blackListed(this.key):
		this.update(REDACTED);
		break;
	  case !!this.circular:
		this.update('[Circular]');
		break;
	  default:
		this.update(enrichJSON(v));
	}
  });
};
