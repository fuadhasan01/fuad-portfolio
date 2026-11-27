export interface SkillCategory {
  title: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'Languages',
    skills: ['C#', 'TypeScript', 'SQL', 'JavaScript']
  },
  {
    title: 'Backend Engineering',
    skills: ['ASP.NET Core', 'ASP.NET MVC', 'RESTful APIs', 'Entity Framework Core', 'MediatR', 'FluentValidation']
  },
  {
    title: 'Architecture & Design',
    skills: ['Clean Architecture', 'CQRS', 'DDD', 'MVC', 'OOP', 'Repository Pattern', 'Unit of Work']
  },
  {
    title: 'Frontend Engineering',
    skills: ['Angular', 'RxJS', 'Reactive Forms', 'Bootstrap', 'Tailwind CSS', 'HTML5', 'CSS3']
  },
  {
    title: 'Databases & Storage',
    skills: ['SQL Server', 'PostgreSQL']
  },
  {
    title: 'Authentication & Messaging',
    skills: ['JWT', 'Role-Based Authorization', 'ASP.NET Core Identity', 'MassTransit', 'Outbox Pattern']
  },
  {
    title: 'Tools & Methodologies',
    skills: ['Git', 'Visual Studio', 'VS Code', 'Jira', 'Agile (Scrum)']
  }
];

