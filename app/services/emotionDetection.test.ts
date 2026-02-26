import { describe, it } from 'node:test';
import assert from 'node:assert';
import { detectEmotions, getEmotionBasedSuggestions } from './emotionDetection.ts';

describe('detectEmotions', () => {
  it('should detect anxiety correctly', () => {
    const result = detectEmotions('I am feeling anxious and worried.');
    assert.ok(result.some(e => e.emotion === 'anxiety'));
  });

  it('should detect multiple emotions', () => {
    const result = detectEmotions('I am feeling anxious and also very sad.');
    const emotions = result.map(e => e.emotion);
    assert.ok(emotions.includes('anxiety'));
    assert.ok(emotions.includes('sadness'));
  });

  it('should be case insensitive', () => {
    const result = detectEmotions('I AM FEELING ANXIOUS');
    assert.ok(result.some(e => e.emotion === 'anxiety'));
  });

  it('should handle no emotions detected', () => {
    const result = detectEmotions('I am eating a sandwich.');
    assert.strictEqual(result.length, 0);
  });

  it('should return max 2 emotions', () => {
      const msg = "I am anxious, sad, and angry.";
      const result = detectEmotions(msg);
      assert.ok(result.length <= 2);
  });
});

describe('getEmotionBasedSuggestions', () => {
    it('should return unique tools', () => {
        // "anxious" -> breathing, "stressed" -> breathing. Should return only one breathing tool.
        const msg = "I am anxious and stressed.";
        const result = getEmotionBasedSuggestions(msg);
        const tools = result.map(e => e.tool);
        const uniqueTools = new Set(tools);
        assert.strictEqual(tools.length, uniqueTools.size);
    });
});
