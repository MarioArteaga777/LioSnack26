import StatCard from "./Cards/StatCard";

// Columnas en pantallas grandes según cuántas tarjetas se muestren,
// para que siempre quepan en una sola fila (Tailwind necesita clases literales).
const LG_COLUMNS_BY_COUNT = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

const StatsPanel = ({ stats }) => {
  const lgColumnsClass = LG_COLUMNS_BY_COUNT[stats.length] || LG_COLUMNS_BY_COUNT[3];

  return (
    <div className="bg-gray-100 rounded-2xl p-5 mb-6">
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${lgColumnsClass} gap-4`}>
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default StatsPanel;