function KpiCard({ title, value, subtitle, trend, icon: Icon, color = "sky" }) {
  const colorClasses = {
    sky: "from-sky-500/20 to-blue-600/20 border-sky-500/30",
    emerald: "from-emerald-500/20 to-green-600/20 border-emerald-500/30",
    amber: "from-amber-500/20 to-orange-600/20 border-amber-500/30",
    purple: "from-purple-500/20 to-pink-600/20 border-purple-500/30"
  };

  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${colorClasses[color]} p-6 backdrop-blur-sm`}>
      <div className="flex items-start justify-between mb-4">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </div>
        {Icon && <Icon className="w-5 h-5 text-slate-400" />}
      </div>
      <div className="text-3xl font-bold text-white mb-2">{value}</div>
      {subtitle && (
        <div className="text-sm text-slate-400">{subtitle}</div>
      )}
      {trend && (
        <div className={`text-sm font-medium mt-2 ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
        </div>
      )}
    </div>
  );
}

export default KpiCard;