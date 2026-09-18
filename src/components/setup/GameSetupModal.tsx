import React, { useState } from 'react';
import { ShieldCheck, ChevronRight, BookOpen, User, Sparkles } from 'lucide-react';
import { POLICY_DOCTRINES } from '../../data/doctrines';
import { PolicyDoctrineId } from '../../types/game';

interface GameSetupModalProps {
  initialName?: string;
  initialDoctrineId?: PolicyDoctrineId;
  onConfirm: (name: string, doctrineId: PolicyDoctrineId) => void;
  onCancel: () => void;
}

export const GameSetupModal: React.FC<GameSetupModalProps> = ({
  initialName = 'Executive Office of the President',
  initialDoctrineId = 'balanced',
  onConfirm,
  onCancel
}) => {
  const [adminName, setAdminName] = useState(initialName);
  const [selectedDoctrine, setSelectedDoctrine] = useState<PolicyDoctrineId>(initialDoctrineId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim()) return;
    onConfirm(adminName.trim(), selectedDoctrine);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="tactical-panel w-full max-w-3xl rounded-xl border border-gray-700 shadow-2xl p-6 sm:p-8 my-8 relative text-left">
        <div className="flex items-center gap-3 border-b border-gray-800 pb-4 mb-6">
          <div className="w-9 h-9 rounded bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-wide text-white">
              Simulation Setup
            </h2>
            <p className="text-xs font-mono text-gray-400">
              National Budget Lab • Fictional 10-Year Kenya Fiscal Simulation
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Administration Title Input */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300 mb-2 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-amber-400" />
              Administration Title / Cabinet Secretary Name
            </label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="e.g. 5th Administration Economic Council"
              className="w-full bg-[#0d141e] border border-gray-700 rounded-lg px-4 py-3 text-white font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              required
            />
          </div>

          {/* Strategic Doctrine Selection */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300 mb-2 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Choose Your National Development Doctrine
            </label>
            <p className="text-xs text-gray-400 mb-4">
              Your chosen doctrine grants specialized economic multipliers and shapes systemic outcomes.
            </p>

            <div className="grid grid-cols-1 gap-3 max-h-[340px] overflow-y-auto pr-1">
              {POLICY_DOCTRINES.map((d) => {
                const isSelected = selectedDoctrine === d.id;
                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDoctrine(d.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#11221b] border-emerald-500 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                        : 'bg-[#0f151f] border-gray-800 hover:border-gray-700 hover:bg-[#131b26]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-sm ${isSelected ? 'text-emerald-300' : 'text-gray-200'}`}>
                            {d.title}
                          </span>
                        </div>
                        <p className="text-xs text-amber-400/90 font-mono mt-0.5">{d.tagline}</p>
                        <p className="text-xs text-gray-400 mt-2 leading-relaxed">{d.description}</p>
                      </div>

                      <div className="shrink-0 mt-1">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-500 text-black'
                              : 'border-gray-600'
                          }`}
                        >
                          {isSelected && <ShieldCheck className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>

                    {/* Bonuses list */}
                    <div className="mt-3 pt-2.5 border-t border-gray-800/60 flex flex-wrap gap-2">
                      {d.bonuses.map((bonus, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#16202c] text-emerald-300/90 border border-emerald-900/40"
                        >
                          {bonus}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-950/60 border border-emerald-400/40 flex items-center gap-2 transition"
            >
              <span>Begin Simulation</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
