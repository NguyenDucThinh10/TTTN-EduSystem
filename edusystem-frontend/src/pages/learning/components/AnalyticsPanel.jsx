import { score } from '../learningHelpers';

export default function AnalyticsPanel({ classAnalytics, dashboard }) {
  return (
    <section className="panel wide">
      <div className="panel-heading">
        <h2>Thong ke</h2>
        <span>{classAnalytics?.className || 'Lop hoc'}</span>
      </div>
      <div className="metrics">
        <div><strong>{dashboard?.classCount ?? '-'}</strong><span>Lop</span></div>
        <div><strong>{dashboard?.assignmentCount ?? '-'}</strong><span>Bai tap</span></div>
        <div><strong>{dashboard?.submissionCount ?? '-'}</strong><span>Bai nop</span></div>
        <div><strong>{score(classAnalytics?.classAverage)}</strong><span>Diem TB lop</span></div>
      </div>
      <div className="analytics-columns">
        <div>
          <h3>Tien do sinh vien</h3>
          <div className="compact-list">
            {classAnalytics?.studentProgress?.map((item) => (
              <article key={item.studentId}>
                <strong>{item.studentName}</strong>
                <span>{item.submittedAssignments}/{item.totalAssignments} bai | TB {score(item.averageScore)}</span>
              </article>
            ))}
          </div>
        </div>
        <div>
          <h3>Thong ke bai tap</h3>
          <div className="compact-list">
            {classAnalytics?.assignmentStatistics?.map((item) => (
              <article key={item.assignmentId}>
                <strong>{item.assignmentTitle}</strong>
                <span>{item.submissionCount} nop | {item.gradedCount} cham | TB {score(item.averageScore)}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
