import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteSettings } from '../data/siteSettings';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => data.published);
  const sortedPosts = posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  return rss({
    title: siteSettings.siteName,
    description: siteSettings.defaultDescription,
    site: context.site || siteSettings.siteUrl,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.excerpt,
      link: `/blog/${post.id}`
    })),
    customData: `<language>en-us</language>`
  });
}

