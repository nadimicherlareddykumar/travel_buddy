import { useState } from 'react';
import { MapPin, IndianRupee, Calendar, Pencil, Trash2, ExternalLink } from 'lucide-react';
import RatingStars from './RatingStars';

const STATUS_CLASS = {
  Wishlist: 'status-wishlist',
  Planned:  'status-planned',
  Visited:  'status-visited',
};

const GRADIENT_MAP = {
  Wishlist: 'from-slate-700 to-slate-800',
  Planned:  'from-blue-900 to-indigo-900',
  Visited:  'from-emerald-900 to-teal-900',
};

function formatBudget(val) {
  if (val == null) return null;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
}

function formatDate(iso) {
  if (!iso) return null;
  return new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(iso));
}

export default function DestinationCard({ destination, onEdit, onDelete }) {
  const { placeName, country, description, status, estimatedBudget, visitedOn, rating, imageUrl } = destination;
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Delete "${placeName}"? This action cannot be undone.`)) return;
    setDeleting(true);
    await onDelete(destination.id);
    setDeleting(false);
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${placeName} ${country}`)}`;

  return (
    <div className="glass-card flex flex-col overflow-hidden hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-300 group">
      {/* Hero image / gradient */}
      <div className={`relative h-44 flex-shrink-0 bg-gradient-to-br ${GRADIENT_MAP[status]}`}>
        {imageUrl ? (
          <img src={imageUrl} alt={placeName} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <MapPin className="w-20 h-20 text-white" />
          </div>
        )}
        {/* Status badge */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_CLASS[status]} backdrop-blur-sm`}>
          {status}
        </span>
        {/* Maps link */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-black/40 hover:bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
          title="View on Google Maps"
        >
          <ExternalLink className="w-3.5 h-3.5 text-white" />
        </a>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <h3 className="text-base font-bold text-white leading-tight truncate">{placeName}</h3>
          <p className="text-sm text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 flex-shrink-0" /> {country}
          </p>
        </div>

        {description && (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{description}</p>
        )}

        <div className="flex flex-col gap-1.5 text-xs text-slate-400 mt-auto">
          {estimatedBudget != null && (
            <span className="flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-medium text-amber-400">{formatBudget(estimatedBudget)}</span>
              <span className="text-slate-600">budget</span>
            </span>
          )}
          {status === 'Visited' && visitedOn && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              <span>{formatDate(visitedOn)}</span>
            </span>
          )}
          {status === 'Visited' && (
            <div className="flex items-center gap-2 pt-0.5">
              <RatingStars value={rating} readOnly size="sm" />
              <span className="text-slate-600">{rating > 0 ? `${rating}/5` : 'Unrated'}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
          <button
            onClick={() => onEdit(destination)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/5 py-2 rounded-lg transition-all duration-200"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
          <div className="w-px h-5 bg-slate-800" />
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" /> {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
