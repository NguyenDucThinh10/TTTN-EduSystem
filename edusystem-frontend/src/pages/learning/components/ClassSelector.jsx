import { statusLabel } from '../learningHelpers';

export default function ClassSelector({ classes, selectedClass, selectedClassId, onClassChange }) {
  return (
    <section className="control-strip">
      {classes.length > 0 ? (
        <label>
          Lop hoc
          <select value={selectedClassId} onChange={(event) => onClassChange(event.target.value)}>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} - {item.semester || 'Hoc ky'}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <label>
          Class ID
          <input
            type="number"
            min="1"
            placeholder="Nhap classId, vi du 1"
            value={selectedClassId}
            onChange={(event) => onClassChange(event.target.value)}
          />
        </label>
      )}
      {selectedClass && (
        <div className="class-meta">
          <strong>{selectedClass.courseTitle}</strong>
          <span>{selectedClass.teacherName} | {statusLabel(selectedClass.status)}</span>
        </div>
      )}
    </section>
  );
}
