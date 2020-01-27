const _isArray = require('lodash/isArray');
const _isString = require('lodash/isString');
const _isObjectLike = require('lodash/isObjectLike');

const REDACTED = '[redacted]';
const BLACKLIST = ['password', 'creditcard'];

// Replaces password info in a logging message with ['redacted']
const loggerSanitizer = (data) => {
  
  // handle arrays
  if (_isArray(data)) {
    return data.map(item => loggerSanitizer(item));
  }

  // handle strings
  if (_isString(data)) {
    const stringContainsBlacklistedKeys = BLACKLIST.some(key => data.toLowerCase().indexOf(key) >= 0);
    return stringContainsBlacklistedKeys ? REDACTED : data;
  }

  // handle objects
  if (_isObjectLike(data)) {
    const objectKeys = Object.keys(data) || [];

    // account for non-plain objects (Map, Set, Date, etc) - for now, redact these edge cases
    if (objectKeys.length === 0) return REDACTED;

    // account for "normal" objects
    return objectKeys.reduce((acc, key) => {
      /* eslint-disable no-param-reassign */
      if (BLACKLIST.includes(key.toLowerCase())) {
        acc[key] = REDACTED;
      } else {
        acc[key] = loggerSanitizer(data[key]);
      }
      /* eslint-enable no-param-reassign */
      return acc;
    }, {});
  }

  // is another type like boolean or number, return as-is
  return data;
};

module.exports = {
  loggerSanitizer
};