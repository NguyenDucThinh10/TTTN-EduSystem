import { fileHref, formatDate, score, statusLabel } from '../learningHelpers';

export default function StudentWorkspace({
  assignments,
  mySubmissions,
  onCancelSubmission,
  onFileChange,
  onResubmit,
  onUpload,
  selectedClass,
  studentGrades,
  submittedByAssignment,
  uploadFiles,
}) {
  return (
    <div className="workspace-grid student-grid">
      <section className="panel wide">
        <div className="panel-heading"><h2>Bai tap cua lop</h2><span>{selectedClass?.name || ''}</span></div>
        <div className="student-assignment-list">
          {assignments.map((assignment) => {
            const submission = submittedByAssignment[assignment.id];
            return (
              <article className="student-assignment" key={assignment.id}>
                <div>
                  <h3>{assignment.title}</h3>
                  <p>{assignment.description || 'Khong co mo ta.'}</p>
                  <span>Han nop: {formatDate(assignment.dueDate)} | Diem: {score(assignment.maxScore)}</span>
                  {assignment.fileUrl && <a href={fileHref(assignment.fileUrl)} target="_blank" rel="noreferrer">Tai de bai</a>}
                </div>
                <div className="submit-box">
                  {submission ? (
                    <>
                      <span className={`badge ${submission.status}`}>{statusLabel(submission.status)}</span>
                      <strong>{submission.score != null ? `${score(submission.score)} diem` : 'Chua cham'}</strong>
                      {submission.fileUrl && <a href={fileHref(submission.fileUrl)} target="_blank" rel="noreferrer">File da nop</a>}
                      <input type="file" onChange={(event) => onFileChange(assignment.id, event.target.files?.[0])} />
                      <button type="button" onClick={() => onResubmit(assignment.id)} disabled={!uploadFiles[assignment.id]}>Nop lai</button>
                      <button type="button" className="danger" onClick={() => onCancelSubmission(submission.id)}>Huy nop</button>
                    </>
                  ) : (
                    <>
                      <input type="file" onChange={(event) => onFileChange(assignment.id, event.target.files?.[0])} />
                      <button type="button" onClick={() => onUpload(assignment.id)} disabled={!uploadFiles[assignment.id]}>Nop bai</button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
          {assignments.length === 0 && <p className="empty">Lop nay chua co bai tap.</p>}
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading"><h2>Bai da nop</h2><span>{mySubmissions.length} bai</span></div>
        <div className="compact-list">
          {mySubmissions.map((submission) => (
            <article key={submission.id}>
              <strong>{submission.assignmentTitle}</strong>
              <span>{formatDate(submission.submittedAt)} | {statusLabel(submission.status)}</span>
              {submission.fileUrl && <a href={fileHref(submission.fileUrl)} target="_blank" rel="noreferrer">Tai file</a>}
            </article>
          ))}
          {mySubmissions.length === 0 && <p className="empty">Ban chua nop bai nao.</p>}
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading"><h2>Diem cua toi</h2><span>TB {score(studentGrades?.averageScore)}</span></div>
        <div className="compact-list">
          {studentGrades?.grades?.map((grade) => (
            <article key={grade.id}>
              <strong>{grade.assignmentTitle}</strong>
              <span>{score(grade.score)} / {score(grade.maxScore)} | {grade.feedback || 'Chua co nhan xet'}</span>
            </article>
          ))}
          {(!studentGrades?.grades || studentGrades.grades.length === 0) && <p className="empty">Chua co diem.</p>}
        </div>
      </section>
    </div>
  );
}
