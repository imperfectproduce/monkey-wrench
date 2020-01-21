const _isArray = require('lodash/isArray');
const _isPlainObject = require('lodash/isPlainObject');

// Replaces password info in a logging message with ['redacted']
const loggerSanitizer = (data) => {

  // define list of keys to sanitize
  const blacklistedLogKeys = ['pass', 'password', 'pw', 'token', 'credit', 'card', 'cc'];

  // handle null/undefined/bool/num
  if (data === null || typeof data==='undefined' || typeof data==='boolean' || typeof data==='number') return data;

  // handle arrays
  if (_isArray(data)) {
    return data.map(item => loggerSanitizer(item, blacklistedLogKeys));
  }

  // if non-object, redact if contains any blacklisted keys
  if (typeof(data)==='string') {
    blacklistedLogKeys.forEach((key) => {
      if (data.toLowerCase().includes(key)) {
        data = '[redacted]';
      }
    });
    return data;
  }

  // handle objects
  return Object.keys(data).reduce((acc, key) => {
    /* eslint-disable no-param-reassign */
    if (blacklistedLogKeys.includes(key.toLowerCase())) {
      acc[key] = '[redacted]';
    } else {
      acc[key] = loggerSanitizer(data[key], blacklistedLogKeys);
    }
    /* eslint-enable no-param-reassign */
    return acc;
  }, {});
};

module.exports = {
  loggerSanitizer
};