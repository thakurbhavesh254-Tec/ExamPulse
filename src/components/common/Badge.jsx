import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = ''
}) => {
  const variants = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    brand: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200'
  };

  const dotColors = {
    neutral: 'bg-slate-400',
    brand: 'bg-indigo-500',
    primary: 'bg-blue-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    purple: 'bg-purple-500',
    teal: 'bg-teal-500'
  };

  const sizes = {
    sm: 'text-[10px] font-semibold px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 rounded-md gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 rounded-lg gap-2'
  };

  return (
    <span
      className={`inline-flex items-center border font-medium tracking-tight ${variants[variant] || variants.neutral} ${sizes[size] || sizes.md} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || 'bg-slate-400'}`}
        />
      )}
      {children}
    </span>
  );
};
