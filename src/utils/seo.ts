import { siteSettings } from '../data/siteSettings';

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  image?: string;
  type?: 'website' | 'article';
  publishDate?: Date;
  updatedDate?: Date;
  tags?: string[];
}

export function buildCanonicalUrl(pathname: string): string {
  const base = siteSettings.siteUrl.replace(/\/$/, '');
  const cleanPath = pathname.replace(/^\//, '').replace(/\/$/, '');
  return cleanPath ? `${base}/${cleanPath}` : base;
}

export function buildSocialImageUrl(imagePath?: string): string {
  const base = siteSettings.siteUrl.replace(/\/$/, '');
  if (!imagePath) {
    return `${base}/og-default.png`;
  }
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  const cleanPath = imagePath.replace(/^\//, '');
  return `${base}/${cleanPath}`;
}

