export default function StatsCard({ icon: Icon, label, value, color = 'indigo', subtext }) {
  const variants = {
    indigo:  { glow: 'from-indigo-500 to-indigo-600',  ring: 'bg-indigo-500/10 border-indigo-500/20',  text: 'text-indigo-400' },
    green:   { glow: 'from-emerald-500 to-green-600',   ring: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400' },
    blue:    { glow: 'from-blue-500 to-blue-600',       ring: 'bg-blue-500/10 border-blue-500/20',       text: 'text-blue-400' },
    violet:  { glow: 'from-violet-500 to-violet-600',   ring: 'bg-violet-500/10 border-violet-500/20',   text: 'text-violet-400' },
    amber:   { glow: 'from-amber-500 to-orange-500',    ring: 'bg-amber-500/10 border-amber-500/20',     text: 'text-amber-400' },
  };
  const v = variants[color] || variants.indigo;

  return (
    <div className="relative overflow-hidden glass-card p-6 hover:border-slate-700 transition-all duration-300 group cursor-default">
      {/* Background glow blob */}
      <div className={`absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-br ${v.glow}`} />

      <div className="relative">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border ${v.ring} mb-4 transition-transform duration-200 group-hover:scale-110`}>
          <Icon className={`w-5 h-5 ${v.text}`} />
        </div>
        <p className="text-slate-400 text-sm font-medium mb-0.5">{label}</p>
        <p className="text-3xl font-bold text-white tracking-tight tabular-nums">{value}</p>
        {subtext && <p className="text-slate-500 text-xs mt-1.5">{subtext}</p>}
      </div>
    </div>
  );
}
