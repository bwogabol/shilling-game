import React from 'react';
import { Play, RotateCcw, AlertTriangle, TrendingUp, Cpu, HeartHandshake } from 'lucide-react';
import { SECTORS } from '../../data/sectors';

interface LandingScreenProps {
  hasSavedGame: boolean;
  onStartNew: () => void;
  onResume: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  hasSavedGame,
  onStartNew,
  onResume
}) => {
  return (
    <div className="min-h-[calc(100vh-65px)] bg-tactical-grid flex flex-col justify-between">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-mono font-semibold tracking-wider mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          FICTIONAL SIMULATION • JAMHURI YA KENYA
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-display uppercase">
          National <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400">Budget Lab</span>
        </h1>

        <p className="mt-4 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          You are appointed Cabinet Secretary for the National Treasury. You have a fictional national budget of{' '}
          <span className="text-amber-400 font-bold underline decoration-amber-500/50">KSh 3.0 Trillion</span>.
          Every shilling allocated creates winners, losers, and compounding systemic tradeoffs.
        </p>

        {/* Status Quo Teaching Hint */}
        <p className="mt-3 text-sm text-gray-500 max-w-2xl mx-auto">
          The default allocation is the <span className="text-amber-400 font-semibold">Status Quo</span> — it keeps the country stable, but produces little transformation.
          Try shifting budget between sectors to discover synergies: <span className="text-emerald-400 font-mono">Water + Agriculture</span>, <span className="text-emerald-400 font-mono">Infrastructure + Energy</span>, <span className="text-emerald-400 font-mono">Health + Education</span>.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onStartNew}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-lg shadow-xl shadow-emerald-950/60 border border-emerald-400/40 flex items-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Begin Budget Allocation</span>
          </button>

          {hasSavedGame && (
            <button
              onClick={onResume}
              className="px-8 py-4 bg-[#141d28] hover:bg-[#1c2938] text-gray-200 rounded-lg font-bold text-lg border border-gray-700 flex items-center gap-3 transition"
            >
              <RotateCcw className="w-5 h-5 text-amber-400" />
              <span>Resume Saved Session</span>
            </button>
          )}
        </div>

        {/* Strategic Pillars Overview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="tactical-panel p-6 rounded-xl border border-gray-800">
            <div className="w-10 h-10 rounded bg-red-950/80 border border-red-800/60 flex items-center justify-center mb-4 text-red-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">1, 5 & 10 Year Horizons</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Immediate short-term appeasement often triggers devastating 10-year debt traps. Watch how your decisions compound through structural evolution and generational legacies.
            </p>
          </div>

          <div className="tactical-panel p-6 rounded-xl border border-gray-800">
            <div className="w-10 h-10 rounded bg-amber-950/80 border border-amber-800/60 flex items-center justify-center mb-4 text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Nonlinear System Dynamics</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Pumping billions into agriculture fails without water irrigation dams. Huge highways become empty white elephants without industrial power. Discover real systemic feedback loops.
            </p>
          </div>

          <div className="tactical-panel p-6 rounded-xl border border-gray-800">
            <div className="w-10 h-10 rounded bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center mb-4 text-emerald-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Exact 3.0T Conservation</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              No infinite deficit printing. Every boost to one sector requires conscious cuts to another. Experience the genuine tension and discipline of national governance.
            </p>
          </div>
        </div>

        {/* Sector Showcase Grid */}
        <div className="mt-14 pt-10 border-t border-gray-800/80">
          <h2 className="text-xs uppercase font-mono tracking-widest text-gray-400 mb-6">
            The 10 National Portfolios Under Your Direct Command
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {SECTORS.map((s) => (
              <div
                key={s.id}
                className="bg-[#111721] p-3 rounded-lg border border-gray-800/80 text-center hover:border-gray-700 transition"
              >
                <div className="text-xs font-semibold text-gray-200 truncate">{s.name.split('&')[0]}</div>
                <div className="text-[11px] font-mono text-emerald-400 mt-1">KSh {s.baseline}B Baseline</div>
              </div>
            ))}
          </div>
        </div>

        {/* Fictional Disclaimer Alert */}
        <div className="mt-12 bg-amber-950/30 border border-amber-800/40 rounded-lg p-4 text-xs text-amber-300/90 flex items-start gap-3 text-left max-w-3xl mx-auto">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">SIMULATION DISCLAIMER:</span> This is a strategic game and educational simulation with fictionalized mechanics and numbers. It is designed to demonstrate policy tradeoffs and systems thinking, not as an official forecast by the Government of Kenya or National Treasury.
          </div>
        </div>
      </div>

      {/* Footer info */}
      <footer className="border-t border-gray-800/80 py-4 text-center text-xs text-gray-500 font-mono">
        National Budget Lab • Open Strategy Prototype • Zero-Cost Client Simulation
      </footer>
    </div>
  );
};
