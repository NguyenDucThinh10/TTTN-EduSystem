import { useState } from 'react';

const initialForm = {
  title: '',
  description: '',
  dueDate: '',
  maxScore: 10,
  weight: 1,
  fileUrl: '',
};

export default function AssignmentForm({ initialValue = initialForm, onSubmit, submitting = false }) {
  const [form, setForm] = useState({ ...initialForm, ...initialValue });
  const [file, setFile] = useState(null);

  const change = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  return (
    <form className="assignment-form" onSubmit={(event) => {
      event.preventDefault();
      onSubmit?.({ payload: form, file });
    }}>
      <label>Tieu de<input name="title" value={form.title} onChange={change} required /></label>
      <label>Mo ta<textarea name="description" value={form.description} onChange={change} rows="4" /></label>
      <label>Han nop<input name="dueDate" type="datetime-local" value={form.dueDate} onChange={change} /></label>
      <label>Diem toi da<input name="maxScore" type="number" min="1" step="0.5" value={form.maxScore} onChange={change} /></label>
      <label>Trong so<input name="weight" type="number" min="0.1" step="0.1" value={form.weight} onChange={change} /></label>
      <label>File/link de bai<input name="fileUrl" value={form.fileUrl} onChange={change} placeholder="https://..." /></label>
      <label>Upload file de bai<input type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} /></label>
      <button className="primary-action" type="submit" disabled={submitting}>{submitting ? 'Dang luu...' : 'Luu bai tap'}</button>
    </form>
  );
}
