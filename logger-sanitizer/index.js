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

  // handle strings
  if (typeof(data)==='string') {
    blacklistedLogKeys.forEach((key) => {
      if (data.toLowerCase().includes(key)) {
        data = '[redacted]';
      }
    });
    return data;
  }

  // handle objects
  if (typeof(data)==='object' && data !== null) {
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
  }

  // is another type like boolean or number, return as-is
  return data;
};

module.exports = {
  loggerSanitizer
};