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
    technologies: ['C#', 'ASP.NET Core', 'EF Core', 'SQL Server', 'Angular', 'MassTransit', 'Outbox Pattern', 'PostgreSQL'],
    contributions: [
      'Developed and maintained RESTful APIs using ASP.NET Core, C#, Entity Framework Core, and SQL Server for business applications.',
      'Built asynchronous messaging workflows using MassTransit and the Outbox Pattern to improve reliability of distributed operations.',
      'Optimized EF Core queries and API data retrieval, reducing unnecessary database calls and improving response performance.',
      'Developed Angular applications using Reactive Forms, RxJS, and TypeScript to consume and integrate backend APIs.',
      'Refactored service and data-access layers to improve maintainability, testability, and separation of concerns.'
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
      'Worked on backend development for an enterprise ERP system using ASP.NET MVC and SQL Server, with jQuery/AJAX for frontend integration.',
      'Contributed across Merchandising, Accounts, and Inventory modules, implementing business logic and validations based on requirements.',
      'Optimized SQL queries and database operations to improve application performance and reliability.',
      'Debugged and resolved production issues while maintaining backend stability and data integrity.'
    ]
  }
];

