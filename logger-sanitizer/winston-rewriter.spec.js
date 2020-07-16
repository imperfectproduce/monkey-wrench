const expect = require('expect');
const winstonRewriter = require('./winston-rewriter');

describe('winston-rewriter logging sanitization/redaction', () => {
  it('Should redact blacklisted terms case-insensitively', () => {
	const secrets = {
	  password: { entireObjectWillBe: 'redacted' },
	  safeword: 'banana',
	  deep: {
		nested: [
		  { PasSword: 'secret' }
		]
	  }
	};

	const actual = winstonRewriter('level', 'msg', secrets);
	expect(actual).toEqual({
	  password: '[redacted]',
	  safeword: 'banana',
	  deep: {
		nested: [
		  { PasSword: '[redacted]' }
		]
	  }
	});
  });

  it('Should delegate to custom toJSON behavior', () => {
	class MyError {
	  constructor(message, code) {
		// Fixme(luke): Can't extend an Error class in Babel 6.x.
		Error.call(this, message);
		this.code = code;
		Error.captureStackTrace(this);
	  }

	  toJSON() {
		return `Failed with code(${this.code})`;
	  }
	}

	const err = new MyError('ignored message', 404);
	const actual = winstonRewriter('level', 'msg', err);
	expect(actual).toEqual('Failed with code(404)');
  });

  it.skip('Should include stack trace for errors', () => {
	const err = new Error('msg');
	const actual = winstonRewriter('level', 'msg', err);
	expect(actual.stack).toEqual(expect.stringContaining('\n'));
  });

  it('Should accept circular input', () => {
	const circular = {};
	circular.self = circular;
	circular.child = { parent: circular };

	const actual = winstonRewriter('level', 'msg', circular);
	expect(actual).toEqual({
	  self: '[Circular]',
	  child: {
		parent: '[Circular]'
	  }
	});
  });
});
