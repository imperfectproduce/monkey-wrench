import { connected } from './ui-global';
import assert from 'assert';

// Just testing that mocha is hooked up
describe('Imports Work', () => {
  it('connected function was imported', () => {
    assert(connected);
  });
});
