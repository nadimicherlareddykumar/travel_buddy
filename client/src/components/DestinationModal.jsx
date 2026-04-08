import { useEffect, useRef, useState } from 'react';
import { X, Upload, ImageIcon } from 'lucide-react';
import RatingStars from './RatingStars';

const EMPTY = {
  placeName: '',
  country: '',
  description: '',
  status: 'Wishlist',
  estimatedBudget: '',
  visitedOn: '',
  rating: 0,
};

function toDateInput(iso) {
  if (!iso) return '';
  return iso.slice(0, 10);
}

export default function DestinationModal({ isOpen, onClose, onSubmit, initialData }) {
  const [form, setForm]           = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview]     = useState(null);
  const [error, setError]         = useState('');
  const [saving, setSaving]       = useState(false);
  const fileRef                   = useRef();

  const isEdit = Boolean(initialData?.id);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          placeName:       initialData.placeName || '',
          country:         initialData.country || '',
          description:     initialData.description || '',
          status:          initialData.status || 'Wishlist',
          estimatedBudget: initialData.estimatedBudget ?? '',
          visitedOn:       toDateInput(initialData.visitedOn),
          rating:          initialData.rating ?? 0,
        });
        setPreview(initialData.imageUrl || null);
      } else {
        setForm(EMPTY);
        setPreview(null);
      }
      setImageFile(null);
      setError('');
    }
  }, [isOpen, initialData]);

  function set(key, val) {
    setForm((f) => {
      const next = { ...f, [key]: val };
      // Reset Visited-only fields when status changes away
      if (key === 'status' && val !== 'Visited') {
        next.rating = 0;
        next.visitedOn = '';
      }
      return next;
    });
  }

  function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.placeName.trim() || !form.country.trim()) {
      setError('Place name and country are required.');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== '' && v !== null && v !== undefined) fd.append(k, v);
      });
      if (imageFile) fd.append('image', imageFile);
      await onSubmit(fd, isEdit ? initialData.id : null);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save destination.');
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 flex-shrink-0">
          <h2 className="text-lg font-bold text-white">
            {isEdit ? 'Edit Destination' : 'Add New Destination'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Image upload */}
          <div>
            <label className="label">Cover Image <span className="text-slate-600">(optional)</span></label>
            <div
              onClick={() => fileRef.current?.click()}
              className="relative h-36 border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-xl cursor-pointer transition-colors overflow-hidden flex items-center justify-center bg-slate-800/40 group"
            >
              {preview ? (
                <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-slate-400 transition-colors">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-xs">Click to upload image</span>
                </div>
              )}
              <div className="absolute bottom-2 right-2 bg-black/60 rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </div>

          {/* Row: placeName + country */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Place Name <span className="text-red-400">*</span></label>
              <input className="input-field" placeholder="e.g. Santorini" value={form.placeName} onChange={(e) => set('placeName', e.target.value)} />
            </div>
            <div>
              <label className="label">Country <span className="text-red-400">*</span></label>
              <input className="input-field" placeholder="e.g. Greece" value={form.country} onChange={(e) => set('country', e.target.value)} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <textarea
              rows={3}
              className="input-field resize-none"
              placeholder="A short note about this destination…"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          {/* Row: status + budget */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Status</label>
              <select className="input-field" value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option>Wishlist</option>
                <option>Planned</option>
                <option>Visited</option>
              </select>
            </div>
            <div>
              <label className="label">Budget (INR)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="input-field"
                placeholder="0.00"
                value={form.estimatedBudget}
                onChange={(e) => set('estimatedBudget', e.target.value)}
              />
            </div>
          </div>

          {/* Visited-only fields */}
          {form.status === 'Visited' && (
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-emerald-900/10 border border-emerald-800/30">
              <div>
                <label className="label text-emerald-400">Visited On</label>
                <input
                  type="date"
                  className="input-field"
                  value={form.visitedOn}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => set('visitedOn', e.target.value)}
                />
              </div>
              <div>
                <label className="label text-emerald-400">Rating</label>
                <div className="flex items-center h-10">
                  <RatingStars value={form.rating} onChange={(v) => set('rating', v)} />
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 flex-shrink-0">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Destination'}
          </button>
        </div>
      </div>
    </div>
  );
}
