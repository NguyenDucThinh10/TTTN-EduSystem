import { useState } from 'react';
import FileUpload from '../files/FileUpload';

export default function SubmissionForm({ mode = 'submit', onSubmit, submitting = false }) {
  const [file, setFile] = useState(null);
  return (
    <form className="submission-form" onSubmit={(event) => {
      event.preventDefault();
      onSubmit?.(file);
    }}>
      <FileUpload file={file} onChange={setFile} />
      <button className="primary-action" type="submit" disabled={!file || submitting}>
        {mode === 'resubmit' ? 'Nop lai' : 'Nop bai'}
      </button>
    </form>
  );
}
