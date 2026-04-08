import { Search, X } from 'lucide-react';

const STATUS_FILTERS = ['All', 'Wishlist', 'Planned', 'Visited'];

const statusStyles = {
  All:      'border-slate-600 text-slate-300 hover:border-slate-400',
  Wishlist: 'border-slate-600 text-slate-300 hover:border-slate-400 data-[active=true]:bg-slate-700 data-[active=true]:border-slate-500 data-[active=true]:text-white',
  Planned:  'border-blue-700/60 text-blue-300 hover:border-blue-500   data-[active=true]:bg-blue-900/50 data-[active=true]:border-blue-500 data-[active=true]:text-blue-200',
  Visited:  'border-emerald-700/60 text-emerald-300 hover:border-emerald-500 data-[active=true]:bg-emerald-900/50 data-[active=true]:border-emerald-500 data-[active=true]:text-emerald-200',
};

export default function FilterBar({ statusFilter, countryFilter, onStatusChange, onCountryChange }) {
  const hasFilters = statusFilter !== 'All' || countryFilter;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Status pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            data-active={statusFilter === s}
            onClick={() => onStatusChange(s)}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${statusStyles[s]} data-[active=true]:bg-indigo-500/20 data-[active=true]:border-indigo-500 data-[active=true]:text-indigo-300`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Country search */}
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Filter by country…"
          value={countryFilter}
          onChange={(e) => onCountryChange(e.target.value)}
          className="input-field pl-9"
        />
        {countryFilter && (
          <button
            onClick={() => onCountryChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Clear all */}
      {hasFilters && (
        <button
          onClick={() => { onStatusChange('All'); onCountryChange(''); }}
          className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-2 transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
