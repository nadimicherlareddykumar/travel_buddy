import { useEffect, useState, useCallback } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Globe, CheckCircle2, Bookmark, CalendarCheck, IndianRupee, TrendingUp } from 'lucide-react';
import { destinationsApi } from '../services/api';
import StatsCard from '../components/StatsCard';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const CHART_DEFAULTS = {
  plugins: {
    legend: {
      labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } },
    },
  },
};

export default function Dashboard() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading]           = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await destinationsApi.getAll();
      setDestinations(data);
    } catch (_) {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Stats
  const visited  = destinations.filter((d) => d.status === 'Visited');
  const planned  = destinations.filter((d) => d.status === 'Planned');
  const wishlist = destinations.filter((d) => d.status === 'Wishlist');
  const totalBudgetPlanned = planned.reduce((s, d) => s + (d.estimatedBudget || 0), 0);
  const totalBudgetAll     = destinations.reduce((s, d) => s + (d.estimatedBudget || 0), 0);
  const avgRating =
    visited.filter((d) => d.rating > 0).length > 0
      ? (visited.filter((d) => d.rating > 0).reduce((s, d) => s + d.rating, 0) /
          visited.filter((d) => d.rating > 0).length).toFixed(1)
      : '—';

  // ── Doughnut chart: status breakdown
  const doughnutData = {
    labels: ['Visited', 'Planned', 'Wishlist'],
    datasets: [{
      data: [visited.length, planned.length, wishlist.length],
      backgroundColor: ['rgba(52,211,153,0.8)', 'rgba(96,165,250,0.8)', 'rgba(100,116,139,0.7)'],
      borderColor:     ['rgba(52,211,153,1)',   'rgba(96,165,250,1)',   'rgba(100,116,139,1)'],
      borderWidth: 1,
      hoverOffset: 6,
    }],
  };

  // ── Bar chart: budget by top-8 countries
  const budgetByCountry = destinations
    .filter((d) => d.estimatedBudget)
    .reduce((acc, d) => { acc[d.country] = (acc[d.country] || 0) + d.estimatedBudget; return acc; }, {});
  const topCountries = Object.entries(budgetByCountry)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const barData = {
    labels: topCountries.map(([c]) => c),
    datasets: [{
      label: 'Budget (INR)',
      data: topCountries.map(([, v]) => v),
      backgroundColor: 'rgba(99,102,241,0.7)',
      borderColor:     'rgba(99,102,241,1)',
      borderWidth: 1,
      borderRadius: 6,
    }],
  };

  const barOptions = {
    ...CHART_DEFAULTS,
    responsive: true,
    plugins: {
      ...CHART_DEFAULTS.plugins,
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
      y: { ticks: { color: '#64748b', callback: (v) => `₹${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}` }, grid: { color: '#1e293b' } },
    },
  };

  // ── Recent 5 destinations
  const recent = [...destinations].slice(0, 5);

  const STATUS_DOT = { Visited: 'bg-emerald-400', Planned: 'bg-blue-400', Wishlist: 'bg-slate-500' };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Your travel journey at a glance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={CheckCircle2}  label="Places Visited"   value={visited.length}   color="green"  subtext="completed trips" />
        <StatsCard icon={Bookmark}      label="Wishlist"         value={wishlist.length}  color="indigo" subtext="dream destinations" />
        <StatsCard icon={CalendarCheck} label="Trips Planned"    value={planned.length}   color="blue"   subtext="upcoming adventures" />
        <StatsCard icon={IndianRupee}    label="Planned Budget"   value={`₹${totalBudgetPlanned >= 1000 ? (totalBudgetPlanned/1000).toFixed(1)+'k' : totalBudgetPlanned.toFixed(0)}`}  color="amber"  subtext="total planned spend" />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard icon={Globe}       label="Total Destinations" value={destinations.length} color="violet" />
        <StatsCard icon={IndianRupee}  label="Overall Budget"     value={`₹${totalBudgetAll >= 1000 ? (totalBudgetAll/1000).toFixed(1)+'k' : totalBudgetAll.toFixed(0)}`} color="amber" />
        <StatsCard icon={TrendingUp}  label="Avg Rating"         value={avgRating} color="green" subtext="across visited places" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doughnut */}
        <div className="glass-card p-6 flex flex-col">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Status Breakdown</h2>
          {destinations.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-600 text-sm">No data yet</div>
          ) : (
            <div className="flex-1 flex items-center justify-center" style={{ maxHeight: 230 }}>
              <Doughnut
                data={doughnutData}
                options={{
                  ...CHART_DEFAULTS,
                  cutout: '68%',
                  plugins: {
                    ...CHART_DEFAULTS.plugins,
                    legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 16, font: { size: 12, family: 'Inter' } } },
                  },
                }}
              />
            </div>
          )}
        </div>

        {/* Bar */}
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Budget by Country (Top 8)</h2>
          {topCountries.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-600 text-sm">No budget data yet</div>
          ) : (
            <Bar data={barData} options={barOptions} />
          )}
        </div>
      </div>

      {/* Recent destinations */}
      {recent.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Recent Destinations</h2>
          <div className="divide-y divide-slate-800">
            {recent.map((d) => (
              <div key={d.id} className="flex items-center gap-4 py-3">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[d.status]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{d.placeName}</p>
                  <p className="text-xs text-slate-500">{d.country}</p>
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border ${d.status === 'Visited' ? 'status-visited' : d.status === 'Planned' ? 'status-planned' : 'status-wishlist'}`}>
                  {d.status}
                </span>
                {d.estimatedBudget && (
                  <span className="text-xs text-amber-400 font-medium tabular-nums">
                    ₹{d.estimatedBudget.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
