import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { LandingScreen } from './components/landing/LandingScreen';
import { GameSetupModal } from './components/setup/GameSetupModal';
import { BudgetAllocator } from './components/budget/BudgetAllocator';
import { ResultsView } from './components/simulation/ResultsView';
import {
  SectorId,
  BudgetMap,
  PolicyDoctrineId,
  SimulationResult,
  SavedGame
} from './types/game';
import { SECTORS, INITIAL_ALLOCATIONS, TOTAL_BUDGET_LIMIT } from './data/sectors';
import { POLICY_DOCTRINES } from './data/doctrines';
import { runSimulation, validateBudget } from './engine/simulationEngine';
import { storage } from './services/storageService';

export const App: React.FC = () => {
  const [screen, setScreen] = useState<'landing' | 'allocator' | 'results'>('landing');
  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

  const [administrationName, setAdministrationName] = useState<string>('5th Administration Cabinet');
  const [doctrineId, setDoctrineId] = useState<PolicyDoctrineId>('balanced');
  const [allocations, setAllocations] = useState<BudgetMap>({ ...INITIAL_ALLOCATIONS });
  const [lockedSectors, setLockedSectors] = useState<Partial<Record<SectorId, boolean>>>({});
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [hasSavedGame, setHasSavedGame] = useState<boolean>(false);

  // Active doctrine object
  const activeDoctrine = POLICY_DOCTRINES.find(d => d.id === doctrineId) || POLICY_DOCTRINES[0];

  // Load saved game on startup
  useEffect(() => {
    const checkSaved = async () => {
      const saved = await storage.loadGame();
      if (saved) {
        setHasSavedGame(true);
      }
    };
    checkSaved();
  }, []);

  // Save game whenever state changes (if already started)
  useEffect(() => {
    if (screen === 'landing') return;

    const saveCurrent = async () => {
      const gameToSave: SavedGame = {
        version: '1.0.0',
        savedAt: new Date().toISOString(),
        administrationName,
        doctrineId,
        allocations,
        lockedSectors,
        lastResult: result
      };
      await storage.saveGame(gameToSave);
      setHasSavedGame(true);
    };

    saveCurrent();
  }, [screen, administrationName, doctrineId, allocations, lockedSectors, result]);

  const handleStartNew = () => {
    setShowSetupModal(true);
  };

  const handleConfirmSetup = (name: string, doctrine: PolicyDoctrineId) => {
    setAdministrationName(name);
    setDoctrineId(doctrine);
    setAllocations({ ...INITIAL_ALLOCATIONS });
    setLockedSectors({});
    setResult(null);
    setShowSetupModal(false);
    setScreen('allocator');
  };

  const handleResumeSavedGame = async () => {
    const saved = await storage.loadGame();
    if (!saved) return;

    setAdministrationName(saved.administrationName);
    setDoctrineId(saved.doctrineId);
    setAllocations(saved.allocations);
    setLockedSectors(saved.lockedSectors || {});
    setResult(saved.lastResult);

    if (saved.lastResult) {
      setScreen('results');
    } else {
      setScreen('allocator');
    }
  };

  const handleUpdateAllocation = (sectorId: SectorId, amount: number) => {
    setAllocations(prev => ({
      ...prev,
      [sectorId]: amount
    }));
  };

  const handleToggleLock = (sectorId: SectorId) => {
    setLockedSectors(prev => ({
      ...prev,
      [sectorId]: !prev[sectorId]
    }));
  };

  const handleResetToBaseline = () => {
    setAllocations({ ...INITIAL_ALLOCATIONS });
    setLockedSectors({});
  };

  const handleAutoBalance = () => {
    const currentTotal = Object.values(allocations).reduce((sum, v) => sum + v, 0);
    let diff = TOTAL_BUDGET_LIMIT - currentTotal;
    if (Math.abs(diff) < 0.001) return;

    const unlocked = SECTORS.filter(s => !lockedSectors[s.id]);
    if (unlocked.length === 0) {
      alert('All sectors are locked! Please unlock at least one sector to auto-balance.');
      return;
    }

    const next = { ...allocations };
    
    // Distribute diff across unlocked sectors in step chunks of 5B
    const step = diff > 0 ? 5 : -5;
    let remainingToDistribute = Math.abs(diff);

    let progressMade = true;
    while (remainingToDistribute >= 5 && progressMade) {
      progressMade = false;
      for (const s of unlocked) {
        if (remainingToDistribute < 5) break;
        const current = next[s.id];
        const prospective = current + step;

        if (prospective >= s.min && prospective <= s.max) {
          next[s.id] = prospective;
          remainingToDistribute -= 5;
          progressMade = true;
        }
      }
    }

    // If there's a leftover remainder < 5, put it in the first eligible unlocked sector
    if (remainingToDistribute > 0) {
      const leftoverStep = diff > 0 ? remainingToDistribute : -remainingToDistribute;
      for (const s of unlocked) {
        const prospective = next[s.id] + leftoverStep;
        if (prospective >= s.min && prospective <= s.max) {
          next[s.id] = prospective;
          remainingToDistribute = 0;
          break;
        }
      }
    }

    setAllocations(next);
  };

  const handleSimulate = () => {
    const validation = validateBudget(allocations);
    if (!validation.isValid) {
      alert(`Cannot simulate: ${validation.errors.join('\n')}`);
      return;
    }

    const simResult = runSimulation(allocations, activeDoctrine, administrationName);
    setResult(simResult);
    setScreen('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRevise = () => {
    setScreen('allocator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewGame = async () => {
    if (confirm('Start a new simulation session? Current changes will be reset to baseline.')) {
      await storage.clearGame();
      setHasSavedGame(false);
      setAllocations({ ...INITIAL_ALLOCATIONS });
      setLockedSectors({});
      setResult(null);
      setShowSetupModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c12] text-gray-100 flex flex-col font-sans">
      <Header
        administrationName={screen !== 'landing' ? administrationName : undefined}
        doctrine={screen !== 'landing' ? activeDoctrine : undefined}
        currentScreen={screen}
        onReset={handleRevise}
        onNewGame={handleNewGame}
      />

      <main className="flex-1">
        {screen === 'landing' && (
          <LandingScreen
            hasSavedGame={hasSavedGame}
            onStartNew={handleStartNew}
            onResume={handleResumeSavedGame}
          />
        )}

        {screen === 'allocator' && (
          <BudgetAllocator
            allocations={allocations}
            lockedSectors={lockedSectors}
            doctrine={activeDoctrine}
            onUpdateAllocation={handleUpdateAllocation}
            onToggleLock={handleToggleLock}
            onResetToBaseline={handleResetToBaseline}
            onAutoBalance={handleAutoBalance}
            onSimulate={handleSimulate}
          />
        )}

        {screen === 'results' && result && (
          <ResultsView
            result={result}
            onRevise={handleRevise}
            onNewGame={handleNewGame}
          />
        )}
      </main>

      {showSetupModal && (
        <GameSetupModal
          initialName={administrationName}
          initialDoctrineId={doctrineId}
          onConfirm={handleConfirmSetup}
          onCancel={() => setShowSetupModal(false)}
        />
      )}
    </div>
  );
};
export default App;
