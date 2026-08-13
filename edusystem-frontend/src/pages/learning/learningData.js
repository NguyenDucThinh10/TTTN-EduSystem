export const emptyAssignment = {
  title: '',
  description: '',
  dueDate: '',
  maxScore: 10,
  weight: 1,
  fileUrl: '',
};

export const demoClasses = [
  {
    id: 1,
    name: 'IT101 - Lop 1',
    semester: 'Fall 2026',
    status: 'ONGOING',
    courseTitle: 'Lap trinh Java co ban',
    teacherName: 'Teacher Demo',
  },
];

export const demoAssignments = [
  {
    id: 101,
    classId: 1,
    className: 'IT101 - Lop 1',
    title: 'Bai tap OOP',
    description: 'Thiet ke class Student va tinh diem trung binh.',
    fileUrl: 'https://example.com/oop.pdf',
    dueDate: '2026-08-20T23:59:00',
    maxScore: 10,
    weight: 1,
    status: 'PUBLISHED',
    createdAt: '2026-08-10T08:00:00',
    submissionCount: 1,
  },
  {
    id: 102,
    classId: 1,
    className: 'IT101 - Lop 1',
    title: 'Mini project console',
    description: 'Xay dung ung dung quan ly sach bang Java console.',
    fileUrl: '',
    dueDate: '2026-08-28T23:59:00',
    maxScore: 10,
    weight: 1.5,
    status: 'PUBLISHED',
    createdAt: '2026-08-11T08:00:00',
    submissionCount: 0,
  },
];

export const demoSubmissions = [
  {
    id: 501,
    assignmentId: 101,
    assignmentTitle: 'Bai tap OOP',
    studentId: 3,
    studentName: 'Student Demo',
    fileUrl: 'uploads/submissions/demo-oop.zip',
    submittedAt: '2026-08-12T09:30:00',
    isLate: false,
    status: 'GRADED',
    score: 8.5,
    feedback: 'Lam bai tot, can bo sung validate input.',
    gradedAt: '2026-08-13T10:00:00',
  },
];
