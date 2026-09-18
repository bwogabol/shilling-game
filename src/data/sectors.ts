import { SectorInfo, BudgetMap } from '../types/game';

export const TOTAL_BUDGET_LIMIT = 3000; // in Billions KSh (3.0 Trillion)

export const SECTORS: SectorInfo[] = [
  {
    id: 'health',
    name: 'Healthcare & Public Health',
    category: 'Basic Needs',
    icon: 'HeartPulse',
    baseline: 170,
    min: 30,
    max: 600,
    description: 'Level 4-6 referral hospitals, primary clinics, universal health coverage subsidies, medical supplies, and epidemic containment.',
    keyPrograms: ['Universal Health Coverage', 'County Referral Modernization', 'Vaccine & Pharmaceutical Supply Chains', 'Community Health Promoters'],
    riskWarning: 'Underfunding leads to drug stockouts, infant mortality spikes, and paralyzing medical worker strikes.',
    synergyNotes: 'High health funding amplifies worker productivity from Education and reduces Social Protection strain.'
  },
  {
    id: 'education',
    name: 'Education & TVET Skills',
    category: 'Social Services',
    icon: 'GraduationCap',
    baseline: 620,
    min: 200,
    max: 1100,
    description: 'Free primary and secondary schooling, technical vocational colleges (TVET), university funding, and teacher compensation.',
    keyPrograms: ['Competency-Based Curriculum (CBC)', 'TVET Industrial Tooling', 'Teacher Service Commission (TSC) Hiring', 'Higher Education Student Loans'],
    riskWarning: 'Underfunding triggers severe teacher shortages, classroom overcrowding, and school dropouts.',
    synergyNotes: 'Compounding impact: Pays immense dividends in Year 5 and Year 10 for GDP growth and digital innovation.'
  },
  {
    id: 'agriculture',
    name: 'Agriculture & Food Security',
    category: 'Economic Backbone',
    icon: 'Sprout',
    baseline: 70,
    min: 15,
    max: 400,
    description: 'Fertilizer subsidies, crop insurance, grain reserves, pest control, post-harvest cold storage, and livestock disease prevention.',
    keyPrograms: ['Targeted Fertilizer & Seed Vouchers', 'Strategic Food Reserve Expansion', 'Livestock Drought Resettlement', 'Post-Harvest Hermetic Silos'],
    riskWarning: 'Slashing agriculture causes instant food inflation, rural hunger, and multi-billion shilling emergency import bills.',
    synergyNotes: 'Pairs exponentially with Water (Irrigation) and Infrastructure (Farm-to-market roads).'
  },
  {
    id: 'infrastructure',
    name: 'Transport & Infrastructure',
    category: 'Economic Backbone',
    icon: 'HardHat',
    baseline: 450,
    min: 100,
    max: 950,
    description: 'Highways, standard gauge rail maintenance, rural access roads, Lamu & Mombasa port operations, and urban rapid transit.',
    keyPrograms: ['Rural Access Roads Programme', 'Port Logistics Expansion', 'SGR Freight Optimization', 'Bypass & Urban Arteries'],
    riskWarning: 'Underfunding causes rapid road deterioration; overfunding without maintenance or energy causes idle white elephants and runaway debt.',
    synergyNotes: 'Connects agricultural produce to ports and cities; unlocks industrial park logistics.'
  },
  {
    id: 'security',
    name: 'Internal Security & Defence',
    category: 'State Resilience',
    icon: 'Shield',
    baseline: 380,
    min: 150,
    max: 750,
    description: 'National Police Service, Kenya Defence Forces (KDF), counter-terrorism surveillance, border patrols, and livestock anti-theft operations.',
    keyPrograms: ['Police Modernization & Housing', 'Northern Corridor Patrols', 'National Cyber Command', 'Maritime & Border Surveillance'],
    riskWarning: 'Underfunding sparks surges in banditry, urban crime, and regional cross-border security shocks.',
    synergyNotes: 'A prerequisite for investor confidence, tourism revenue, and unimpeded transport corridors.'
  },
  {
    id: 'water',
    name: 'Water & Irrigation Schemes',
    category: 'Basic Needs',
    icon: 'Droplets',
    baseline: 80,
    min: 20,
    max: 400,
    description: 'National multipurpose dams, rural community boreholes, urban water sanitation networks, and large-scale drip irrigation schemes.',
    keyPrograms: ['Galana-Kulalu & Arid Irrigation', 'Smart Urban Aqueducts', 'Solar Borehole Pumping', 'Water Basin Catchment Conservation'],
    riskWarning: 'Water scarcity cripples agriculture, forces women and children to trek miles for water, and sparks urban water rationing.',
    synergyNotes: 'Unlocks agriculture potential, curbs waterborne diseases, and stabilizes hydroelectric power supply.'
  },
  {
    id: 'energy',
    name: 'Energy & Rural Electrification',
    category: 'Economic Backbone',
    icon: 'Zap',
    baseline: 110,
    min: 30,
    max: 450,
    description: 'Olkaria geothermal expansion, national grid modernization, Last-Mile rural connections, and solar mini-grids for off-grid counties.',
    keyPrograms: ['Geothermal Phase VII Drilling', 'Last-Mile Electric Grid Extension', 'Clean Cooking Gas Vouchers', 'Industrial Substation Upgrades'],
    riskWarning: 'Underfunding leads to frequent grid blackouts, high manufacturing tariffs, and reliance on expensive emergency diesel generators.',
    synergyNotes: 'Drives factory automation, irrigational pumps, hospital life support, and digital labs in schools.'
  },
  {
    id: 'housing',
    name: 'Affordable Housing & Urbanization',
    category: 'Basic Needs',
    icon: 'Home',
    baseline: 100,
    min: 20,
    max: 450,
    description: 'Public-private affordable housing estates, informal settlement slum upgrading (water/power), and mortgage liquidity facilities.',
    keyPrograms: ['Slum Infrastructure Upgrading', 'County Affordable Housing Units', 'Low-Interest Mortgage Guarantees', 'Spatial Urban Planning'],
    riskWarning: 'Neglect accelerates dangerous urban sprawl, unsafe tenements, sanitation collapse, and fire hazards in informal settlements.',
    synergyNotes: 'Acts as a major short-term job creator for masonry, electrical, and carpentry artisans.'
  },
  {
    id: 'socialProtection',
    name: 'Social Protection & Safety Nets',
    category: 'Social Services',
    icon: 'Users',
    baseline: 90,
    min: 20,
    max: 350,
    description: 'Inua Jamii cash transfers for orphans and the elderly, disability stipends, drought hunger safety nets, and school lunch programs.',
    keyPrograms: ['Inua Jamii Cash Transfer Scheme', 'Universal Primary School Milk/Lunch', 'Drought Relief Contingency Fund', 'Disability Inclusion Fund'],
    riskWarning: 'Cutting safety nets immediately plunges the bottom 20% into extreme distress and depresses school attendance in arid zones.',
    synergyNotes: 'Directly injects purchasing power into local village markets; boosts school attendance and nutritional stability.'
  },
  {
    id: 'governance',
    name: 'Governance & Devolution (Counties)',
    category: 'State Resilience',
    icon: 'Landmark',
    baseline: 930,
    min: 400,
    max: 1400,
    description: 'Equitable revenue share to all 47 County Governments, Kenya Revenue Authority collection infrastructure, judiciary, parliament, and anti-corruption.',
    keyPrograms: ['County Equitable Share Disbursement', 'KRA Digital Tax Modernization', 'Judiciary Digitization & Court Stations', 'EACC Anti-Graft Audits'],
    riskWarning: 'Delaying or cutting county disbursements paralyzes local hospitals and garbage collection, sparking nationwide county shutdowns.',
    synergyNotes: 'Crucial for tax collection capacity: efficient tax administration expands future budget resources.'
  }
];

export const INITIAL_ALLOCATIONS: BudgetMap = {
  health: 170,
  education: 620,
  agriculture: 70,
  infrastructure: 450,
  security: 380,
  water: 80,
  energy: 110,
  housing: 100,
  socialProtection: 90,
  governance: 930
};
