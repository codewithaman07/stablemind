import { test } from 'node:test';
import assert from 'node:assert';
import { getEmotionBasedSuggestions } from './emotionDetection.ts';

test('getEmotionBasedSuggestions - happy path (multi-keyword)', () => {
  // "I am anxious, worried and scared" -> 3 keywords. Should detect anxiety -> breathing.
  const result = getEmotionBasedSuggestions('I am anxious, worried and scared');
  assert.ok(result.length > 0, 'Should return suggestions');
  assert.equal(result[0].tool, 'breathing', 'Should suggest breathing tool');
});

test('getEmotionBasedSuggestions - deduplication', () => {
  // "I am anxious and stressed" -> anxiety (breathing) + stress (breathing).
  // Should return only 1 breathing suggestion.
  const result = getEmotionBasedSuggestions('I am anxious and stressed');
  assert.equal(result.length, 1, 'Should return exactly 1 suggestion due to deduplication');
  assert.equal(result[0].tool, 'breathing', 'Should suggest breathing tool');
});

test('getEmotionBasedSuggestions - single keyword (strictness fix)', () => {
  // "I am anxious" -> 1 keyword. With fixed confidence logic, this should be detected.
  const result = getEmotionBasedSuggestions('I am anxious');
  assert.equal(result.length, 1, 'Should return suggestion for clear single keyword');
  assert.equal(result[0].tool, 'breathing', 'Should suggest breathing tool');
});

test('getEmotionBasedSuggestions - no match', () => {
  const result = getEmotionBasedSuggestions('Hello world');
  assert.equal(result.length, 0, 'Should return no suggestions for neutral text');
});
