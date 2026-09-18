import React, { useState } from 'react';
import {
  HeartPulse,
  GraduationCap,
  Sprout,
  HardHat,
  Shield,
  Droplets,
  Zap,
  Home,
  Users,
  Landmark,
  Lock,
  Unlock,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SectorInfo } from '../../types/game';

interface SectorCardProps {
  sector: SectorInfo;
  allocated: number;
  isLocked: boolean;
  onAllocate: (amount: number) => void;
  onToggleLock: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  HeartPulse: <HeartPulse className="w-5 h-5 text-rose-400" />,
  GraduationCap: <GraduationCap className="w-5 h-5 text-indigo-400" />,
  Sprout: <Sprout className="w-5 h-5 text-emerald-400" />,
  HardHat: <HardHat className="w-5 h-5 text-amber-400" />,
  Shield: <Shield className="w-5 h-5 text-blue-400" />,
  Droplets: <Droplets className="w-5 h-5 text-cyan-400" />,
  Zap: <Zap className="w-5 h-5 text-yellow-400" />,
  Home: <Home className="w-5 h-5 text-orange-400" />,
  Users: <Users className="w-5 h-5 text-pink-400" />,
  Landmark: <Landmark className="w-5 h-5 text-purple-400" />
};

export const SectorCard: React.FC<SectorCardProps> = ({
  sector,
  allocated,
  isLocked,
  onAllocate,
  onToggleLock
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const delta = allocated - sector.baseline;
  const deltaPercent = Math.round((delta / sector.baseline) * 100);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLocked) return;
    onAllocate(Number(e.target.value));
  };

  const handleStep = (step: number) => {
    if (isLocked) return;
    const newVal = Math.max(sector.min, Math.min(sector.max, allocated + step));
    onAllocate(newVal);
  };

  // Severity color indicator
  const ratio = allocated / sector.baseline;
  let statusBadge = {
    label: 'BASELINE',
    classes: 'bg-gray-800 text-gray-300 border-gray-700'
  };
  if (ratio <= 0.6) {
    statusBadge = { label: 'ACUTE CRISIS', classes: 'bg-red-950 text-red-300 border-red-700 animate-pulse' };
  } else if (ratio < 0.9) {
    statusBadge = { label: 'DEFICIT CUT', classes: 'bg-amber-950 text-amber-300 border-amber-800' };
  } else if (ratio >= 1.35) {
    statusBadge = { label: 'TRANSFORMATIVE', classes: 'bg-emerald-950 text-emerald-300 border-emerald-700' };
  } else if (ratio > 1.05) {
    statusBadge = { label: 'EXPANDED', classes: 'bg-teal-950 text-teal-300 border-teal-800' };
  }

  return (
    <div
      className={`tactical-panel rounded-xl p-4 sm:p-5 border transition-all duration-200 ${
        isLocked
          ? 'border-amber-900/60 bg-[#0d121a]'
          : ratio <= 0.6
          ? 'border-red-900/60'
          : ratio >= 1.2
          ? 'border-emerald-900/60'
          : 'border-gray-800 hover:border-gray-700'
      }`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#141b25] border border-gray-700/60 flex items-center justify-center shrink-0">
            {ICON_MAP[sector.icon] || <Landmark className="w-5 h-5 text-gray-400" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base font-display">{sector.name}</h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${statusBadge.classes}`}>
                {statusBadge.label}
              </span>
            </div>
            <span className="text-xs text-gray-400 font-mono">
              Baseline: KSh {sector.baseline}B
            </span>
          </div>
        </div>

        {/* Lock button */}
        <button
          onClick={onToggleLock}
          className={`p-1.5 rounded border text-xs flex items-center gap-1 transition ${
            isLocked
              ? 'bg-amber-950/80 text-amber-300 border-amber-700'
              : 'bg-gray-800/60 text-gray-400 border-gray-700 hover:text-white'
          }`}
          title={isLocked ? 'Unlock allocation' : 'Lock allocation during auto-balancing'}
        >
          {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          <span className="text-[10px] font-mono uppercase">{isLocked ? 'Locked' : 'Lock'}</span>
        </button>
      </div>

      {/* Allocation Numeric & Delta Display */}
      <div className="mt-4 flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
            KSh {allocated.toLocaleString()}
          </span>
          <span className="text-sm font-mono text-gray-400 font-semibold">Billion</span>
        </div>

        <div className={`font-mono text-xs font-bold px-2 py-1 rounded ${
          delta > 0
            ? 'text-emerald-400 bg-emerald-950/50 border border-emerald-900/50'
            : delta < 0
            ? 'text-rose-400 bg-rose-950/50 border border-rose-900/50'
            : 'text-gray-400 bg-gray-800/40'
        }`}>
          {delta > 0 ? `+${delta}B (+${deltaPercent}%)` : delta < 0 ? `${delta}B (${deltaPercent}%)` : '0B (0%)'}
        </div>
      </div>

      {/* Slider */}
      <div className="mt-3">
        <input
          type="range"
          min={sector.min}
          max={sector.max}
          step={5}
          value={allocated}
          disabled={isLocked}
          onChange={handleSliderChange}
          className={`w-full ${isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
        />
        <div className="flex justify-between text-[11px] font-mono text-gray-500 mt-1">
          <span>Min: {sector.min}B</span>
          <span className="text-gray-400">Baseline: {sector.baseline}B</span>
          <span>Max: {sector.max}B</span>
        </div>
      </div>

      {/* Quick Adjust Buttons */}
      <div className="mt-3 flex items-center justify-between gap-1.5 pt-2 border-t border-gray-800/60">
        <div className="flex gap-1">
          <button
            type="button"
            disabled={isLocked || allocated <= sector.min}
            onClick={() => handleStep(-50)}
            className="px-2 py-1 bg-[#151c27] hover:bg-gray-700 disabled:opacity-30 rounded text-[11px] font-mono text-gray-300 border border-gray-700/60 transition"
          >
            -50B
          </button>
          <button
            type="button"
            disabled={isLocked || allocated <= sector.min}
            onClick={() => handleStep(-10)}
            className="px-2 py-1 bg-[#151c27] hover:bg-gray-700 disabled:opacity-30 rounded text-[11px] font-mono text-gray-300 border border-gray-700/60 transition"
          >
            -10B
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-[11px] text-gray-400 hover:text-gray-200 flex items-center gap-1 font-mono px-1"
        >
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{showDetails ? 'Hide' : 'Info'}</span>
        </button>

        <div className="flex gap-1">
          <button
            type="button"
            disabled={isLocked || allocated >= sector.max}
            onClick={() => handleStep(10)}
            className="px-2 py-1 bg-[#151c27] hover:bg-gray-700 disabled:opacity-30 rounded text-[11px] font-mono text-gray-300 border border-gray-700/60 transition"
          >
            +10B
          </button>
          <button
            type="button"
            disabled={isLocked || allocated >= sector.max}
            onClick={() => handleStep(50)}
            className="px-2 py-1 bg-[#151c27] hover:bg-gray-700 disabled:opacity-30 rounded text-[11px] font-mono text-gray-300 border border-gray-700/60 transition"
          >
            +50B
          </button>
        </div>
      </div>

      {/* Expanded Sector Details & Risk Warnings */}
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-800 space-y-2 text-xs text-left animate-fadeIn">
          <p className="text-gray-300 leading-relaxed">{sector.description}</p>
          
          <div className="bg-red-950/30 p-2 rounded border border-red-900/40 text-red-300 text-[11px] flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Vulnerability Risk:</span> {sector.riskWarning}
            </div>
          </div>

          <div className="bg-emerald-950/30 p-2 rounded border border-emerald-900/40 text-emerald-300 text-[11px] flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Systemic Synergy:</span> {sector.synergyNotes}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase text-gray-400 block mb-1">Key Programs:</span>
            <div className="flex flex-wrap gap-1">
              {sector.keyPrograms.map((prog, idx) => (
                <span key={idx} className="text-[10px] bg-[#1a2332] text-gray-300 px-2 py-0.5 rounded border border-gray-700/50">
                  {prog}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
