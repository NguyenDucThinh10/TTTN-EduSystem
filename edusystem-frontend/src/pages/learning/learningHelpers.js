import { ASSIGNMENT_STATUS_LABELS } from '../../constants/assignmentStatus';
import { SUBMISSION_STATUS_LABELS } from '../../constants/submissionStatus';
import { fileHref } from '../../utils/fileUtils';
import { formatDate, toApiDate } from '../../utils/dateUtils';
import { score } from '../../utils/gradeUtils';

export { fileHref, formatDate, score, toApiDate };

export function statusLabel(status) {
  return ASSIGNMENT_STATUS_LABELS[status] || SUBMISSION_STATUS_LABELS[status] || status || 'Moi';
}

export function buildAssignmentDetail(assignmentId, assignments, submissions) {
  const assignment = assignments.find((item) => String(item.id) === String(assignmentId));
  if (!assignment) return null;
  const submission = submissions.find((item) => String(item.assignmentId) === String(assignmentId));
  return {
    assignment,
    submissions: [
      {
        studentId: 3,
        studentName: 'Student Demo',
        submitted: Boolean(submission),
        submission,
      },
    ],
  };
}

export function buildStudentGrades(classId, submissions) {
  const grades = submissions
    .filter((submission) => submission.status === 'GRADED')
    .map((submission) => ({
      id: submission.id,
      submissionId: submission.id,
      assignmentId: submission.assignmentId,
      assignmentTitle: submission.assignmentTitle,
      studentId: submission.studentId,
      studentName: submission.studentName,
      score: submission.score,
      maxScore: 10,
      weightedScore: submission.score,
      feedback: submission.feedback,
      gradedAt: submission.gradedAt,
      gradedBy: 'Teacher Demo',
    }));
  const averageScore = grades.length
    ? grades.reduce((total, grade) => total + Number(grade.score || 0), 0) / grades.length
    : 0;
  return {
    studentId: 3,
    studentName: 'Student Demo',
    classId: Number(classId),
    className: 'IT101 - Lop 1',
    averageScore,
    grades,
  };
}

export function buildClassAnalytics(assignments, submissions) {
  const graded = submissions.filter((submission) => submission.status === 'GRADED');
  const classAverage = graded.length
    ? graded.reduce((total, item) => total + Number(item.score || 0), 0) / graded.length
    : 0;
  return {
    classId: 1,
    className: 'IT101 - Lop 1',
    studentCount: 1,
    assignmentCount: assignments.length,
    classAverage,
    studentProgress: [
      {
        studentId: 3,
        studentName: 'Student Demo',
        classId: 1,
        totalAssignments: assignments.length,
        submittedAssignments: submissions.length,
        gradedAssignments: graded.length,
        completionRate: assignments.length ? (submissions.length / assignments.length) * 100 : 0,
        averageScore: classAverage,
      },
    ],
    assignmentStatistics: assignments.map((assignment) => {
      const assignmentSubmissions = submissions.filter((submission) => submission.assignmentId === assignment.id);
      const assignmentGrades = assignmentSubmissions.filter((submission) => submission.status === 'GRADED');
      const averageScore = assignmentGrades.length
        ? assignmentGrades.reduce((total, item) => total + Number(item.score || 0), 0) / assignmentGrades.length
        : 0;
      return {
        assignmentId: assignment.id,
        assignmentTitle: assignment.title,
        submissionCount: assignmentSubmissions.length,
        gradedCount: assignmentGrades.length,
        averageScore,
        minScore: assignmentGrades.length ? Math.min(...assignmentGrades.map((item) => Number(item.score || 0))) : 0,
        maxScore: assignmentGrades.length ? Math.max(...assignmentGrades.map((item) => Number(item.score || 0))) : 0,
      };
    }),
    scoreDistribution: [],
  };
}
