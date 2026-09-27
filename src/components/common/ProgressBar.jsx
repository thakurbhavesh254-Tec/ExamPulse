import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  valueText,
  color = 'bg-indigo-600',
  trackColor = 'bg-slate-100',
  height = 'h-2',
  showPercent = false,
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100))) || 0;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {(label || valueText || showPercent) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-medium text-slate-700">{label}</span>}
          <span className="font-semibold text-slate-900 ml-auto">
            {valueText || (showPercent ? `${percentage}%` : `${value}/${max}`)}
          </span>
        </div>
      )}

      <div className={`w-full ${trackColor} rounded-full overflow-hidden ${height}`}>
        <div
          className={`${color} ${height} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
