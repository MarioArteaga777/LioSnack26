import StatCard from "./StatCard";

const StatsPanel = ({ stats }) => {
  return (
    <div className="bg-gray-100 rounded-2xl p-5 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default StatsPanel;