import { connected } from './ui-global';
import assert from 'assert';

describe('Imports Work', () => {
  it('connected function was imported', () => {
    assert(connected);
  });
});
