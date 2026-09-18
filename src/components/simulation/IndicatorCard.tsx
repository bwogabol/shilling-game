import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface IndicatorCardProps {
  title: string;
  value: number;
  unit: string;
  baseline: number;
  description: string;
  isInverse?: boolean; // For debt and inflation where lower is better
}

export const IndicatorCard: React.FC<IndicatorCardProps> = ({
  title,
  value,
  unit,
  baseline,
  description,
  isInverse = false
}) => {
  const delta = Math.round((value - baseline) * 10) / 10;
  const isPositive = isInverse ? delta < 0 : delta > 0;
  const isNeutral = delta === 0;

  // Visual status
  let statusColor = 'text-gray-400';
  let badgeClass = 'bg-gray-800 text-gray-300 border-gray-700';

  if (!isNeutral) {
    if (isPositive) {
      statusColor = 'text-emerald-400';
      badgeClass = 'bg-emerald-950 text-emerald-300 border-emerald-800';
    } else {
      statusColor = 'text-rose-400';
      badgeClass = 'bg-rose-950 text-rose-300 border-rose-800';
    }
  }

  return (
    <div className="tactical-panel rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
          {title}
        </span>

        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${badgeClass}`}>
          {isNeutral ? 'UNCHANGED' : isPositive ? 'IMPROVED' : 'STRAINED'}
        </span>
      </div>

      {/* Main Metric & Delta */}
      <div className="mt-3 flex items-baseline justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {value}
          </span>
          <span className="text-xs font-mono text-gray-400 font-semibold">{unit}</span>
        </div>

        <div className={`flex items-center gap-1 text-xs font-mono font-bold ${statusColor}`}>
          {isNeutral ? (
            <Minus className="w-3.5 h-3.5" />
          ) : isPositive ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          <span>{delta > 0 ? `+${delta}` : delta}</span>
        </div>
      </div>

      {/* Baseline Context & Description */}
      <div className="mt-2 pt-2 border-t border-gray-800/80 flex items-center justify-between text-[11px] font-mono text-gray-400">
        <span>Baseline: {baseline}{unit}</span>
        <span className="text-gray-400 text-right truncate ml-2 max-w-[150px]" title={description}>
          {description}
        </span>
      </div>
    </div>
  );
};
