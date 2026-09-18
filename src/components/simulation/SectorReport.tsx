import React, { useState } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  Flame,
  TrendingUp,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SectorImpact, SectorStatus } from '../../types/game';
import { SECTORS } from '../../data/sectors';

interface SectorReportProps {
  impacts: Record<string, SectorImpact>;
  year: number;
}

const STATUS_CONFIG: Record<SectorStatus, { label: string; badge: string; icon: React.ReactNode }> = {
  crisis: {
    label: 'CRITICAL BREAKDOWN',
    badge: 'bg-red-950 text-red-300 border-red-800 animate-pulse',
    icon: <Flame className="w-3.5 h-3.5 text-red-400" />
  },
  strained: {
    label: 'UNDERFUNDED / STRAINED',
    badge: 'bg-amber-950 text-amber-300 border-amber-800',
    icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
  },
  stable: {
    label: 'EQUILIBRIUM',
    badge: 'bg-gray-800 text-gray-300 border-gray-700',
    icon: <CheckCircle className="w-3.5 h-3.5 text-gray-400" />
  },
  growing: {
    label: 'MODERNIZING & EXPANDING',
    badge: 'bg-teal-950 text-teal-300 border-teal-800',
    icon: <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
  },
  exceptional: {
    label: 'HISTORIC SURPLUS / LEAP',
    badge: 'bg-emerald-950 text-emerald-300 border-emerald-700',
    icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
  }
};

export const SectorReport: React.FC<SectorReportProps> = ({ impacts, year }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white font-display">
            Sector-by-Sector Treasury Assessment
          </h3>
          <p className="text-xs text-gray-400 font-mono">
            Consequences of your allocation decisions at the {year}-Year mark
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SECTORS.map((s) => {
          const impact = impacts[s.id];
          if (!impact) return null;

          const config = STATUS_CONFIG[impact.status] || STATUS_CONFIG.stable;
          const isExpanded = expandedId === s.id;

          return (
            <div
              key={s.id}
              className="tactical-panel rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition cursor-pointer"
              onClick={() => toggleExpand(s.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm font-display">{s.name}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold flex items-center gap-1 ${config.badge}`}>
                      {config.icon}
                      <span>{config.label}</span>
                    </span>
                  </div>
                  <div className="text-xs font-mono text-gray-400 mt-1 flex items-center gap-2">
                    <span>Allocated: <strong className="text-gray-200">KSh {impact.allocated}B</strong></span>
                    <span>•</span>
                    <span className={impact.deltaPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {impact.deltaPercent >= 0 ? `+${impact.deltaPercent}%` : `${impact.deltaPercent}%`} vs baseline
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-300 p-1"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Main Headline */}
              <div className="mt-3 text-xs font-semibold text-gray-200 bg-[#0e141e] p-2.5 rounded border border-gray-800/80">
                "{impact.headline}"
              </div>

              {/* Summary Narrative */}
              <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                {impact.narrative}
              </p>

              {/* Direct Consequences */}
              {impact.consequences && impact.consequences.length > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-800/60 space-y-1">
                  {impact.consequences.map((c, idx) => (
                    <div key={idx} className="text-[11px] font-mono text-gray-300 flex items-start gap-1.5">
                      <span className="text-emerald-400 mt-0.5">▸</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
