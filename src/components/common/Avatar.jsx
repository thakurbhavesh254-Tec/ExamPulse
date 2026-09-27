import React, { useState } from 'react';

export const Avatar = ({
  src,
  name = 'User',
  size = 'md',
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs font-bold',
    lg: 'w-12 h-12 text-sm font-bold',
    xl: 'w-16 h-16 text-lg font-bold'
  };

  const initials = name
    ? name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'BT';

  if (src && !imgError && typeof src === 'string' && src.trim().length > 0) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImgError(true)}
        className={`${sizes[size] || sizes.md} rounded-full object-cover border border-slate-200 shadow-2xs ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size] || sizes.md} rounded-full bg-gradient-to-tr from-indigo-700 via-indigo-600 to-indigo-500 text-white font-bold tracking-tight flex items-center justify-center border border-indigo-400/30 select-none shadow-2xs ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
};
