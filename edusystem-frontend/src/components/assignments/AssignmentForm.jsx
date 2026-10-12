import { useState, useEffect } from 'react';

const initialForm = {
  title: '',
  description: '',
  dueDate: '',
  maxScore: 10,
  fileUrl: '',
};

export default function AssignmentForm({ initialValue, initialValues, onSubmit, submitting = false }) {
  const incomingData = initialValues || initialValue || {};

  const [form, setForm] = useState({
    ...initialForm,
    ...incomingData,
  });
  const [file, setFile] = useState(null);

  // Đồng bộ lại state nếu prop nhận vào thay đổi
  useEffect(() => {
    const data = initialValues || initialValue;
    if (data && data.description !== undefined) {
      setForm((current) => ({
        ...current,
        description: data.description,
      }));
    }
  }, [initialValue, initialValues]);

  const change = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  return (
    <form className="assignment-form" onSubmit={(event) => {
      event.preventDefault();
      onSubmit?.({ payload: form, file });
    }}>
      <label>
        Tiêu đề
        <input name="title" value={form.title || ''} onChange={change} required placeholder="Nhập tiêu đề bài tập..." />
      </label>

      <label>
        Mô tả / Nội dung đề thi
        <textarea 
          name="description" 
          value={form.description || ''} 
          onChange={change} 
          rows={14} 
          placeholder="Nội dung mô tả hoặc đề thi AI sẽ xuất hiện ở đây..."
        />
      </label>

      <label>
        Hạn nộp
        <input name="dueDate" type="datetime-local" value={form.dueDate || ''} onChange={change} />
      </label>

      <label>
        Điểm tối đa
        <input name="maxScore" type="number" min="1" step="0.5" value={form.maxScore || 10} onChange={change} />
      </label>

      <label>
        File/link đề bài
        <input name="fileUrl" value={form.fileUrl || ''} onChange={change} placeholder="https://..." />
      </label>

      <label>
        Upload file đề bài
        <input type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} />
      </label>

      <button className="primary-action" type="submit" disabled={submitting}>
        {submitting ? 'Đang lưu...' : 'Lưu bài tập'}
      </button>
    </form>
  );
}