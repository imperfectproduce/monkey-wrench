import _isArray from 'lodash/isArray';
import _isPlainObject from 'lodash/isPlainObject';

// Replaces password info in a logging message with ['redacted']
const loggerSanitizer = (data) => {
  
  // define list of keys to sanitize
  const blacklistedLogKeys = ['pass', 'password', 'pw', 'key', 'token'];
  
  // handle arrays
  if (_isArray(data)) {
    return data.map(item => loggerSanitizer(item, blacklistedLogKeys));
  }

  // handle non-objects
  if (!_isPlainObject(data)) return data;

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

export default loggerSanitizer;