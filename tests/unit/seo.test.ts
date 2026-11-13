import { describe, it, expect } from 'vitest';
import { buildCanonicalUrl, buildSocialImageUrl } from '../../src/utils/seo';

describe('SEO Utilities (FR-027, TC-014)', () => {
  it('buildCanonicalUrl generates absolute URLs for root and subpaths', () => {
    expect(buildCanonicalUrl('/')).toBe('https://fuadhasan.is-a.dev');
    expect(buildCanonicalUrl('/blog')).toBe('https://fuadhasan.is-a.dev/blog');
    expect(buildCanonicalUrl('/blog/practical-cqrs-in-dotnet/')).toBe(
      'https://fuadhasan.is-a.dev/blog/practical-cqrs-in-dotnet'
    );
    expect(buildCanonicalUrl('projects/libraryms')).toBe(
      'https://fuadhasan.is-a.dev/projects/libraryms'
    );
  });

  it('buildSocialImageUrl provides fallback to og-default.png when missing', () => {
    expect(buildSocialImageUrl()).toBe('https://fuadhasan.is-a.dev/og-default.png');
    expect(buildSocialImageUrl('')).toBe('https://fuadhasan.is-a.dev/og-default.png');
  });

  it('buildSocialImageUrl handles relative image paths and remote URLs', () => {
    expect(buildSocialImageUrl('/images/blog/cqrs-pattern.svg')).toBe(
      'https://fuadhasan.is-a.dev/images/blog/cqrs-pattern.svg'
    );
    expect(buildSocialImageUrl('images/projects/edusubmit.svg')).toBe(
      'https://fuadhasan.is-a.dev/images/projects/edusubmit.svg'
    );
    expect(buildSocialImageUrl('https://example.com/custom.png')).toBe(
      'https://example.com/custom.png'
    );
  });
});
