/* eslint-env mocha */
const expect = require('expect');
const { loggerSanitizer } = require('./index');

const REDACTED = '[redacted-test]';
const BLACKLIST = ['password', 'creditcard'];

describe('Logger messages sanitizer redacts blacklisted passwords, tokens and keys', () => {
  it('Should redact values for all blacklisted (sensitive) keys from log message', () => {
    const testLog = {
      user: 'tester',
      password: '12345',
      data: {
        password: '12345',
        Creditcard: '2345-4242-4242-4242'
      },
      creditCard: '2345-4242-4242-4242',
      happyKey: 'I am a happy key'
    };
    const data = loggerSanitizer(testLog, BLACKLIST, REDACTED);
    expect(data.password).toEqual(REDACTED);
    expect(data.data.password).toEqual(REDACTED);
    expect(data.data.Creditcard).toEqual(REDACTED);
    expect(data.creditCard).toEqual(REDACTED);
  });
  it('Should not redact values for keys not on blacklisted list', () => {
    const testLog = {
      user: 'tester',
      password: '12345',
      happyKey: 'I am a happy key',
      credit: 'order1234'
    };
    const data = loggerSanitizer(testLog, BLACKLIST, REDACTED);
    expect(data.user).toEqual('tester');
    expect(data.credit).toEqual('order1234');
    expect(data.happyKey).toEqual('I am a happy key');
  });
  it('Should redact a string or json value of an object if it contains blacklisted key', () => {
    const testLog = { 
      message: '"{"username":"test","password":"12345"}"' 
    };
    const data = loggerSanitizer(testLog, BLACKLIST, REDACTED);
    expect(data.message).toEqual(REDACTED);
  });
  it('Should redact a string if it contains a blacklisted key', () => {
    const testLog = 'You will never guess my password! It\'s 1234';
    const data = loggerSanitizer(testLog, BLACKLIST, REDACTED);
    expect(data).toEqual(REDACTED);
  });
  it('Should return the string if it doesn\'t contain a blacklisted key', () => {
    const testLog = 'happyString';
    const data = loggerSanitizer(testLog, BLACKLIST, REDACTED);
    expect(data).toEqual('happyString');
  });
  it('Should not filter arrays unless the array value is an object', () => {
    const testLog = [
      'happyValue',
      { user: 'tester', password: '12345' },
      [
        { user: 'tester2', password: '123456' },
        'happyValue2'
      ]
    ];
    const data = loggerSanitizer(testLog, BLACKLIST, REDACTED);
    expect(data[0]).toEqual('happyValue');
    expect(data[1].password).toEqual(REDACTED);
    expect(data[2][0].password).toEqual(REDACTED);
    expect(data[2][1]).toEqual('happyValue2');
  });
  it('Should not redact a number, undefined, null, or boolean', () => {
    const testLog = {
      testNumber: 1234,
      testUndef: undefined,
      testNull: null,
      testBoolean: false
    };
    const data = loggerSanitizer(testLog, BLACKLIST, REDACTED);
    expect(data.testNumber).toEqual(1234);
    expect(data.testUndef).toBeUndefined();
    expect(data.testNull).toBeNull();
    expect(data.testBoolean).toBeFalsy();
  });
});