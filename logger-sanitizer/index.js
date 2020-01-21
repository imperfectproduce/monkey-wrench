const _isArray = require('lodash/isArray');
const _isPlainObject = require('lodash/isPlainObject');

// Replaces password info in a logging message with ['redacted']
const loggerSanitizer = (data) => {

  // define list of keys to sanitize
  const blacklistedLogKeys = ['pass', 'password', 'pw', 'token', 'credit', 'card', 'cc'];

  // handle arrays
  if (_isArray(data)) {
    return data.map(item => loggerSanitizer(item, blacklistedLogKeys));
  }

  // if non-object, redact if contains any blacklisted keys
  if (!_isPlainObject(data)) {
    try {
      blacklistedLogKeys.forEach((key) => {
        if (data.toLowerCase().includes(key)) data = '[redacted]';
      });
      return data; 
    } catch(err) {
      // some other type - lets redact to be on safe side
      return '[redacted]';
    }
  }

  // handle objects
  return Object.keys(data).reduce((acc, key) => {
    /* eslint-disable no-param-reassign */
    if (blacklistedLogKeys.includes(key.toLowerCase())) {
      acc[key] = '[redacted]';
    } else {
      if (typeof data[key] === 'object' && data[key] !== null) {
        acc[key] = loggerSanitizer(data[key], blacklistedLogKeys);
      } else {
        acc[key] = data[key];
      }
    }
    /* eslint-enable no-param-reassign */
    return acc;
  }, {});
};

module.exports = {
  loggerSanitizer
};