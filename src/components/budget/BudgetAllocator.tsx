import React, { useState } from 'react';
import {
  RotateCcw,
  Play,
  CheckCircle,
  AlertTriangle,
  Layers,
  Wand2,
  Sparkles
} from 'lucide-react';
import { SectorCard } from './SectorCard';
import { SECTORS, TOTAL_BUDGET_LIMIT, INITIAL_ALLOCATIONS } from '../../data/sectors';
import { BudgetMap, SectorId, PolicyDoctrine } from '../../types/game';
import { validateBudget } from '../../engine/simulationEngine';

interface BudgetAllocatorProps {
  allocations: BudgetMap;
  lockedSectors: Partial<Record<SectorId, boolean>>;
  doctrine: PolicyDoctrine;
  onUpdateAllocation: (sectorId: SectorId, amount: number) => void;
  onToggleLock: (sectorId: SectorId) => void;
  onResetToBaseline: () => void;
  onAutoBalance: () => void;
  onSimulate: () => void;
}

export const BudgetAllocator: React.FC<BudgetAllocatorProps> = ({
  allocations,
  lockedSectors,
  doctrine,
  onUpdateAllocation,
  onToggleLock,
  onResetToBaseline,
  onAutoBalance,
  onSimulate
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const validation = validateBudget(allocations);
  const { totalAllocated, remaining, isValid } = validation;

  const filteredSectors = filterCategory === 'all'
    ? SECTORS
    : SECTORS.filter(s => s.category === filterCategory);

  const categories = ['all', 'Basic Needs', 'Economic Backbone', 'Social Services', 'State Resilience'];

  // Colors for category progress bar
  const CATEGORY_COLORS: Record<string, string> = {
    'Basic Needs': 'bg-cyan-500',
    'Economic Backbone': 'bg-amber-500',
    'Social Services': 'bg-indigo-500',
    'State Resilience': 'bg-rose-500'
  };

  const isBaseline = Object.keys(INITIAL_ALLOCATIONS).every(
    (key) => Math.abs((allocations[key as keyof typeof INITIAL_ALLOCATIONS] ?? 0) - INITIAL_ALLOCATIONS[key as keyof typeof INITIAL_ALLOCATIONS]) < 1
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* First-Run Teaching Banner: Status Quo vs Active Tradeoffs */}
      {isBaseline && (
        <div className="bg-[#0f1722] border border-amber-600/40 rounded-xl p-4 shadow-lg flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="text-amber-300 font-bold uppercase tracking-wider font-mono">
              Status Quo Allocation Loaded (KSh 3.0T)
            </div>
            <p className="text-gray-300 leading-relaxed">
              Running this baseline produces stability without transformation. To see real impact, unlock sectors, move sliders, and observe how coupled sectors interact (e.g. <strong className="text-emerald-400">Water + Agriculture</strong>, <strong className="text-emerald-400">Infrastructure + Energy</strong>, or <strong className="text-emerald-400">Health + Education</strong>).
            </p>
          </div>
        </div>
      )}

      {/* Sticky Budget Status Command Bar */}
      <div className="tactical-panel rounded-xl p-4 sm:p-5 border border-gray-700 shadow-2xl sticky top-[69px] z-30 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Main Numbers */}
          <div className="flex flex-wrap items-baseline gap-6 sm:gap-8">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-gray-400 block">
                Fictional Budget Target
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono text-gray-200">
                KSh {TOTAL_BUDGET_LIMIT.toLocaleString()} <span className="text-xs text-gray-400 font-semibold">Billion (3.0T)</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-gray-400 block">
                Total Allocated
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono text-white">
                KSh {totalAllocated.toLocaleString()} <span className="text-xs text-gray-400 font-semibold">Billion</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-gray-400 block">
                Budget Variance Status
              </span>
              <div className="flex items-center gap-2">
                {isValid ? (
                  <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    Exact Balance (0 B)
                  </span>
                ) : remaining > 0 ? (
                  <span className="text-xl sm:text-2xl font-black font-mono text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    KSh +{remaining.toLocaleString()} B Left
                  </span>
                ) : (
                  <span className="text-xl sm:text-2xl font-black font-mono text-rose-500 flex items-center gap-1.5">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                    KSh {Math.abs(remaining).toLocaleString()} B Over
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Controls: Auto-Balance, Reset & Simulation Button */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={onAutoBalance}
              disabled={isValid}
              className="px-3.5 py-2 rounded-lg bg-[#192433] hover:bg-[#223145] disabled:opacity-40 text-xs font-mono text-cyan-300 border border-cyan-800/60 flex items-center gap-1.5 transition"
              title="Evenly distribute remaining budget to unlocked sectors"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Auto-Balance</span>
            </button>

            <button
              onClick={onResetToBaseline}
              className="px-3.5 py-2 rounded-lg bg-[#171e27] hover:bg-gray-700 text-xs font-mono text-gray-300 border border-gray-700 flex items-center gap-1.5 transition"
              title="Reset all sectors to standard 3.0T baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Baseline</span>
            </button>

            <button
              onClick={onSimulate}
              disabled={!isValid}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg ${
                isValid
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/70 border border-emerald-400 animate-pulse hover:animate-none'
                  : 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Run Simulation</span>
            </button>
          </div>
        </div>

        {/* Visual Allocation Segmented Progress Bar */}
        <div className="mt-4 pt-3 border-t border-gray-800">
          <div className="h-2.5 w-full bg-gray-900 rounded-full overflow-hidden flex shadow-inner">
            {SECTORS.map((s) => {
              const pct = (allocations[s.id] / TOTAL_BUDGET_LIMIT) * 100;
              const colorClass = CATEGORY_COLORS[s.category] || 'bg-gray-600';
              return (
                <div
                  key={s.id}
                  style={{ width: `${pct}%` }}
                  className={`${colorClass} h-full border-r border-gray-950 transition-all duration-300`}
                  title={`${s.name}: KSh ${allocations[s.id]}B (${Math.round(pct)}%)`}
                />
              );
            })}
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between text-[11px] font-mono text-gray-400 gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span> Basic Needs
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Economic Backbone
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Social Services
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> State Resilience
              </span>
            </div>

            <div>
              <span className="text-gray-400">Rule: </span>
              <span className="font-semibold text-gray-200">Simulation requires exactly KSh 3,000B allocated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills & Directive Reminder */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono uppercase text-gray-500 mr-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Category Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-mono transition ${
                filterCategory === cat
                  ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-600 font-bold'
                  : 'bg-[#121922] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {cat === 'all' ? 'All 10 Sectors' : cat}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-amber-400/90 bg-amber-950/30 px-3 py-1 rounded border border-amber-900/40">
          Doctrine Focus: <span className="font-bold text-amber-300">{doctrine.title.split('(')[0]}</span>
        </div>
      </div>

      {/* Grid of Sector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSectors.map((sector) => (
          <SectorCard
            key={sector.id}
            sector={sector}
            allocated={allocations[sector.id]}
            isLocked={!!lockedSectors[sector.id]}
            onAllocate={(val) => onUpdateAllocation(sector.id, val)}
            onToggleLock={() => onToggleLock(sector.id)}
          />
        ))}
      </div>

      {/* Bottom Sticky Helper Prompt if invalid */}
      {!isValid && (
        <div className="p-4 rounded-xl bg-[#171217] border border-amber-800/60 flex items-center justify-between gap-4 text-xs font-mono text-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {remaining > 0
                ? `You still have KSh ${remaining.toLocaleString()} Billion unallocated. Click 'Auto-Balance' or adjust unlocked sector sliders to enable simulation.`
                : `Budget is exceeded by KSh ${Math.abs(remaining).toLocaleString()} Billion. Reduce spending in unlocked sectors to achieve exact balance.`}
            </span>
          </div>
          <button
            onClick={onAutoBalance}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded text-xs shrink-0 transition"
          >
            Auto-Balance Now
          </button>
        </div>
      )}
    </div>
  );
};
