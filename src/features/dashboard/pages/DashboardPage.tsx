import { useDashboard } from "../../../api/statistic/hooks";

import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import StatsGrid from "../components/StatsGrid";
import RecentActivities from "../components/RecentActivities";
import CategoryRanking from "../components/CategoryRanking";
import FooterStats from "../components/FooterStats";

const DashboardPage = () => {
  const { summary, categoryRanking, loading, error, fetchDashboard } =
    useDashboard();

  if (loading) {
    return (
  <div className="space-y-8">
    {loading ? (
      <LoadingState />
    ) : error || !summary ? (
      <ErrorState error={error} onRetry={fetchDashboard} />
    ) : (
      <>
        ...
      </>
    )}
  </div>
);
  }
  
  if (error || !summary)
    return <ErrorState error={error} onRetry={fetchDashboard} />;

  return (
      <div className="space-y-8">
        <StatsGrid summary={summary} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RecentActivities />
          <div className="space-y-6">
            {/* <TopLocations /> nope*/}
            <CategoryRanking data={categoryRanking} />
          </div>
        </div>

        <FooterStats />
      </div>
    
  );
};

export default DashboardPage;
