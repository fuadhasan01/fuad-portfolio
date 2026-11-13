export interface ExperienceItem {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  technologies: string[];
  contributions: string[];
}

export const experiences: ExperienceItem[] = [
  {
    company: 'Efficient Software Solutions LTD',
    role: 'Software Engineer (Full Stack)',
    location: 'Dhaka, Bangladesh',
    startDate: 'Sep 2025',
    endDate: 'Present',
    isCurrent: true,
    technologies: ['C#', 'ASP.NET Core', 'EF Core', 'SQL Server', 'Angular', 'MassTransit', 'RabbitMQ', 'PostgreSQL'],
    contributions: [
      'Designed and developed scalable RESTful APIs using ASP.NET Core and Entity Framework Core.',
      'Implemented asynchronous messaging and the Outbox Pattern using MassTransit for reliable event-driven communication.',
      'Optimized database operations and SQL queries in SQL Server and PostgreSQL, improving API response times.',
      'Built reactive frontend components in Angular integrating with backend REST services.'
    ]
  },
  {
    company: 'Pakiza Software LTD',
    role: 'Jr. Software Developer',
    location: 'Dhaka, Bangladesh',
    startDate: 'Oct 2024',
    endDate: 'Sep 2025',
    isCurrent: false,
    technologies: ['C#', 'ASP.NET MVC', 'SQL Server', 'jQuery', 'AJAX', 'Bootstrap'],
    contributions: [
      'Developed enterprise ERP business modules spanning Merchandising, Accounts, and Inventory workflows.',
      'Wrote and optimized complex SQL stored procedures, views, and functions for enterprise reporting.',
      'Investigated and resolved production issues, improving overall system stability and data integrity.'
    ]
  }
];

