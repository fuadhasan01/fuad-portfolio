import { describe, it, expect } from 'vitest';
import { getReadingTime } from '../../src/utils/readingTime';

describe('getReadingTime', () => {
  it('should return 1 min read for empty or short text', () => {
    expect(getReadingTime('')).toEqual({ text: '1 min read', minutes: 1 });
    expect(getReadingTime('Hello world')).toEqual({ text: '1 min read', minutes: 1 });
  });

  it('should calculate reading time based on 200 words per minute', () => {
    const text200Words = Array(200).fill('word').join(' ');
    expect(getReadingTime(text200Words)).toEqual({ text: '1 min read', minutes: 1 });

    const text450Words = Array(450).fill('word').join(' ');
    expect(getReadingTime(text450Words)).toEqual({ text: '3 min read', minutes: 3 });
  });
});

