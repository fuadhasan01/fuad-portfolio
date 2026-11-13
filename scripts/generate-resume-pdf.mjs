import fs from 'fs';
import path from 'path';

function createSanitizedResumePdf() {
  const outputPath = path.resolve('public/resume/Fuad_Hasan_Resume.pdf');
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Construct standard valid PDF 1.4 document
  const lines = [
    'BT',
    '/F1 20 Tf',
    '50 750 Td',
    '(FUAD HASAN) Tj',
    '/F1 12 Tf',
    '0 -20 Td',
    '(Full Stack Software Engineer | Dhaka, Bangladesh) Tj',
    '0 -16 Td',
    '(Email: fuadhasan573@gmail.com | GitHub: github.com/fuadhasan01 | LinkedIn: linkedin.com/in/fuadhasan01) Tj',
    '0 -14 Td',
    '([PUBLIC SANITIZED RESUME - Conforms to Privacy & Security Policies]) Tj',
    '0 -30 Td',
    '/F1 14 Tf',
    '(CORE COMPETENCIES & TECHNICAL SKILLS) Tj',
    '/F1 10 Tf',
    '0 -16 Td',
    '(Backend: C#, .NET 8/9, ASP.NET Core, EF Core, CQRS, DDD, MassTransit, RESTful APIs) Tj',
    '0 -14 Td',
    '(Frontend: Angular, TypeScript, RxJS, Tailwind CSS, HTML5, Semantic Web, Responsive UI) Tj',
    '0 -14 Td',
    '(Databases & DevOps: SQL Server, PostgreSQL, Docker, Git, CI/CD Workflows) Tj',
    '0 -30 Td',
    '/F1 14 Tf',
    '(PROFESSIONAL EXPERIENCE) Tj',
    '/F1 11 Tf',
    '0 -18 Td',
    '(Efficient Software Solutions LTD - Software Engineer (Oct 2025 - Present)) Tj',
    '/F1 10 Tf',
    '0 -14 Td',
    '(- Designed scalable RESTful APIs using ASP.NET Core and Entity Framework Core) Tj',
    '0 -14 Td',
    '(- Implemented asynchronous messaging and outbox patterns using MassTransit) Tj',
    '0 -14 Td',
    '(- Optimized SQL Server queries and EF Core operations to eliminate latency bottlenecks) Tj',
    '0 -14 Td',
    '(- Collaborated on Angular frontend modules with reactive state patterns) Tj',
    '/F1 11 Tf',
    '0 -20 Td',
    '(Pakiza Software LTD - Jr. Software Developer (Oct 2024 - Sep 2025)) Tj',
    '/F1 10 Tf',
    '0 -14 Td',
    '(- Maintained and expanded enterprise ERP solutions using ASP.NET Core and SQL Server) Tj',
    '0 -14 Td',
    '(- Implemented high-precision accounting vouchers with atomic double-entry balance validation) Tj',
    '0 -30 Td',
    '/F1 14 Tf',
    '(SELECTED PROJECTS) Tj',
    '/F1 10 Tf',
    '0 -16 Td',
    '(1. EduSubmit: Full-stack assignment platform with Clean Architecture, CQRS, and JWT auth) Tj',
    '0 -14 Td',
    '(2. LibraryMS: Multi-branch library circulation system with Docker and automated fines) Tj',
    '0 -14 Td',
    '(3. Mini Account Management System: Financial general ledger and voucher accounting) Tj',
    '0 -30 Td',
    '/F1 14 Tf',
    '(EDUCATION & HONORS) Tj',
    '/F1 10 Tf',
    '0 -16 Td',
    '(United International University (UIU) - B.Sc. in Computer Science and Engineering) Tj',
    '0 -14 Td',
    '(CGPA: 3.94 / 4.00 | Honors: Summa Cum Laude | 6 Consecutive Academic Merit Scholarships) Tj',
    'ET'
  ];

  const streamContent = lines.join('\n');
  const streamLength = Buffer.byteLength(streamContent, 'utf-8');

  let pdf = '%PDF-1.4\n';
  const offsets = [];

  // Object 1: Catalog
  offsets.push(Buffer.byteLength(pdf, 'utf-8'));
  pdf += '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';

  // Object 2: Pages
  offsets.push(Buffer.byteLength(pdf, 'utf-8'));
  pdf += '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';

  // Object 3: Page
  offsets.push(Buffer.byteLength(pdf, 'utf-8'));
  pdf += '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n';

  // Object 4: Stream Content
  offsets.push(Buffer.byteLength(pdf, 'utf-8'));
  pdf += `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj\n`;

  // Object 5: Font
  offsets.push(Buffer.byteLength(pdf, 'utf-8'));
  pdf += '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';

  // Xref
  const xrefOffset = Buffer.byteLength(pdf, 'utf-8');
  pdf += 'xref\n';
  pdf += '0 6\n';
  pdf += '0000000000 65535 f \n';
  for (const offset of offsets) {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  }

  // Trailer
  pdf += 'trailer\n';
  pdf += '<< /Size 6 /Root 1 0 R >>\n';
  pdf += 'startxref\n';
  pdf += `${xrefOffset}\n`;
  pdf += '%%EOF\n';

  fs.writeFileSync(outputPath, pdf, 'binary');
  console.log(`✓ Sanitized resume PDF created at ${outputPath} (${pdf.length} bytes)`);
}

createSanitizedResumePdf();

