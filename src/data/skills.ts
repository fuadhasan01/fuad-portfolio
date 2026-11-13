export interface SkillCategory {
  title: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'Languages & Backend',
    skills: ['C#', '.NET 8 / 9', 'ASP.NET Core', 'Entity Framework Core', 'ASP.NET MVC', 'REST APIs', 'CQRS', 'MassTransit']
  },
  {
    title: 'Frontend Engineering',
    skills: ['Angular', 'TypeScript', 'RxJS', 'JavaScript', 'HTML5', 'CSS3 / Tailwind', 'Bootstrap']
  },
  {
    title: 'Database Systems',
    skills: ['Microsoft SQL Server', 'PostgreSQL', 'T-SQL', 'Query Optimization', 'Database Indexing']
  },
  {
    title: 'Architecture & Tools',
    skills: ['Clean Architecture', 'Domain-Driven Design (DDD)', 'Docker', 'Git / GitHub', 'CI/CD Pipelines']
  }
];

