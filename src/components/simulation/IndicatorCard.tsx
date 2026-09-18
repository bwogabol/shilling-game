import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface IndicatorCardProps {
  title: string;
  value: number;
  unit: string;
  baseline: number;
  description: string;
  isInverse?: boolean; // For debt and inflation where lower is better
  min?: number;
  max?: number;
}

export const IndicatorCard: React.FC<IndicatorCardProps> = ({
  title,
  value,
  unit,
  baseline,
  description,
  isInverse = false,
  min = 0,
  max = 100
}) => {
  const delta = Math.round((value - baseline) * 10) / 10;
  const isPositive = isInverse ? delta < 0 : delta > 0;
  const isNeutral = delta === 0;

  // Normalized gauge percentage (0 - 100%)
  const clampedVal = Math.max(min, Math.min(max, value));
  const fillPercent = Math.round(((clampedVal - min) / (max - min)) * 100);

  // Strategic State Assessment (LOW / STABLE / STRONG / EXCEPTIONAL or STABLE / STRAINED / CRITICAL)
  let statusTier = 'STABLE';
  let tierColor = 'text-cyan-400 bg-cyan-950/60 border-cyan-800/80';
  let strokeColor = '#06b6d4'; // cyan-500

  if (isInverse) {
    // For inverted metrics like Public Debt (lower is better, baseline ~68)
    if (value >= 78) {
      statusTier = 'CRITICAL';
      tierColor = 'text-rose-400 bg-rose-950/70 border-rose-800';
      strokeColor = '#f43f5e';
    } else if (value >= 71) {
      statusTier = 'STRAINED';
      tierColor = 'text-amber-400 bg-amber-950/70 border-amber-800';
      strokeColor = '#f59e0b';
    } else if (value <= 60) {
      statusTier = 'EXCEPTIONAL';
      tierColor = 'text-emerald-400 bg-emerald-950/70 border-emerald-800';
      strokeColor = '#10b981';
    } else {
      statusTier = 'STABLE';
      tierColor = 'text-cyan-400 bg-cyan-950/60 border-cyan-800/80';
      strokeColor = '#06b6d4';
    }
  } else {
    // Standard metrics (higher is better)
    if (fillPercent >= 75) {
      statusTier = 'EXCEPTIONAL';
      tierColor = 'text-emerald-400 bg-emerald-950/70 border-emerald-800';
      strokeColor = '#10b981';
    } else if (fillPercent >= 55) {
      statusTier = 'STRONG';
      tierColor = 'text-teal-400 bg-teal-950/60 border-teal-800';
      strokeColor = '#14b8a6';
    } else if (fillPercent >= 40) {
      statusTier = 'STABLE';
      tierColor = 'text-cyan-400 bg-cyan-950/60 border-cyan-800/80';
      strokeColor = '#06b6d4';
    } else if (fillPercent >= 25) {
      statusTier = 'STRAINED';
      tierColor = 'text-amber-400 bg-amber-950/70 border-amber-800';
      strokeColor = '#f59e0b';
    } else {
      statusTier = 'CRITICAL';
      tierColor = 'text-rose-400 bg-rose-950/70 border-rose-800';
      strokeColor = '#f43f5e';
    }
  }

  // Circular gauge calculations (SVG radius 26)
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (fillPercent / 100) * circumference;

  return (
    <div className="tactical-panel rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition flex flex-col justify-between group shadow-lg">
      <div>
        {/* Header with Title and Tier Badge */}
        <div className="flex items-start justify-between gap-1.5 mb-3">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-300 leading-tight">
            {title}
          </span>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-bold uppercase tracking-wide shrink-0 ${tierColor}`}>
            {statusTier}
          </span>
        </div>

        {/* Circular Gauge + Big Numbers Visual Core */}
        <div className="flex items-center justify-between gap-2 my-2">
          {/* Radial Progress Ring */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 -rotate-90 transform" viewBox="0 0 64 64">
              {/* Background track circle */}
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="stroke-gray-800"
                strokeWidth="5"
                fill="transparent"
              />
              {/* Animated Value Ring */}
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke={strokeColor}
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <span className="absolute text-[11px] font-mono font-bold text-gray-300">
              {fillPercent}%
            </span>
          </div>

          {/* Number & Delta Stat */}
          <div className="flex flex-col items-end text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                {value}
              </span>
              <span className="text-xs font-mono text-gray-400 font-semibold">{unit}</span>
            </div>

            <div
              className={`flex items-center gap-1 text-xs font-mono font-bold mt-0.5 px-1.5 py-0.5 rounded ${
                isNeutral
                  ? 'text-gray-400 bg-gray-800/40'
                  : isPositive
                  ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-900/60'
                  : 'text-rose-400 bg-rose-950/60 border border-rose-900/60'
              }`}
            >
              {isNeutral ? (
                <Minus className="w-3 h-3" />
              ) : isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{delta > 0 ? `+${delta}` : delta}</span>
            </div>
          </div>
        </div>

        {/* Segmented Meter Bar (4 segments: Low -> Stable -> Strong -> Exceptional) */}
        <div className="grid grid-cols-4 gap-1 my-2.5">
          <div className={`h-1 rounded-full transition-all ${fillPercent > 10 ? 'bg-cyan-600' : 'bg-gray-800'}`} />
          <div className={`h-1 rounded-full transition-all ${fillPercent >= 35 ? 'bg-cyan-500' : 'bg-gray-800'}`} />
          <div className={`h-1 rounded-full transition-all ${fillPercent >= 60 ? (isInverse ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-gray-800'}`} />
          <div className={`h-1 rounded-full transition-all ${fillPercent >= 80 ? (isInverse ? 'bg-rose-500' : 'bg-emerald-400') : 'bg-gray-800'}`} />
        </div>
      </div>

      {/* Baseline Context Footer */}
      <div className="mt-1 pt-2 border-t border-gray-800/80 flex items-center justify-between text-[10px] font-mono text-gray-400">
        <span className="text-gray-400">Base: {baseline}{unit}</span>
        <span className="truncate ml-1 max-w-[120px] text-right text-gray-400" title={description}>
          {description}
        </span>
      </div>
    </div>
  );
};
