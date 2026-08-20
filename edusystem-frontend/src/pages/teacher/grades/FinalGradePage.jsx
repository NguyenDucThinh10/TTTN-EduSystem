import GradeSummary from '../../../components/grades/GradeSummary';

export default function FinalGradePage({ averageScore, gradedCount, totalCount }) {
  return <GradeSummary averageScore={averageScore} gradedCount={gradedCount} totalCount={totalCount} />;
}
