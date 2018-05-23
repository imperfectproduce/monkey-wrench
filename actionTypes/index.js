export const SUCCEEDED_SUFFIX = 'SUCCEEDED';
export const FAILED_SUFFIX = 'FAILED';

export default function ({ prefixes = {}, suffixes = [SUCCEEDED_SUFFIX, FAILED_SUFFIX] }) {
  return Object.keys(prefixes).reduce((blob, key) => {
    /* eslint-disable no-param-reassign, array-callback-return */
    blob[key] = prefixes[key];
    suffixes.map((suffix) => {
      const otherKey = `${key}_${suffix}`;
      blob[otherKey] = `${prefixes[key]}_${suffix}`;
    });
    return blob;
    /* eslint-enable */
  }, {});
}
