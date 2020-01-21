/* eslint-env mocha */
const expect = require('expect');
const { loggerSanitizer } = require('./index');

describe('Logger messages sanitizer redacts blacklisted passwords, tokens and keys', () => {
  it('Should redact values for all blacklisted (sensitive) keys from log message', () => {
    const testLog = {
      user: 'tester',
      password: '12345',
      data: {
        pass: '12345',
        cc: '2345-4242-4242-4242'
      },
      card: '2345-4242-4242-4242',
      token: '345678',
      happyKey: 'I am a happy key'
    };
    const data = loggerSanitizer(testLog);
    expect(data.password).toEqual('[redacted]');
    expect(data.data.pass).toEqual('[redacted]');
    expect(data.data.cc).toEqual('[redacted]');
    expect(data.card).toEqual('[redacted]');
    expect(data.token).toEqual('[redacted]');
  });
  it('Should not redact values for keys not on blacklisted list', () => {
    const testLog = {
      user: 'tester',
      password: '12345',
      token: '345678',
      happyKey: 'I am a happy key'
    };
    const data = loggerSanitizer(testLog);
    expect(data.user).toEqual('tester');
    expect(data.happyKey).toEqual('I am a happy key');
  });
  it('Should not redact a string', () => {
    const testLog = 'happyString';
    const data = loggerSanitizer(testLog);
    expect(data).toEqual('happyString');
  });
  it('Should not filter arrays unless the array value is an object', () => {
    const testLog = [
      'happyValue',
      { user: 'tester', password: '12345' },
      [
        { user: 'tester2', pass: '123456' },
        'happyValue2'
      ]
    ];
    const data = loggerSanitizer(testLog);
    expect(data[0]).toEqual('happyValue');
    expect(data[1].password).toEqual('[redacted]');
    expect(data[2][0].pass).toEqual('[redacted]');
    expect(data[2][1]).toEqual('happyValue2');
  });
});