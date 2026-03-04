import { Package, Tag, TrendingUp,User2} from "lucide-react";
import type { DashboardSummary } from "../../../api/statistic/types";
import StatCard from "./StatsCard";

interface Props {
  summary: DashboardSummary;
}

const StatsGrid: React.FC<Props> = ({ summary }) => {
  const stats = [
    {
      title: "Total Aset",
      value: summary.total_asset,
      icon: Package,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Total User",
      value: summary.total_user,
      icon: User2,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Total Kategori",
      value: summary.total_category,
      icon: Tag,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Aset Dipakai",
      value: summary.total_used_asset,
      icon: TrendingUp,
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    // {
    //   title: "Aset Maintenance",
    //   value: summary.total_maintenance_asset,
    //   icon: TrendingUp,
    //   bgColor: "bg-orange-50",
    //   textColor: "text-orange-600",
    // },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
};

export default StatsGrid;
