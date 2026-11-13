/**
 * Calculate estimated reading time in minutes from raw text.
 * Standard average reading speed: 200 words per minute.
 */
export function getReadingTime(text: string): { text: string; minutes: number } {
  if (!text || typeof text !== 'string') {
    return { text: '1 min read', minutes: 1 };
  }

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return {
    text: `${minutes} min read`,
    minutes
  };
}

