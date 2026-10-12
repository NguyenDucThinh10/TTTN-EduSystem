import GradeTable from '../../../components/grades/GradeTable';

export default function GradeManagementPage({ grades = [] }) {
  return <GradeTable grades={grades} />;
}
