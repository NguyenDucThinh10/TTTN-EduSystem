import { useState } from 'react';

export default function GradeForm({ initialValue = {}, maxScore = 10, onSubmit }) {
  const [values, setValues] = useState({
    score: initialValue.score ?? '',
    feedback: initialValue.feedback ?? '',
  });

  const change = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  return (
    <form className="grade-form" onSubmit={(event) => {
      event.preventDefault();
      onSubmit?.(values);
    }}>
      <label>Diem<input name="score" type="number" min="0" max={maxScore} step="0.5" value={values.score} onChange={change} /></label>
      <label>Nhan xet<input name="feedback" value={values.feedback} onChange={change} /></label>
      <button className="primary-action" type="submit">Luu diem</button>
    </form>
  );
}
