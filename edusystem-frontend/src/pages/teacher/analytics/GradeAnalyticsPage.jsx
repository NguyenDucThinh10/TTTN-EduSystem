import ScoreDistributionChart from '../../../components/charts/ScoreDistributionChart';

export default function GradeAnalyticsPage({ distribution = [] }) {
  return <ScoreDistributionChart distribution={distribution} />;
}
