const StatCard = ({ icon: Icon, label, value, iconBg = "bg-gray-200" }) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl p-4">
      <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-base font-semibold text-gray-900">{value}</p>
      </div>
      <div className={`h-9 w-9 flex items-center justify-center rounded-md ${iconBg} text-gray-700`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
};

export default StatCard;