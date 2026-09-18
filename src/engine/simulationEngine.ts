import {
  SectorId,
  BudgetMap,
  PolicyDoctrine,
  Metrics,
  SectorImpact,
  SectorStatus,
  YearSimulation,
  SimulationResult,
  Headline
} from '../types/game';
import { SECTORS, TOTAL_BUDGET_LIMIT } from '../data/sectors';

export interface BudgetValidation {
  isValid: boolean;
  totalAllocated: number;
  remaining: number;
  errors: string[];
}

export function validateBudget(allocations: BudgetMap): BudgetValidation {
  const errors: string[] = [];
  let totalAllocated = 0;

  for (const sector of SECTORS) {
    const val = allocations[sector.id] ?? 0;
    if (isNaN(val) || val < 0) {
      errors.push(`${sector.name} allocation cannot be negative.`);
    }
    totalAllocated += val;
  }

  // Round to handle floating point precision
  totalAllocated = Math.round(totalAllocated * 10) / 10;
  const remaining = Math.round((TOTAL_BUDGET_LIMIT - totalAllocated) * 10) / 10;

  if (Math.abs(remaining) > 0.01) {
    errors.push(`Total allocation must equal exactly KSh ${TOTAL_BUDGET_LIMIT.toLocaleString()} Billion. Current: KSh ${totalAllocated.toLocaleString()} Billion (Difference: KSh ${remaining > 0 ? '+' : ''}${remaining.toLocaleString()} B).`);
  }

  return {
    isValid: errors.length === 0,
    totalAllocated,
    remaining,
    errors
  };
}

// Baseline starting metrics at t=0
const BASELINE_METRICS: Metrics = {
  gdpGrowth: 5.2,
  debtToGdp: 68.0,
  hdi: 58.0,
  foodSecurity: 52.0,
  publicApproval: 50.0,
  infrastructureIndex: 55.0,
  inflationRate: 6.5,
  jobCreationIndex: 48.0,
  fiscalBalance: -180
};

// Helper: Diminishing returns curve for spending above baseline, and steeper penalty for cuts
function computeSectorEffectiveness(ratio: number): number {
  if (ratio <= 0.2) return -1.5;
  if (ratio < 1.0) {
    // Sharp penalty for starvation: non-linear drop
    return -2.0 * Math.pow(1.0 - ratio, 1.3);
  }
  // Logarithmic diminishing returns for overfunding
  return 1.2 * Math.log(1.0 + (ratio - 1.0) * 0.9);
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function runSimulation(
  allocations: BudgetMap,
  doctrine: PolicyDoctrine,
  administrationName: string = 'Republic of Kenya'
): SimulationResult {
  const validation = validateBudget(allocations);
  if (!validation.isValid) {
    throw new Error(`Invalid budget: ${validation.errors.join(', ')}`);
  }

  // Calculate ratios relative to baseline
  const ratios = {} as Record<SectorId, number>;
  const effectiveness = {} as Record<SectorId, number>;

  for (const s of SECTORS) {
    const allocated = allocations[s.id];
    ratios[s.id] = allocated / s.baseline;
    effectiveness[s.id] = computeSectorEffectiveness(ratios[s.id]);
  }

  // Doctrine bonuses
  let doctrineAgMultiplier = doctrine.id === 'food_sovereignty' ? 1.35 : 1.0;
  let doctrineInfraBonus = doctrine.id === 'industrial_leap' ? 0.35 : 0.0;
  let doctrineHdiMultiplier = doctrine.id === 'human_capital' ? 1.3 : 1.0;
  let doctrineDebtReduction = doctrine.id === 'fiscal_discipline' ? 2.5 : 0.0;
  let doctrineApprovalBonus = doctrine.id === 'balanced' ? 5.0 : 0.0;

  // Systemic Interdependencies
  const waterAgSynergy = (ratios.agriculture > 1.1 && ratios.water > 1.1) ? 1.3 : (ratios.agriculture > 1.2 && ratios.water < 0.85) ? 0.7 : 1.0;
  const infraEnergyBottleneck = (ratios.infrastructure > 1.25 && ratios.energy < 0.9) ? -0.5 : (ratios.infrastructure > 1.1 && ratios.energy > 1.1) ? 0.4 : 0.0;
  const healthEduSynergy = (ratios.health > 1.1 && ratios.education > 1.1) ? 1.25 : 1.0;
  const devolutionStarvationPenalty = ratios.governance < 0.8 ? -8.0 : 0.0;
  const securityDeficitPenalty = ratios.security < 0.75 ? -6.0 : 0.0;

  // Simulate Year 1, Year 5, Year 10
  const year1 = simulateHorizon(1, ratios, effectiveness, {
    waterAgSynergy,
    infraEnergyBottleneck,
    healthEduSynergy,
    devolutionStarvationPenalty,
    securityDeficitPenalty,
    doctrineAgMultiplier,
    doctrineInfraBonus,
    doctrineHdiMultiplier,
    doctrineDebtReduction,
    doctrineApprovalBonus
  }, allocations, doctrine);

  const year5 = simulateHorizon(5, ratios, effectiveness, {
    waterAgSynergy,
    infraEnergyBottleneck,
    healthEduSynergy,
    devolutionStarvationPenalty,
    securityDeficitPenalty,
    doctrineAgMultiplier,
    doctrineInfraBonus,
    doctrineHdiMultiplier,
    doctrineDebtReduction,
    doctrineApprovalBonus
  }, allocations, doctrine);

  const year10 = simulateHorizon(10, ratios, effectiveness, {
    waterAgSynergy,
    infraEnergyBottleneck,
    healthEduSynergy,
    devolutionStarvationPenalty,
    securityDeficitPenalty,
    doctrineAgMultiplier,
    doctrineInfraBonus,
    doctrineHdiMultiplier,
    doctrineDebtReduction,
    doctrineApprovalBonus
  }, allocations, doctrine);

  // Overall Scoring
  const y10m = year10.metrics;
  const economicScore = clamp(Math.round(((y10m.gdpGrowth - 2.0) * 12) + (75 - y10m.debtToGdp) * 1.5 + (y10m.jobCreationIndex * 0.4)), 0, 100);
  const humanitarianScore = clamp(Math.round((y10m.hdi * 0.5) + (y10m.foodSecurity * 0.5)), 0, 100);
  const stabilityScore = clamp(Math.round((y10m.publicApproval * 0.6) + (y10m.infrastructureIndex * 0.4)), 0, 100);
  const overallScore = Math.round((economicScore * 0.35) + (humanitarianScore * 0.4) + (stabilityScore * 0.25));

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'C';
  if (overallScore >= 88) grade = 'A+';
  else if (overallScore >= 78) grade = 'A';
  else if (overallScore >= 65) grade = 'B';
  else if (overallScore >= 50) grade = 'C';
  else if (overallScore >= 38) grade = 'D';
  else grade = 'F';

  // Legacy Verdict & Unintended Consequences
  const legacyVerdict = generateLegacyVerdict(overallScore, grade, ratios, year10.metrics, doctrine);

  return {
    timestamp: new Date().toISOString(),
    administrationName,
    doctrine,
    allocations,
    years: {
      1: year1,
      5: year5,
      10: year10
    },
    score: {
      economic: economicScore,
      humanitarian: humanitarianScore,
      stability: stabilityScore,
      overall: overallScore,
      grade
    },
    legacyVerdict
  };
}

interface HorizonModifiers {
  waterAgSynergy: number;
  infraEnergyBottleneck: number;
  healthEduSynergy: number;
  devolutionStarvationPenalty: number;
  securityDeficitPenalty: number;
  doctrineAgMultiplier: number;
  doctrineInfraBonus: number;
  doctrineHdiMultiplier: number;
  doctrineDebtReduction: number;
  doctrineApprovalBonus: number;
}

function simulateHorizon(
  year: 1 | 5 | 10,
  ratios: Record<SectorId, number>,
  eff: Record<SectorId, number>,
  mods: HorizonModifiers,
  allocations: BudgetMap,
  doctrine: PolicyDoctrine
): YearSimulation {
  const timeFactor = year === 1 ? 0.35 : year === 5 ? 0.8 : 1.25;
  const compoundingFactor = year === 1 ? 1.0 : year === 5 ? 1.4 : 1.9;

  // 1. Food Security
  let agFactor = (eff.agriculture * 18 * mods.doctrineAgMultiplier) + (eff.water * 10);
  agFactor *= mods.waterAgSynergy;
  let foodSecurity = clamp(
    Math.round((BASELINE_METRICS.foodSecurity + (agFactor * timeFactor)) * 10) / 10,
    10,
    98
  );

  // 2. Inflation (heavily affected by food supply and energy costs)
  let foodPriceShock = foodSecurity < 45 ? (45 - foodSecurity) * 0.25 : (foodSecurity - 52) * -0.08;
  let energyPriceShock = eff.energy < 0 ? Math.abs(eff.energy) * 1.2 : eff.energy * -0.6;
  let inflationRate = clamp(
    Math.round((BASELINE_METRICS.inflationRate + foodPriceShock + energyPriceShock) * 10) / 10,
    2.5,
    22.0
  );

  // 3. Infrastructure & Energy Index
  let infraEff = (eff.infrastructure * 14) + (eff.energy * 10) + (mods.infraEnergyBottleneck * 8);
  let infrastructureIndex = clamp(
    Math.round((BASELINE_METRICS.infrastructureIndex + (infraEff * timeFactor)) * 10) / 10,
    15,
    99
  );

  // 4. Human Development Index (compounds heavily over 5 and 10 years)
  let healthFactor = eff.health * 10 * mods.healthEduSynergy;
  let eduFactor = eff.education * (year === 1 ? 4 : year === 5 ? 12 : 22);
  let socialFactor = eff.socialProtection * 8;
  let waterHealthBonus = eff.water > 0 ? eff.water * 4 : eff.water * 8;
  let hdiDelta = (healthFactor + eduFactor + socialFactor + waterHealthBonus) * mods.doctrineHdiMultiplier;
  let hdi = clamp(
    Math.round((BASELINE_METRICS.hdi + (hdiDelta * 0.25 * compoundingFactor)) * 10) / 10,
    20,
    96
  );

  // 5. Real GDP Growth
  // Short term: infrastructure, agriculture. Long term: education, energy, governance.
  let gdpDelta = 0;
  if (year === 1) {
    gdpDelta = (eff.infrastructure * 0.5) + (eff.agriculture * 0.4) + (eff.energy * 0.3) + mods.doctrineInfraBonus;
  } else if (year === 5) {
    gdpDelta = (eff.infrastructure * 0.7) + (eff.energy * 0.6) + (eff.education * 0.5) + (eff.agriculture * 0.5) + (eff.governance * 0.4);
  } else {
    gdpDelta = (eff.education * 1.1) + (eff.energy * 0.9) + (eff.infrastructure * 0.7) + (eff.health * 0.6) + (eff.governance * 0.6);
  }
  // Penalties for insecurity or debt crisis
  if (ratios.security < 0.75) gdpDelta -= 0.8;
  if (ratios.governance < 0.75) gdpDelta -= 0.7;
  let gdpGrowth = clamp(
    Math.round((BASELINE_METRICS.gdpGrowth + gdpDelta) * 10) / 10,
    -1.5,
    10.8
  );

  // 6. Public Debt to GDP
  // Heavy infrastructure increases debt; strong governance increases revenue; high GDP shrinks debt ratio
  let borrowingNeed = (allocations.infrastructure - 450) * 0.25 + (allocations.housing - 100) * 0.15;
  let taxMobilization = eff.governance > 0 ? eff.governance * 1.5 : eff.governance * 3.5;
  let gdpDenominatorEffect = (gdpGrowth - 5.0) * 1.2;
  let debtChange = (borrowingNeed / 30) - taxMobilization - gdpDenominatorEffect - mods.doctrineDebtReduction;
  let debtToGdp = clamp(
    Math.round((BASELINE_METRICS.debtToGdp + (debtChange * timeFactor * 1.2)) * 10) / 10,
    38.0,
    115.0
  );

  // 7. Job Creation Index
  let jobsDelta = (eff.infrastructure * 5) + (eff.housing * 7) + (eff.agriculture * 4) + (eff.energy * 3);
  let jobCreationIndex = clamp(
    Math.round((BASELINE_METRICS.jobCreationIndex + (jobsDelta * timeFactor)) * 10) / 10,
    15,
    95
  );

  // 8. Public Approval / Civic Trust
  let approvalDelta = 0;
  approvalDelta += (foodSecurity - 52) * 0.35;
  approvalDelta += (hdi - 58) * 0.4;
  approvalDelta += (jobCreationIndex - 48) * 0.25;
  approvalDelta -= (inflationRate - 6.5) * 1.2;
  approvalDelta -= (debtToGdp > 75 ? (debtToGdp - 75) * 0.4 : 0);
  approvalDelta += mods.devolutionStarvationPenalty;
  approvalDelta += mods.securityDeficitPenalty;
  approvalDelta += mods.doctrineApprovalBonus;
  let publicApproval = clamp(
    Math.round((BASELINE_METRICS.publicApproval + approvalDelta) * 10) / 10,
    5,
    98
  );

  // 9. Fiscal Balance
  let fiscalBalance = Math.round(BASELINE_METRICS.fiscalBalance + (taxMobilization * 25) - (borrowingNeed * 0.5));

  const metrics: Metrics = {
    gdpGrowth,
    debtToGdp,
    hdi,
    foodSecurity,
    publicApproval,
    infrastructureIndex,
    inflationRate,
    jobCreationIndex,
    fiscalBalance
  };

  // Sector Impacts and Narratives
  const sectorImpacts = {} as Record<SectorId, SectorImpact>;
  for (const s of SECTORS) {
    sectorImpacts[s.id] = generateSectorImpact(s.id, ratios[s.id], eff[s.id], year, allocations[s.id]);
  }

  // Systemic Tradeoffs and Alerts
  const { systemicTradeoffs, strategicAlerts } = generateSystemicInsights(year, ratios, metrics, mods);

  // Dynamic Headlines
  const headlines = generateHeadlines(year, metrics, ratios, doctrine);

  return {
    year,
    yearLabel: year === 1 ? 'Year 1: Immediate Aftermath' : year === 5 ? 'Year 5: Structural Evolution' : 'Year 10: Generational Legacy',
    metrics,
    sectorImpacts,
    headlines,
    systemicTradeoffs,
    strategicAlerts
  };
}

function generateSectorImpact(
  id: SectorId,
  ratio: number,
  _eff: number,
  year: 1 | 5 | 10,
  allocated: number
): SectorImpact {
  const s = SECTORS.find(item => item.id === id)!;
  const deltaPercent = Math.round((ratio - 1.0) * 100);

  let status: SectorStatus = 'stable';
  if (ratio <= 0.6) status = 'crisis';
  else if (ratio <= 0.85) status = 'strained';
  else if (ratio >= 1.4) status = 'exceptional';
  else if (ratio >= 1.15) status = 'growing';

  const consequences: string[] = [];
  let headline = '';
  let narrative = '';

  switch (id) {
    case 'agriculture':
      if (status === 'crisis') {
        headline = 'Crop failure risks skyrocket amid depleted seed & fertilizer reserves';
        narrative = `With budget slashed to KSh ${allocated}B (-${Math.abs(deltaPercent)}%), subsistence farmers in the Rift Valley and Eastern counties struggled to access fertilizer. Emergency grain reserves dwindled to 2 weeks of reserves.`;
        consequences.push('Severe food price inflation in urban centers', 'Sharp increase in emergency famine relief requests');
      } else if (status === 'growing' || status === 'exceptional') {
        headline = 'Bumper harvests recorded as modern silos and irrigation take hold';
        narrative = `Funding of KSh ${allocated}B (+${deltaPercent}%) expanded the national fertilizer voucher scheme and built hermetic storage hubs across 12 agricultural breadbasket counties.`;
        consequences.push('Post-harvest losses cut by over 30%', 'Maize flour retail prices stabilized nationwide');
      } else {
        headline = 'Agricultural yields meet standard historical targets';
        narrative = `The agricultural sector maintained regular seasonal subsidies of KSh ${allocated}B. Production remained stable, though still vulnerable to erratic climate conditions.`;
        consequences.push('Modest food reserve levels maintained', 'Consistent smallholder output');
      }
      break;

    case 'health':
      if (status === 'crisis') {
        headline = 'Referral hospitals paralyzed by pharmaceutical and supply shortages';
        narrative = `Allocating only KSh ${allocated}B severely impaired medical procurement at KEMSA and county dispensaries, sparking widespread doctor and nurse strikes.`;
        consequences.push('Out-of-pocket medical impoverishment increased by 22%', 'Preventable child mortality climbed');
      } else if (status === 'growing' || status === 'exceptional') {
        headline = 'Universal primary healthcare coverage expands across county clinics';
        narrative = `The increased allocation of KSh ${allocated}B enabled biometric digital health registration, equipped Level 4 clinics with solar refrigeration, and subsidized emergency trauma centers.`;
        consequences.push('Household catastrophic healthcare expenditure dropped 35%', 'Life expectancy metrics showed marked positive improvement');
      } else {
        headline = 'Healthcare system operates within normal capacity limits';
        narrative = `Funding of KSh ${allocated}B maintained the operational status quo of public referral facilities and routine vaccination programs.`;
        consequences.push('Routine drug distribution maintained', 'County referral hospitals kept functional');
      }
      break;

    case 'education':
      if (status === 'crisis') {
        headline = 'Severe teacher shortages stall curriculum rollout in public schools';
        narrative = `With only KSh ${allocated}B allocated, hiring for junior secondary schools froze, causing pupil-teacher ratios in rural counties to exceed 65:1.`;
        consequences.push('TVET technical enrollment dropped significantly', 'Long-term skilled workforce deficit baked in');
      } else if (status === 'growing' || status === 'exceptional') {
        headline = 'TVET and STEM modernization creates wave of skilled technical youth';
        narrative = `At KSh ${allocated}B (+${deltaPercent}%), modern laboratories, coding hubs, and vocational workshops equipped over 400,000 trainees for regional industrial employment.`;
        consequences.push('Youth vocational employability jumped 28%', 'Foundation established for high-tech regional hub');
      } else {
        headline = 'Primary and secondary capitation grants disbursed on schedule';
        narrative = `Capitation disbursements of KSh ${allocated}B kept national schools and universities running smoothly without major fee unrest.`;
        consequences.push('Stable exam completion rates', 'Standard teacher recruitment levels');
      }
      break;

    case 'infrastructure':
      if (status === 'crisis') {
        headline = 'Potholed arterial highways and bridge backlogs slow transport corridors';
        narrative = `A reduction to KSh ${allocated}B halted key maintenance along the Northern Corridor, resulting in transport logistics costs jumping by 18%.`;
        consequences.push('Transit times between Mombasa Port and Malaba border rose 3 days', 'Rural farm-to-market feeder roads fell into disrepair');
      } else if (status === 'growing' || status === 'exceptional') {
        headline = 'Massive expressway and regional railway bypasses open to traffic';
        narrative = `Aggressive infrastructure expenditure of KSh ${allocated}B connected inland container depots, dualled bottleneck highways, and reduced freight dwell times at the port.`;
        consequences.push('Commercial logistics throughput increased 32%', year === 10 ? 'Compounded into major regional trade dominance' : 'Elevated debt repayment load on the sovereign balance sheet');
      } else {
        headline = 'Routine road maintenance and bridge rehabilitation proceed';
        narrative = `With KSh ${allocated}B, the Kenya National Highways Authority (KeNHA) kept primary trunk roads operational and serviced existing infrastructure obligations.`;
        consequences.push('Steady freight transport efficiency', 'Core trade corridors preserved');
      }
      break;

    case 'security':
      if (status === 'crisis') {
        headline = 'Security alerts surge across northern pastoralist grazing corridors';
        narrative = `Budget cuts to KSh ${allocated}B restricted police aerial surveillance, fuel rations for patrols, and border reconnaissance, leading to an uptick in cross-border cattle raids.`;
        consequences.push('Commercial transport along northern transit corridors required armed escorts', 'Foreign travel advisories issued, depressing coastal tourism');
      } else if (status === 'growing' || status === 'exceptional') {
        headline = 'Modernized intelligence and community policing restore corridor peace';
        narrative = `At KSh ${allocated}B, police housing modernization, drone surveillance, and joint border patrols suppressed cross-border contraband and banditry.`;
        consequences.push('Investor confidence in arid-zone development rose sharply', 'Tourism revenue in coastal and national park circuits hit records');
      } else {
        headline = 'National security forces maintain steady frontier and urban vigilance';
        narrative = `Funding of KSh ${allocated}B sustained baseline defense operations, counter-terror vigilance, and urban police presence.`;
        consequences.push('Border stability maintained', 'Urban crime rates remained within anticipated bands');
      }
      break;

    case 'water':
      if (status === 'crisis') {
        headline = 'Urban water rationing intensifies as dam construction stalls';
        narrative = `Cutting water funding to KSh ${allocated}B left key multipurpose dams uncompleted. Tanker cartels took over supply in major cities while arid pastoralists faced dry boreholes.`;
        consequences.push('Cholera outbreak alerts triggered during seasonal rains', 'Agricultural irrigation capacity fell 25%');
      } else if (status === 'growing' || status === 'exceptional') {
        headline = 'Mega-dams and solar borehole networks bring piped water to arid zones';
        narrative = `A robust allocation of KSh ${allocated}B completed regional mega-dams and electrified over 2,000 high-capacity community boreholes.`;
        consequences.push('Over 4.5 million citizens gained reliable clean tap access', 'Crop irrigation acreage doubled');
      } else {
        headline = 'Water utilities maintain basic catchment and urban distribution';
        narrative = `The allocation of KSh ${allocated}B kept urban treatment plants running and preserved ongoing pipeline projects.`;
        consequences.push('Standard water access rates preserved', 'Scheduled borehole maintenance completed');
      }
      break;

    case 'energy':
      if (status === 'crisis') {
        headline = 'Industrial zones plagued by erratic voltage fluctuations and blackouts';
        narrative = `With KSh ${allocated}B, geothermal exploration stalled and aging transmission sub-stations failed under peak manufacturing loads.`;
        consequences.push('Manufacturers spent heavily on costly diesel backup generators', 'Rural electrification expansion ground to a halt');
      } else if (status === 'growing' || status === 'exceptional') {
        headline = 'Olkaria geothermal expansion delivers cheap, green industrial base-load';
        narrative = `At KSh ${allocated}B, new geothermal wells and smart grid switches drove Kenya’s clean energy grid share past 94%, making energy tariffs among the most competitive on the continent.`;
        consequences.push('Attracted global data center and green manufacturing investments', 'Rural household electrification rate surpassed 85%');
      } else {
        headline = 'National power grid supplies steady baseload to core commercial nodes';
        narrative = `Funding of KSh ${allocated}B maintained grid reliability and continued gradual Last-Mile connectivity.`;
        consequences.push('Stable commercial power reliability', 'Steady geothermal power output');
      }
      break;

    case 'housing':
      if (status === 'crisis') {
        headline = 'Uncontrolled urban sprawl accelerates tenement fire and safety hazards';
        narrative = `Cutting housing to KSh ${allocated}B froze urban slum upgrading initiatives, leaving millions in dense settlements vulnerable to flooding and sanitation collapses.`;
        consequences.push('Urban informal settlement footprint expanded', 'Construction artisan employment slumped');
      } else if (status === 'growing' || status === 'exceptional') {
        headline = 'Modern affordable housing estates handed over to tens of thousands of families';
        narrative = `Investing KSh ${allocated}B completed dignified, planned residential estates with connected sewage and schools, catalyzing huge employment for local artisans (jua kali).`;
        consequences.push('Over 120,000 urban families transitioned into formal housing', 'Created significant local artisanal employment');
      } else {
        headline = 'Targeted urban housing projects proceed at planned schedule';
        narrative = `Funding of KSh ${allocated}B continued phased slum upgrading and tenant-purchase housing pilots in Nairobi and Mombasa.`;
        consequences.push('Phased residential units delivered', 'Steady construction sector activity');
      }
      break;

    case 'socialProtection':
      if (status === 'crisis') {
        headline = 'Inua Jamii cash stipend halts leave vulnerable elderly in acute distress';
        narrative = `Slashing social safety nets to KSh ${allocated}B eliminated primary school milk programs and delayed monthly stipends to over 1.2 million elderly and orphan households.`;
        consequences.push('Primary school dropout rates in dryland areas surged 15%', 'Extreme poverty indices worsened noticeably');
      } else if (status === 'growing' || status === 'exceptional') {
        headline = 'Universal senior citizen stipends and school feeding lift millions out of poverty';
        narrative = `With KSh ${allocated}B, biometric timely cash transfers stimulated rural retail markets, while universal hot school meals boosted school attendance to 98%.`;
        consequences.push('Severe poverty headcounts dropped 19%', 'Rural village micro-enterprise turnover expanded');
      } else {
        headline = 'Social welfare stipends reach registered vulnerable beneficiary households';
        narrative = `An allocation of KSh ${allocated}B maintained regular monthly cash transfers to designated vulnerable citizens.`;
        consequences.push('Basic safety net protected', 'Consistent school lunch program in target counties');
      }
      break;

    case 'governance':
      if (status === 'crisis') {
        headline = 'County governments shut down non-essential services over disbursement arrears';
        narrative = `Cutting Devolution transfers and administrative systems to KSh ${allocated}B caused 47 county governors to threaten a national strike as local clinics ran out of fuel and workers went unpaid.`;
        consequences.push('Widespread paralyzing strikes across all 47 counties', 'Tax collection evasion increased as KRA enforcement eroded');
      } else if (status === 'growing' || status === 'exceptional') {
        headline = 'Devolved county services thrive as digital revenue collection beats targets';
        narrative = `Full, predictable funding of KSh ${allocated}B empowered county governments to complete regional markets and enabled KRA to modernize automated e-tax compliance.`;
        consequences.push('Domestic tax collection rose by 14%, reducing foreign borrowing reliance', 'Judicial case clearance time cut in half');
      } else {
        headline = 'Equitable share disbursements to counties processed in orderly tranches';
        narrative = `Funding of KSh ${allocated}B sustained county operations and baseline constitutional institution functions.`;
        consequences.push('Counties operated without major salary defaults', 'Tax compliance remained on baseline trajectory');
      }
      break;
  }

  return {
    sectorId: id,
    sectorName: s.name,
    allocated,
    deltaPercent,
    status,
    headline,
    narrative,
    consequences
  };
}

function generateSystemicInsights(
  year: number,
  ratios: Record<SectorId, number>,
  metrics: Metrics,
  _mods: HorizonModifiers
): { systemicTradeoffs: string[]; strategicAlerts: string[] } {
  const systemicTradeoffs: string[] = [];
  const strategicAlerts: string[] = [];

  // Food & Water Loop
  if (ratios.agriculture > 1.15 && ratios.water > 1.15) {
    systemicTradeoffs.push('🌾 SYNERGY UNLOCKED: Synchronized Agriculture & Water funding turned dryland irrigation into a high-yielding breadbasket.');
  } else if (ratios.agriculture > 1.2 && ratios.water < 0.85) {
    strategicAlerts.push('⚠️ BOTTLENECK: High agricultural subsidies were constrained because underfunded water schemes left irrigation dams dry.');
  } else if (ratios.agriculture < 0.75) {
    strategicAlerts.push('🚨 FOOD STRESS: Depleted strategic grain reserves left domestic food prices vulnerable to international import shocks.');
  }

  // Infrastructure & Energy Loop
  if (ratios.infrastructure > 1.25 && ratios.energy < 0.9) {
    strategicAlerts.push('⚡ WHITE ELEPHANT RISK: New highways and logistics terminals operate below capacity due to frequent industrial power outages.');
  } else if (ratios.infrastructure > 1.15 && ratios.energy > 1.15) {
    systemicTradeoffs.push('🚀 LOGISTICS FLYWHEEL: Combined road and clean geothermal energy lowered private manufacturing unit costs by 18%.');
  }

  // Debt Tradeoff
  if (metrics.debtToGdp > 75) {
    strategicAlerts.push(`📉 DEBT OVERHANG: Public debt is at ${metrics.debtToGdp}% of GDP. Debt servicing now consumes an alarming share of annual tax revenues.`);
  } else if (metrics.debtToGdp < 60) {
    systemicTradeoffs.push(`🛡️ FISCAL BUFFER: Debt-to-GDP narrowed to ${metrics.debtToGdp}%, earning Kenya credit rating upgrades and lower borrowing yields.`);
  }

  // Human Capital Long-term Compounding
  if (year >= 5) {
    if (ratios.education > 1.1 && ratios.health > 1.1) {
      systemicTradeoffs.push('💡 HUMAN CAPITAL COMPOUNDING: Investments in early education and preventative healthcare are now paying dividends in national labor productivity.');
    } else if (ratios.education < 0.75) {
      strategicAlerts.push('⚠️ SKILLS VACUUM: Severe school underfunding in early years has created a shortage of skilled technical artisans.');
    }
  }

  // County Devolution Alert
  if (ratios.governance < 0.8) {
    strategicAlerts.push('🏛️ DEVOLUTION CRISIS: County funding cuts triggered strikes among county doctors, nurses, and revenue collectors.');
  }

  return { systemicTradeoffs, strategicAlerts };
}

function generateHeadlines(
  _year: 1 | 5 | 10,
  metrics: Metrics,
  _ratios: Record<SectorId, number>,
  doctrine: PolicyDoctrine
): Headline[] {
  const headlines: Headline[] = [];

  // 1. Economy headline
  if (metrics.gdpGrowth >= 7.0) {
    headlines.push({
      id: 'h-gdp-surge',
      source: 'Budget Lab Economic Monitor',
      tag: 'ECONOMY',
      type: 'positive',
      title: `GDP Soars to ${metrics.gdpGrowth}%: Simulated Economy Outpaces Regional Peers`,
      summary: `Surging productivity and strategic investments drive economic expansion to historic highs in this simulation run.`
    });
  } else if (metrics.gdpGrowth <= 3.5) {
    headlines.push({
      id: 'h-gdp-slump',
      source: 'Budget Lab Economic Monitor',
      tag: 'ECONOMY',
      type: 'negative',
      title: `Growth Stalls at ${metrics.gdpGrowth}% as Sectoral Imbalances Drag the Economy`,
      summary: `Bottlenecks in foundational sectors are damping private sector activity. Consider rebalancing your allocation.`
    });
  } else {
    headlines.push({
      id: 'h-gdp-steady',
      source: 'Budget Lab Economic Monitor',
      tag: 'ECONOMY',
      type: 'neutral',
      title: `Economy Holds at ${metrics.gdpGrowth}% Growth — Stability Without Transformation`,
      summary: `The simulation shows resilient but largely unchanged macroeconomic fundamentals under the ${doctrine.title} approach. This is the Status Quo outcome — rebalance to drive greater change.`
    });
  }

  // 2. Food & Living headline
  if (metrics.foodSecurity >= 70) {
    headlines.push({
      id: 'h-food-secure',
      source: 'Budget Lab Food & Agriculture Desk',
      tag: 'DEVELOPMENT',
      type: 'positive',
      title: 'Food Reserves Overflow as Irrigation & Subsidy Schemes Deliver',
      summary: `Sustained agricultural and water investment delivers record harvest yields across dryland and highland counties in this scenario.`
    });
  } else if (metrics.foodSecurity <= 40) {
    headlines.push({
      id: 'h-food-crisis',
      source: 'Budget Lab Food & Agriculture Desk',
      tag: 'ALERT',
      type: 'negative',
      title: 'Food Insecurity Critical: Arid Regions Require Emergency Relief',
      summary: `Underfunded agriculture and water sectors have produced sharp food inflation and supply shortfalls in this simulation run.`
    });
  }

  // 3. Debt headline
  if (metrics.debtToGdp >= 75) {
    headlines.push({
      id: 'h-debt-warning',
      source: 'Budget Lab Fiscal Monitor',
      tag: 'ALERT',
      type: 'negative',
      title: `Debt Ratio Reaches ${metrics.debtToGdp}%: Servicing Costs Crowd Out Development Spending`,
      summary: `Mounting debt obligations are eating into future budget headroom. Rebalance toward revenue-generating sectors to improve sustainability.`
    });
  } else if (metrics.debtToGdp <= 62) {
    headlines.push({
      id: 'h-debt-relief',
      source: 'Budget Lab Fiscal Monitor',
      tag: 'STABILITY',
      type: 'positive',
      title: `Debt-to-GDP Contracts to ${metrics.debtToGdp}%: Fiscal Position Strengthens`,
      summary: `Disciplined allocation and improved revenue mobilization have significantly improved the simulated fiscal outlook.`
    });
  }

  // 4. Civic Approval headline
  if (metrics.publicApproval >= 65) {
    headlines.push({
      id: 'h-approval-high',
      source: 'Budget Lab Public Sentiment Index',
      tag: 'CABINET',
      type: 'positive',
      title: `Public Trust Index Reaches ${metrics.publicApproval}% — Citizens Notice the Difference`,
      summary: `Simulated citizens report improved frontline services, healthcare access, and community security in this allocation scenario.`
    });
  } else if (metrics.publicApproval <= 35) {
    headlines.push({
      id: 'h-approval-low',
      source: 'Budget Lab Public Sentiment Index',
      tag: 'ALERT',
      type: 'negative',
      title: `Public Dissatisfaction at ${metrics.publicApproval}% — Budget Inequities Draw Protests`,
      summary: `Cost-of-living pressures and underfunded social programs have eroded civic confidence in this scenario.`
    });
  }

  return headlines;
}

function generateLegacyVerdict(
  overallScore: number,
  _grade: string,
  ratios: Record<SectorId, number>,
  finalMetrics: Metrics,
  doctrine: PolicyDoctrine
): { title: string; description: string; unintendedConsequences: string[] } {
  let title = '';
  let description = '';
  const unintendedConsequences: string[] = [];

  if (overallScore >= 80) {
    title = 'The Visionary Architect of Transformative Change';
    description = `Your deliberate reallocation paid off. Through the ${doctrine.title}, this simulation produced durable GDP growth (${finalMetrics.gdpGrowth}%), a controlled debt ratio (${finalMetrics.debtToGdp}%), and measurably improved citizen welfare. The compounding effects of your early decisions drove outcomes that differed substantially from the Status Quo.`;
  } else if (overallScore >= 65) {
    title = 'The Status Quo Pragmatist — Stability Preserved, Transformation Limited';
    description = `The budget remained close to the baseline. The country avoided major shocks, but limited resources were redirected toward transformative outcomes. This is what the default allocation produces: stability without breakthrough. Try shifting more budget between synergistic sectors — Water + Agriculture, Infrastructure + Energy, or Health + Education — to see how the outcomes change.`;
  } else if (overallScore >= 50) {
    title = 'Uneven Progress: Some Sectors Advanced, Others Strained';
    description = `While you avoided systemic collapse, the lack of complementary sector funding created mixed results — progress in some areas was offset by friction in underfunded lifelines. Tradeoffs are real: every billion moved to one sector is a billion taken from another.`;
  } else {
    title = 'Severe Imbalance: Cascading Strain Across Basic Services';
    description = `Extreme reallocation triggered cascading crises. While some priority projects advanced, the human and economic cost on the wider simulation was severe. In a real system, these compounding failures take years or decades to recover from.`;
  }

  // Unintended consequences
  if (ratios.infrastructure > 1.3 && ratios.energy < 1.0) {
    unintendedConsequences.push('Overbuilt road infrastructure without matching electric generation created underutilized industrial corridors.');
  }
  if (ratios.agriculture < 0.8 && ratios.infrastructure > 1.2) {
    unintendedConsequences.push('Prioritizing mega-transit projects while underfunding smallholder agriculture forced the nation to spend precious foreign exchange on emergency food imports.');
  }
  if (ratios.education < 0.8 && ratios.governance > 1.1) {
    unintendedConsequences.push('Maintaining high state administrative machinery while starving schools resulted in thousands of youth entering the labor market without technical skills.');
  }
  if (ratios.health < 0.8 && ratios.socialProtection < 0.8) {
    unintendedConsequences.push('Dual cuts to healthcare and cash stipends pushed over 1.5 million low-income households below the vulnerability threshold.');
  }
  if (unintendedConsequences.length === 0) {
    unintendedConsequences.push('Carefully matched spending avoided any severe catastrophic bottlenecks.');
  }

  return { title, description, unintendedConsequences };
}
