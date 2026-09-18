import React, { useState } from 'react';
import {
  Calendar,
  AlertTriangle,
  Sparkles,
  RotateCcw,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import { SimulationResult } from '../../types/game';
import { INITIAL_ALLOCATIONS } from '../../data/sectors';
import { TrajectoryChart } from './TrajectoryChart';
import { IndicatorCard } from './IndicatorCard';
import { NewsHeadlines } from './NewsHeadlines';
import { SectorReport } from './SectorReport';

interface ResultsViewProps {
  result: SimulationResult;
  onRevise: () => void;
  onNewGame: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  onRevise,
  onNewGame
}) => {
  const [activeYear, setActiveYear] = useState<1 | 5 | 10>(1);

  const currentYearSim = result.years[activeYear];
  const { metrics, headlines, sectorImpacts, systemicTradeoffs, strategicAlerts } = currentYearSim;
  const { score, legacyVerdict, doctrine } = result;

  const GRADE_COLORS: Record<string, string> = {
    'A+': 'text-emerald-400 border-emerald-500 bg-emerald-950/60',
    'A': 'text-emerald-400 border-emerald-500 bg-emerald-950/60',
    'B': 'text-teal-400 border-teal-500 bg-teal-950/60',
    'C': 'text-amber-400 border-amber-500 bg-amber-950/60',
    'D': 'text-orange-400 border-orange-500 bg-orange-950/60',
    'F': 'text-rose-500 border-rose-600 bg-rose-950/60'
  };

  const isBaseline = Object.keys(INITIAL_ALLOCATIONS).every(
    (key) => Math.abs((result.allocations[key as keyof typeof INITIAL_ALLOCATIONS] ?? 0) - INITIAL_ALLOCATIONS[key as keyof typeof INITIAL_ALLOCATIONS]) < 1
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Status Quo Educational Callout for First Run / Baseline */}
      {isBaseline && (
        <div className="bg-gradient-to-r from-amber-950/70 via-[#131b26] to-amber-950/40 border border-amber-600/50 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-bold uppercase tracking-wide border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              STATUS QUO RUN DETECTED
            </div>
            <h3 className="text-lg font-bold text-white font-display">
              Baseline Allocation Preserves Stability, But Limits Transformation
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed max-w-3xl">
              The budget remained at default baseline levels. The country avoided severe bottlenecks and debt shocks, but without concentrated capital, transformative growth remains out of reach. Budget decisions require real tradeoffs.
            </p>
            <p className="text-xs text-emerald-400/90 font-mono pt-1">
              💡 Suggested Next Experiment: Try shifting funds into complementary pairs such as <strong className="text-white">Water + Agriculture</strong>, <strong className="text-white">Infrastructure + Energy</strong>, or <strong className="text-white">Health + Education</strong>.
            </p>
          </div>
          <button
            onClick={onRevise}
            className="shrink-0 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-lg shadow-lg flex items-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Make Strategic Changes</span>
          </button>
        </div>
      )}

      {/* Top Banner: Legacy Verdict & Cabinet Rating */}
      <div className="tactical-panel rounded-xl p-6 sm:p-8 border border-gray-700 shadow-2xl relative overflow-hidden text-left">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-800">
                10-Year Simulation Evaluation
              </span>
              <span className="text-xs font-mono text-gray-400">
                Doctrine: <strong className="text-gray-200">{doctrine.title.split('(')[0]}</strong>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              {legacyVerdict.title}
            </h2>

            <p className="text-sm text-gray-300 leading-relaxed">
              {legacyVerdict.description}
            </p>
          </div>

          {/* Grade Badge & Score Breakdown */}
          <div className="flex items-center gap-4 bg-[#0d141e] p-4 rounded-xl border border-gray-700 shrink-0 w-full lg:w-auto justify-between lg:justify-start">
            <div className="text-center">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                Simulation Grade
              </span>
              <div className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center font-black text-3xl font-display shadow-lg mx-auto mt-1 ${GRADE_COLORS[score.grade] || GRADE_COLORS['C']}`}>
                {score.grade}
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-mono border-l border-gray-700/80 pl-4">
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Economic Resilience:</span>
                <span className="font-bold text-gray-100">{score.economic}/100</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Human Development:</span>
                <span className="font-bold text-gray-100">{score.humanitarian}/100</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Civic Stability:</span>
                <span className="font-bold text-gray-100">{score.stability}/100</span>
              </div>
              <div className="flex justify-between gap-4 pt-1 border-t border-gray-700/60">
                <span className="text-amber-400 font-bold">Overall Rating:</span>
                <span className="font-bold text-amber-300">{score.overall}/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Unintended Consequences Tagged Alert */}
        {legacyVerdict.unintendedConsequences && legacyVerdict.unintendedConsequences.length > 0 && (
          <div className="mt-5 pt-4 border-t border-gray-800/80">
            <span className="text-xs font-mono uppercase font-bold text-gray-400 block mb-2">
              Systemic Tradeoffs & Unintended Side Effects:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {legacyVerdict.unintendedConsequences.map((conseq, idx) => (
                <div key={idx} className="text-xs bg-[#131b26] p-2.5 rounded border border-gray-800 text-gray-300 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{conseq}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Horizon Time Navigator Tabs (1 Year / 5 Years / 10 Years) */}
      <div className="tactical-panel rounded-xl p-3 border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-[69px] z-30 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400 ml-2" />
          <span className="text-xs font-mono uppercase tracking-wider text-gray-300 font-bold">
            Inspection Horizon:
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
          {([1, 5, 10] as const).map((yr) => {
            const isActive = activeYear === yr;
            return (
              <button
                key={yr}
                onClick={() => setActiveYear(yr)}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60 border border-emerald-400'
                    : 'bg-[#101620] text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700'
                }`}
              >
                <span>Year {yr}</span>
                <span className="text-[10px] opacity-75 hidden sm:inline">
                  {yr === 1 ? '(Immediate)' : yr === 5 ? '(Mid-Term)' : '(Generational)'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onRevise}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-xs font-mono border border-gray-700 flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Revise Allocations</span>
          </button>
          <button
            onClick={onNewGame}
            className="px-4 py-2 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-lg text-xs font-mono border border-red-800/80 flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Game</span>
          </button>
        </div>
      </div>

      {/* Cause -> Effect: Systemic Synergy & Bottleneck Alerts for the active horizon */}
      {(systemicTradeoffs.length > 0 || strategicAlerts.length > 0) && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-gray-400">
              Direct Cause & Effect • Structural Feedback
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {systemicTradeoffs.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#0b1b15] border-l-4 border-l-emerald-500 border-y border-r border-emerald-900/60 p-4 rounded-r-xl text-xs text-emerald-100 flex items-start gap-3 shadow-lg hover:bg-[#0e241c] transition"
              >
                <div className="w-6 h-6 rounded bg-emerald-950/80 border border-emerald-700/80 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wide text-emerald-400 block">
                    Synergy Unlocked
                  </span>
                  <span className="leading-relaxed text-emerald-200">{item}</span>
                </div>
              </div>
            ))}
            {strategicAlerts.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#201015] border-l-4 border-l-rose-500 border-y border-r border-rose-900/60 p-4 rounded-r-xl text-xs text-rose-100 flex items-start gap-3 shadow-lg hover:bg-[#28141b] transition"
              >
                <div className="w-6 h-6 rounded bg-rose-950/80 border border-rose-700/80 flex items-center justify-center shrink-0 text-rose-400 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wide text-rose-400 block">
                    Bottleneck / Fiscal Strain
                  </span>
                  <span className="leading-relaxed text-rose-200">{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Macroeconomic & Human Development Indicators */}
      <div>
        <div className="mb-3">
          <h3 className="text-base font-bold text-white font-display">
            National Performance Dashboard • {currentYearSim.yearLabel}
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <IndicatorCard
            title="Real GDP Growth"
            value={metrics.gdpGrowth}
            unit="%"
            baseline={5.2}
            min={0}
            max={10}
            description="Target > 6.0% for rapid poverty reduction"
          />
          <IndicatorCard
            title="Public Debt"
            value={metrics.debtToGdp}
            unit="%"
            baseline={68.0}
            min={40}
            max={90}
            description="IMF threshold caution > 70%"
            isInverse
          />
          <IndicatorCard
            title="Food Security"
            value={metrics.foodSecurity}
            unit="/100"
            baseline={52.0}
            min={0}
            max={100}
            description="Reflects staple reserves & harvest yields"
          />
          <IndicatorCard
            title="Human Dev (HDI)"
            value={metrics.hdi}
            unit="/100"
            baseline={58.0}
            min={0}
            max={100}
            description="Health, longevity, and literacy composite"
          />
          <IndicatorCard
            title="Public Approval"
            value={metrics.publicApproval}
            unit="%"
            baseline={50.0}
            min={0}
            max={100}
            description="Civic trust and satisfaction index"
          />
          <IndicatorCard
            title="Infrastructure"
            value={metrics.infrastructureIndex}
            unit="/100"
            baseline={55.0}
            min={0}
            max={100}
            description="Logistics corridors & power grid stability"
          />
        </div>
      </div>

      {/* Trajectory Projection Chart */}
      <TrajectoryChart
        result={result}
        selectedYear={activeYear}
        onSelectYear={(yr) => setActiveYear(yr)}
      />

      {/* Gazette / Newspaper Dispatches */}
      <NewsHeadlines
        headlines={headlines}
        year={activeYear}
      />

      {/* Sector by Sector Treasury Assessment */}
      <SectorReport
        impacts={sectorImpacts}
        year={activeYear}
      />

      {/* Bottom Sticky Action Toolbar */}
      <div className="pt-6 border-t border-gray-800 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-gray-500 font-mono">
          Session Saved Automatically to Local Browser Storage
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRevise}
            className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-semibold border border-gray-700 flex items-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Revise Budget Allocations</span>
          </button>
          <button
            onClick={onNewGame}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-950/60 border border-emerald-400/40 flex items-center gap-2 transition"
          >
            <span>Start Fresh Decade Run</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
