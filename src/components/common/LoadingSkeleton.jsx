import React from 'react';

export const LoadingSkeleton = ({
  variant = 'card', // 'card' | 'row' | 'stat' | 'text'
  count = 1,
  className = ''
}) => {
  const items = Array.from({ length: count });

  if (variant === 'stat') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200/80 animate-pulse">
            <div className="h-3 w-20 bg-slate-200 rounded mb-3" />
            <div className="h-7 w-28 bg-slate-300 rounded mb-4" />
            <div className="h-2 w-full bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'row') {
    return (
      <div className="space-y-3">
        {items.map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 animate-pulse">
            <div className="w-10 h-10 rounded-lg bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-slate-300 rounded" />
              <div className="h-3 w-1/2 bg-slate-100 rounded" />
            </div>
            <div className="h-8 w-20 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // Default card
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {items.map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-5 w-24 bg-slate-200 rounded" />
            <div className="h-5 w-16 bg-slate-100 rounded" />
          </div>
          <div className="h-6 w-3/4 bg-slate-300 rounded" />
          <div className="space-y-2 pt-2">
            <div className="h-3 w-full bg-slate-100 rounded" />
            <div className="h-3 w-5/6 bg-slate-100 rounded" />
          </div>
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="h-4 w-20 bg-slate-200 rounded" />
            <div className="h-8 w-24 bg-slate-300 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};
