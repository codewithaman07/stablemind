import { describe, it } from 'node:test';
import assert from 'node:assert';
import { detectCrisis } from './crisisDetection.ts';

describe('Crisis Detection Service', () => {
  describe('detectCrisis', () => {
    it('should detect explicit crisis keywords', () => {
      assert.strictEqual(detectCrisis('I want to kill myself'), true);
      assert.strictEqual(detectCrisis('I am thinking of suicide'), true);
      assert.strictEqual(detectCrisis('I feel worthless'), true);
      assert.strictEqual(detectCrisis('I have no reason to live'), true);
    });

    it('should be case insensitive', () => {
      assert.strictEqual(detectCrisis('I want to KILL MYSELF'), true);
      assert.strictEqual(detectCrisis('Suicide is on my mind'), true);
    });

    it('should not detect crisis in safe messages', () => {
      assert.strictEqual(detectCrisis('I am happy today'), false);
      assert.strictEqual(detectCrisis('Life is good'), false);
      assert.strictEqual(detectCrisis('I need help with my homework'), false);
    });

    it('should avoid false positives for substrings', () => {
      // "skills" contains "kill" (if "kill" was a keyword)
      assert.strictEqual(detectCrisis('I have great skills'), false);
      assert.strictEqual(detectCrisis('He is skilled'), false);

      // "hopelessly" contains "hopeless"
      // Current implementation returns true for this, which is a false positive
      // We expect false after the fix
      assert.strictEqual(detectCrisis('I am hopelessly in love'), false);
    });
  });
});
