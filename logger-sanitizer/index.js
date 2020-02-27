const _isArray = require('lodash/isArray');
const _isString = require('lodash/isString');
const _isPlainObject = require('lodash/isPlainObject');
const _isFunction = require('lodash/isFunction');

const REDACTED = '[redacted]';
const BLACKLIST = ['password', 'creditcard'];

// Replaces password info in a logging message with ['redacted']
const loggerSanitizer = (data) => {

  // handle objects
  if (_isPlainObject(data)) {
    const objectKeys = Object.keys(data) || [];
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

   // handle arrays
   if (_isArray(data)) {
    return data.map(item => loggerSanitizer(item));
  }

  // handle strings and various object types 
  const stringifiedData = data && _isFunction(data.toString) ? data.toString() : data; 
  if (_isString(stringifiedData)) {
    const stringContainsBlacklistedKeys = BLACKLIST.some(key => stringifiedData.toLowerCase().indexOf(key) >= 0);
    return stringContainsBlacklistedKeys ? REDACTED : stringifiedData; 
  }

  return data;
};

module.exports = {
  loggerSanitizer
};