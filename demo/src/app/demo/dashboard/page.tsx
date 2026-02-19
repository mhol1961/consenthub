import MetricCards from "@/components/demo/dashboard/MetricCards";
import ConsentsByTypeChart from "@/components/demo/dashboard/ConsentsByTypeChart";
import MonthlyTrendChart from "@/components/demo/dashboard/MonthlyTrendChart";
import ActivityFeed from "@/components/demo/dashboard/ActivityFeed";

export const metadata = {
  title: "Dashboard — ConsentHub Demo",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Metric cards */}
      <MetricCards />

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ConsentsByTypeChart />
        <MonthlyTrendChart />
      </div>

      {/* Activity feed */}
      <ActivityFeed />
    </div>
  );
}
