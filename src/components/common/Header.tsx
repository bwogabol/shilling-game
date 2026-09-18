import React from 'react';
import { RotateCcw, ShieldCheck, Scale } from 'lucide-react';
import { PolicyDoctrine } from '../../types/game';

interface HeaderProps {
  administrationName?: string;
  doctrine?: PolicyDoctrine;
  currentScreen: 'landing' | 'setup' | 'allocator' | 'results';
  onReset: () => void;
  onNewGame?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  administrationName,
  doctrine,
  currentScreen,
  onReset,
  onNewGame
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0e15]/95 backdrop-blur-md border-b border-gray-800 shadow-xl">
      <div className="kenya-stripe-bar" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-700 via-stone-900 to-emerald-800 flex items-center justify-center shadow-lg border border-red-500/30">
            <Scale className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-white text-lg font-display uppercase">
                National Budget Lab
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                KENYA 3.0T
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              The Treasury Mandate • Fictional Resource Allocation Simulator
            </p>
          </div>
        </div>

        {/* Administration Info & Badges */}
        {currentScreen !== 'landing' && (
          <div className="flex items-center gap-3 flex-wrap">
            {administrationName && (
              <div className="bg-[#121a24] px-3 py-1.5 rounded-md border border-gray-700/80 flex items-center gap-2 text-xs">
                <span className="text-gray-400 font-mono">ADMIN:</span>
                <span className="font-semibold text-gray-100">{administrationName}</span>
              </div>
            )}

            {doctrine && (
              <div className="bg-[#13221b] px-3 py-1.5 rounded-md border border-emerald-800/60 flex items-center gap-2 text-xs text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-medium truncate max-w-[180px] sm:max-w-none">
                  {doctrine.title.split('(')[0]}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 ml-auto sm:ml-2">
              {currentScreen === 'results' && onReset && (
                <button
                  onClick={onReset}
                  className="flex items-center gap-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded border border-gray-700 transition"
                  title="Modify allocations and re-run"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Revise Budget</span>
                </button>
              )}

              {onNewGame && (
                <button
                  onClick={onNewGame}
                  className="text-xs bg-red-950/60 hover:bg-red-900 text-red-300 px-3 py-1.5 rounded border border-red-800/60 transition font-medium"
                >
                  Restart
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
