const KpiCard = ({ icon: Icon, label, value }) => {
  return (
    <div className="bg-[#201D73] border border-[#201D73] rounded-xl shadow-lg p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:border-sky-400/40">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 mb-3">
        <Icon className="h-5 w-5 text-gray-700" />
      </div>
      <p className="text-sm text-white mb-1">{label}</p>
      <p className="text-base font-medium text-white">{value}</p>
    </div>
  );
};

export default KpiCard;
