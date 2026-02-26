import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { detectCrisis } from './crisisDetection.ts';

describe('detectCrisis', () => {
  it('should detect direct crisis keywords', () => {
    assert.strictEqual(detectCrisis('I am thinking about suicide'), true);
    assert.strictEqual(detectCrisis('I want to kill myself'), true);
    assert.strictEqual(detectCrisis('I want to end my life'), true);
    assert.strictEqual(detectCrisis('I don\'t want to live anymore'), true);
    assert.strictEqual(detectCrisis('I want to die'), true);
    assert.strictEqual(detectCrisis('I feel worthless'), true);
    assert.strictEqual(detectCrisis('I feel hopeless'), true);
    assert.strictEqual(detectCrisis('There is no reason to live'), true);
    assert.strictEqual(detectCrisis('I would be better off dead'), true);
    assert.strictEqual(detectCrisis('I am ending it all'), true);
    assert.strictEqual(detectCrisis('I am taking my life'), true);
    assert.strictEqual(detectCrisis('I want to harm myself'), true);
    assert.strictEqual(detectCrisis('I want to hurt myself'), true);
    assert.strictEqual(detectCrisis('I am thinking about self-harm'), true);
    assert.strictEqual(detectCrisis('I have a death wish'), true);
  });

  it('should be case insensitive', () => {
    assert.strictEqual(detectCrisis('SUICIDE'), true);
    assert.strictEqual(detectCrisis('Kill MySelf'), true);
    assert.strictEqual(detectCrisis('i want to DIE'), true);
  });

  it('should detect keywords within sentences', () => {
    assert.strictEqual(detectCrisis('Sometimes I think I am worthless and nobody cares'), true);
    assert.strictEqual(detectCrisis('It feels like I am hopeless in this situation'), true);
  });

  it('should not detect crisis in safe messages', () => {
    assert.strictEqual(detectCrisis('I am feeling happy today'), false);
    assert.strictEqual(detectCrisis('I want to go home'), false);
    assert.strictEqual(detectCrisis('Life is good'), false);
    assert.strictEqual(detectCrisis('I am tired but okay'), false);
    // "kill time" contains "kill" but not "kill myself"
    assert.strictEqual(detectCrisis('I just want to kill time'), false);
  });

  it('should handle edge cases', () => {
    assert.strictEqual(detectCrisis(''), false);
    assert.strictEqual(detectCrisis('   '), false);
  });
});
