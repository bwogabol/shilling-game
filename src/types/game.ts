export type SectorId =
  | 'health'
  | 'education'
  | 'agriculture'
  | 'infrastructure'
  | 'security'
  | 'water'
  | 'energy'
  | 'housing'
  | 'socialProtection'
  | 'governance';

export interface SectorInfo {
  id: SectorId;
  name: string;
  category: 'Social Services' | 'Economic Backbone' | 'State Resilience' | 'Basic Needs';
  icon: string;
  baseline: number; // in Billions KSh
  min: number;
  max: number;
  description: string;
  keyPrograms: string[];
  riskWarning: string;
  synergyNotes: string;
}

export type BudgetMap = Record<SectorId, number>;

export type PolicyDoctrineId =
  | 'balanced'
  | 'food_sovereignty'
  | 'industrial_leap'
  | 'human_capital'
  | 'fiscal_discipline';

export interface PolicyDoctrine {
  id: PolicyDoctrineId;
  title: string;
  tagline: string;
  description: string;
  focusSectors: SectorId[];
  bonuses: string[];
}

export interface Metrics {
  gdpGrowth: number;          // % e.g. 5.2
  debtToGdp: number;          // % e.g. 68.0
  hdi: number;                // 0 - 100
  foodSecurity: number;       // 0 - 100
  publicApproval: number;     // 0 - 100
  infrastructureIndex: number;// 0 - 100
  inflationRate: number;      // % e.g. 6.5
  jobCreationIndex: number;   // 0 - 100
  fiscalBalance: number;      // Billions KSh
}

export interface Headline {
  id: string;
  source: string;
  tag: 'ALERT' | 'ECONOMY' | 'DEVELOPMENT' | 'STABILITY' | 'CABINET';
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  summary: string;
}

export type SectorStatus = 'crisis' | 'strained' | 'stable' | 'growing' | 'exceptional';

export interface SectorImpact {
  sectorId: SectorId;
  sectorName: string;
  allocated: number;
  deltaPercent: number;
  status: SectorStatus;
  headline: string;
  narrative: string;
  consequences: string[];
}

export interface YearSimulation {
  year: 1 | 5 | 10;
  yearLabel: string;
  metrics: Metrics;
  sectorImpacts: Record<SectorId, SectorImpact>;
  headlines: Headline[];
  systemicTradeoffs: string[];
  strategicAlerts: string[];
}

export interface SimulationResult {
  timestamp: string;
  administrationName: string;
  doctrine: PolicyDoctrine;
  allocations: BudgetMap;
  years: {
    1: YearSimulation;
    5: YearSimulation;
    10: YearSimulation;
  };
  score: {
    economic: number;
    humanitarian: number;
    stability: number;
    overall: number;
    grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  };
  legacyVerdict: {
    title: string;
    description: string;
    unintendedConsequences: string[];
  };
}

export interface SavedGame {
  version: string;
  savedAt: string;
  administrationName: string;
  doctrineId: PolicyDoctrineId;
  allocations: BudgetMap;
  lockedSectors: Partial<Record<SectorId, boolean>>;
  lastResult: SimulationResult | null;
}
