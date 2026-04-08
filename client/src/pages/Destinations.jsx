import { useCallback, useEffect, useState } from 'react';
import { Plus, Globe, SlidersHorizontal } from 'lucide-react';
import { destinationsApi } from '../services/api';
import DestinationCard   from '../components/DestinationCard';
import DestinationModal  from '../components/DestinationModal';
import FilterBar         from '../components/FilterBar';

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  // Modal state
  const [modalOpen, setModalOpen]     = useState(false);
  const [editTarget, setEditTarget]   = useState(null);

  // Filters (client-side for instant UX; could be server-side too)
  const [statusFilter,  setStatusFilter]  = useState('All');
  const [countryFilter, setCountryFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await destinationsApi.getAll();
      setDestinations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Filtered view ──────────────────────────────────────────────────────────
  const filtered = destinations.filter((d) => {
    const matchStatus  = statusFilter === 'All' || d.status === statusFilter;
    const matchCountry = !countryFilter || d.country.toLowerCase().includes(countryFilter.toLowerCase());
    return matchStatus && matchCountry;
  });

  // ── CRUD handlers ──────────────────────────────────────────────────────────
  function openAdd()         { setEditTarget(null); setModalOpen(true); }
  function openEdit(dest)    { setEditTarget(dest);  setModalOpen(true); }
  function closeModal()      { setModalOpen(false);  setEditTarget(null); }

  async function handleSubmit(formData, id) {
    if (id) {
      const updated = await destinationsApi.update(id, formData);
      setDestinations((prev) => prev.map((d) => (d.id === id ? updated : d)));
    } else {
      const created = await destinationsApi.create(formData);
      setDestinations((prev) => [created, ...prev]);
    }
  }

  async function handleDelete(id) {
    await destinationsApi.remove(id);
    setDestinations((prev) => prev.filter((d) => d.id !== id));
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">My Destinations</h1>
          <p className="text-slate-500 text-sm mt-1">
            {destinations.length} {destinations.length === 1 ? 'destination' : 'destinations'} total
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Add Destination
        </button>
      </div>

      {/* Filter bar */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
        </div>
        <FilterBar
          statusFilter={statusFilter}
          countryFilter={countryFilter}
          onStatusChange={setStatusFilter}
          onCountryChange={setCountryFilter}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
          {error} —{' '}
          <button onClick={load} className="underline hover:text-red-300">Retry</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
            <Globe className="w-8 h-8 text-indigo-400" />
          </div>
          <p className="text-slate-300 font-semibold mb-1">
            {destinations.length === 0 ? 'No destinations yet' : 'No matches found'}
          </p>
          <p className="text-slate-600 text-sm">
            {destinations.length === 0
              ? 'Start building your bucket list by adding your first destination.'
              : 'Try adjusting your filters.'}
          </p>
          {destinations.length === 0 && (
            <button onClick={openAdd} className="btn-primary mt-5 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Your First Destination
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <>
          <p className="text-xs text-slate-600">
            Showing {filtered.length} of {destinations.length} destinations
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((d) => (
              <DestinationCard
                key={d.id}
                destination={d}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      <DestinationModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        initialData={editTarget}
      />
    </div>
  );
}
