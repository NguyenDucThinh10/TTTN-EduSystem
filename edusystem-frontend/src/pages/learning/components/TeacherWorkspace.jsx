import AnalyticsPanel from './AnalyticsPanel';
import { fileHref, formatDate, statusLabel } from '../learningHelpers';

export default function TeacherWorkspace(props) {
  const {
    assignments,
    assignmentDetail,
    classAnalytics,
    dashboard,
    editingId,
    form,
    gradeForms,
    handleAssignmentChange,
    onAssignmentFileChange,
    onCancelEdit,
    onDelete,
    onGrade,
    onSelectAssignment,
    onStartEdit,
    onSubmitAssignmentForm,
    selectedAssignmentId,
    updateGradeForm,
  } = props;

  return (
    <div className="workspace-grid teacher-grid">
      <section className="panel">
        <div className="panel-heading">
          <h2>{editingId ? 'Sua bai tap' : 'Tao bai tap'}</h2>
          {editingId && <button type="button" className="ghost-button" onClick={onCancelEdit}>Huy sua</button>}
        </div>
        <form className="assignment-form" onSubmit={onSubmitAssignmentForm}>
          <label>Tieu de<input name="title" value={form.title} onChange={handleAssignmentChange} required /></label>
          <label>Mo ta<textarea name="description" value={form.description} onChange={handleAssignmentChange} rows="4" /></label>
          <div className="form-row">
            <label>Han nop<input name="dueDate" type="datetime-local" value={form.dueDate} onChange={handleAssignmentChange} /></label>
            <label>Diem toi da<input name="maxScore" type="number" min="1" step="0.5" value={form.maxScore} onChange={handleAssignmentChange} /></label>
          </div>
          <div className="form-row">
            <label>Trong so<input name="weight" type="number" min="0.1" step="0.1" value={form.weight} onChange={handleAssignmentChange} /></label>
            <label>File/link de bai<input name="fileUrl" value={form.fileUrl} onChange={handleAssignmentChange} placeholder="https://..." /></label>
          </div>
          <label>Upload file de bai<input type="file" onChange={(event) => onAssignmentFileChange(event.target.files?.[0] || null)} /></label>
          <button className="primary-action" type="submit">{editingId ? 'Luu thay doi' : 'Tao bai tap'}</button>
        </form>
      </section>

      <section className="panel wide">
        <div className="panel-heading"><h2>Danh sach bai tap</h2><span>{assignments.length} bai</span></div>
        <div className="assignment-list">
          {assignments.map((assignment) => (
            <article className={`assignment-item ${String(selectedAssignmentId) === String(assignment.id) ? 'selected' : ''}`} key={assignment.id}>
              <button type="button" className="assignment-main" onClick={() => onSelectAssignment(assignment.id)}>
                <strong>{assignment.title}</strong>
                <span>{formatDate(assignment.dueDate)} | {assignment.submissionCount || 0} bai nop</span>
              </button>
              <div className="assignment-actions">
                {assignment.fileUrl && <a href={fileHref(assignment.fileUrl)} target="_blank" rel="noreferrer">Tai de</a>}
                <button type="button" onClick={() => onStartEdit(assignment)}>Sua</button>
                <button type="button" className="danger" onClick={() => onDelete(assignment.id)}>Xoa</button>
              </div>
            </article>
          ))}
          {assignments.length === 0 && <p className="empty">Lop nay chua co bai tap.</p>}
        </div>
      </section>

      <section className="panel wide">
        <div className="panel-heading">
          <h2>Bai nop va cham diem</h2>
          <span>{assignmentDetail?.assignment?.title || 'Chon bai tap'}</span>
        </div>
        <div className="submission-table">
          <div className="table-head"><span>Sinh vien</span><span>Trang thai</span><span>Diem</span><span>Feedback</span><span></span></div>
          {assignmentDetail?.submissions?.map((row) => (
            <div className="table-row" key={row.studentId}>
              <span>{row.studentName}</span>
              <span className={`badge ${row.submission?.status || 'missing'}`}>{row.submitted ? statusLabel(row.submission?.status) : 'Chua nop'}</span>
              {row.submission ? (
                <>
                  <input type="number" min="0" step="0.5" value={gradeForms[row.submission.id]?.score ?? ''} onChange={(event) => updateGradeForm(row.submission.id, 'score', event.target.value)} />
                  <input value={gradeForms[row.submission.id]?.feedback ?? ''} onChange={(event) => updateGradeForm(row.submission.id, 'feedback', event.target.value)} placeholder="Nhan xet" />
                  <div className="row-actions">
                    {row.submission.fileUrl && <a href={fileHref(row.submission.fileUrl)} target="_blank" rel="noreferrer">Tai bai</a>}
                    <button type="button" onClick={() => onGrade(row.submission.id)}>Luu diem</button>
                  </div>
                </>
              ) : (
                <><span>-</span><span>-</span><span></span></>
              )}
            </div>
          ))}
          {!assignmentDetail && <p className="empty">Chon mot bai tap de xem danh sach nop bai.</p>}
        </div>
      </section>

      <AnalyticsPanel classAnalytics={classAnalytics} dashboard={dashboard} />
    </div>
  );
}
