import { PolicyDoctrine } from '../types/game';

export const POLICY_DOCTRINES: PolicyDoctrine[] = [
  {
    id: 'balanced',
    title: 'Harambee Prosperity (Balanced Doctrine)',
    tagline: 'Equitable progress across basic services and economic lifelines.',
    description: 'A pragmatic, consensus-driven fiscal strategy aimed at maintaining stability, avoiding sectoral starvation, and steadily building national capabilities.',
    focusSectors: ['governance', 'education', 'infrastructure'],
    bonuses: [
      '+5% Public Trust baseline bonus',
      'Smoother public debt stabilization',
      'Balanced resilience across all 47 counties'
    ]
  },
  {
    id: 'food_sovereignty',
    title: 'Kilimo Bora & Food Sovereignty',
    tagline: 'Irrigation, grain reserves, and modern agricultural value chains.',
    description: 'Prioritizes rural prosperity, smallholder farmer empowerment, and drought-proofing the country through synchronized investments in Agriculture and Water.',
    focusSectors: ['agriculture', 'water', 'socialProtection'],
    bonuses: [
      '+25% Food Security impact multiplier',
      'Insulates the economy from global food commodity price shocks',
      'Lowers headline food inflation by up to 2.5%'
    ]
  },
  {
    id: 'industrial_leap',
    title: 'Silicon Savannah & Logistics Powerhouse',
    tagline: 'Superhighways, geothermal grid, ports, and industrial parks.',
    description: 'An aggressive capital-investment sprint to turn Kenya into Eastern Africa’s logistics and manufacturing hub through heavy Infrastructure and Energy commitments.',
    focusSectors: ['infrastructure', 'energy'],
    bonuses: [
      '+1.2% GDP potential bonus over 5 to 10 years',
      'Accelerates urban private job creation',
      'Risk: Elevated debt servicing pressure if revenues lag'
    ]
  },
  {
    id: 'human_capital',
    title: 'Elimu & Afya (Human Capital Leap)',
    tagline: 'Universal health coverage, STEM education, and artisan tooling.',
    description: 'Believes the nation’s greatest asset is its people. Heavily invests in teachers, medical research, vocational technical colleges, and social safety nets.',
    focusSectors: ['education', 'health', 'socialProtection'],
    bonuses: [
      '+15% Human Development Index (HDI) growth rate',
      'Compounds into higher workforce productivity by Year 10',
      'Significantly lowers extreme poverty indices'
    ]
  },
  {
    id: 'fiscal_discipline',
    title: 'Uchumi Imara (Fiscal Consolidation & Reform)',
    tagline: 'Debt reduction, anti-corruption, and efficient revenue collection.',
    description: 'A disciplined doctrine focused on pruning waste, strengthening revenue mobilization via KRA digitization, safeguarding devolution transfers, and reigning in borrowing.',
    focusSectors: ['governance', 'security'],
    bonuses: [
      'Accelerates Public Debt-to-GDP reduction by up to -8%',
      'Cuts sovereign borrowing interest rates',
      'Strengthens anti-graft enforcement in county and state corporations'
    ]
  }
];
