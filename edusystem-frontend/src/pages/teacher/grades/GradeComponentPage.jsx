import GradeForm from '../../../components/grades/GradeForm';

export default function GradeComponentPage({ grade, onSubmit }) {
  return <GradeForm initialValue={grade} onSubmit={onSubmit} />;
}
