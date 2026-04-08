import { Star } from 'lucide-react';

export default function RatingStars({ value = 0, onChange, readOnly = false, size = 'md' }) {
  const sz = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange?.(star)}
          className={`transition-all duration-150 ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-125'}`}
        >
          <Star
            className={`${sz} transition-colors duration-150 ${
              star <= value
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-600 fill-transparent'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
