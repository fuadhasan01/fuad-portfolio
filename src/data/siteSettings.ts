export interface SiteSettings {
  siteUrl: string;
  siteName: string;
  defaultTitle: string;
  defaultDescription: string;
  author: string;
  locale: string;
}

export const siteSettings: SiteSettings = {
  siteUrl: (typeof process !== 'undefined' && process.env?.PUBLIC_SITE_URL) 
    ? process.env.PUBLIC_SITE_URL 
    : 'https://fuadhasan.is-a.dev',
  siteName: 'Fuad Hasan | Portfolio & Blog',
  defaultTitle: 'Fuad Hasan | Full Stack Software Engineer',
  defaultDescription: 'Portfolio and engineering blog of Fuad Hasan, Full Stack Software Engineer focused on C#, ASP.NET Core, Angular, SQL Server, and scalable application architecture.',
  author: 'Fuad Hasan',
  locale: 'en_US'
};

