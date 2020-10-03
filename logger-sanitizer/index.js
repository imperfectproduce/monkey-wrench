const traverse = require("traverse");

const isString = v => typeof v === "string"
const isSet = v => v instanceof Set;
const isMap = v => v instanceof Map;
const isError = v => v instanceof Error;
const isSerializer = v => v && typeof v.toJSON === "function";

const REDACTED = '[redacted]';
export const DEFAULT_BLOCK_LIST = ['password', 'creditcard'];

/*
 * Formats a value for logging
 * Original from node-logger
 */
const format = value => {
  // Sets and Maps have no JSON representation, so just iterate their values
  // into an array.
  if (isSet(value)) {
    return [...value];
  }
  if (isMap(value)) {
    return [...value];
  }
  // Errors do not have a JSON representation by default. Ensure that we get a
  // stack trace. Some 3rd-party libraries are kind enough to implement a toJSON
  // method. Use it if it's provided.
  if (isError(value)) {
    const rest = isSerializer(value) ? value.toJSON() : {};
    return Object.assign({
      message: value.message,
      stack: value.stack,
    }, rest);
  }

  return value;
};

/*
 * Replaces blocklisted fields with ['redacted']
 * Adapted from to fix issues of circular references
 * https://github.com/imperfectproduce/node-logger/blob/main/src/sanitizer.ts
 */
const loggerSanitizer = (meta, blocklist = DEFAULT_BLOCK_LIST) => {
  const blockListed = (term) => {
    const normalized = isString(term) ? term.toLowerCase() : term;
    // Does the normalized term contain any blocklisted keys
    return normalized && blocklist.some(b => normalized.includes(b));
  };
  
  if (isString(meta)) {
    return blockListed(meta) ? REDACTED : meta;
  }

  return traverse(meta).forEach(function(v) {
    // Each value in the meta object has exactly one interpretation, as far as
    // serialization is concerned.
    if (blockListed(this.key) || (isString(v) && blockListed(v))) {
      this.update(REDACTED);

    } else if (!!this.circular) {
      this.update("[Circular]");

    } else {
      this.update(format(v));
    }
  });
};

module.exports = {
  loggerSanitizer
};