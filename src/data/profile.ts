export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface Profile {
  name: string;
  title: string;
  location: string;
  email: string;
  avatarUrl: string;
  heroHeadline: string;
  heroSubhead: string;
  heroSpecialization: string;
  socialLinks: SocialLink[];
  resumeUrl: string;
}

export const profile: Profile = {
  name: 'Fuad Hasan',
  title: 'Full Stack Software Engineer',
  location: 'Dhaka, Bangladesh',
  email: 'contact@fuadhasan.dev',
  avatarUrl: '/images/profile.jpg', // Replace with '/images/profile.jpg' when your photo is ready
  heroHeadline: 'Building reliable systems and thoughtful web experiences.',
  heroSubhead: 'Full Stack Software Engineer focused on C#, ASP.NET Core, Angular, SQL Server, and scalable application architecture.',
  heroSpecialization: 'C# / ASP.NET Core / Angular / PostgreSQL. Enterprise software, maintainable architecture, and practical technical writing.',
  socialLinks: [
    {
      name: 'GitHub',
      url: 'https://github.com/fuadhasan01',
      icon: 'github'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/fuadhasan01',
      icon: 'linkedin'
    },
    {
      name: 'LeetCode',
      url: 'https://leetcode.com/u/fuadhasan01/',
      icon: 'leetcode'
    }
  ],
  resumeUrl: '/resume/Fuad_Hasan_Resume.pdf'
};

