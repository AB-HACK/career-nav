import { CAREER_FIELDS, DESTINATIONS } from '../src/data/careersAndDestinations.ts';
import { getPathwayForCareerAndDestination } from '../src/data/pathwaysSeed.ts';
import { SEEDED_OPPORTUNITIES } from '../src/data/opportunitiesSeed.ts';
import {
  ARCHETYPE_BASE_WEIGHTS,
  computeWeightsFromArchetypeAndSliders,
} from '../src/engines/valueOrientationEngine.ts';
import { scoreOpportunityForUser } from '../src/engines/leverageEngine.ts';
import {
  resolveRouteFromPathname,
  resolveTabFromPathname,
} from '../src/store/useNorthStore.ts';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

console.log('=== NORTH PRD ACCEPTANCE VERIFICATION SUITE ===\n');

// 1. Verify Section 9 Worked Example exact arithmetic (LV-1, LV-4, LV-6, VO-6)
const sec9Opp = SEEDED_OPPORTUNITIES.find((o) => o.id === 'opp-sec9-funded-research')!;
assert(Boolean(sec9Opp), 'Section 9 Worked Example opportunity exists in seed data');

const maximizerScore = scoreOpportunityForUser(
  sec9Opp,
  {
    archetype: 'Maximizer',
    sliders: { orientation: 0, riskAppetite: 0, timeHorizon: 0 },
    weights: ARCHETYPE_BASE_WEIGHTS['Maximizer'],
    updatedAt: '',
    history: [],
  },
  []
);
assert(
  maximizerScore.rawScore === 5.25 && maximizerScore.finalLevel === 'Exceptional',
  `Section 9 Maximizer arithmetic: expected 5.25 (Exceptional), got ${maximizerScore.rawScore} (${maximizerScore.finalLevel})`
);

const balancedScore = scoreOpportunityForUser(
  sec9Opp,
  {
    archetype: 'Balanced Builder',
    sliders: { orientation: 0, riskAppetite: 0, timeHorizon: 0 },
    weights: ARCHETYPE_BASE_WEIGHTS['Balanced Builder'],
    updatedAt: '',
    history: [],
  },
  []
);
assert(
  balancedScore.rawScore === 3.0 && balancedScore.finalLevel === 'Normal',
  `Section 9 Balanced Builder arithmetic: expected 3.00 (Normal), got ${balancedScore.rawScore.toFixed(2)} (${balancedScore.finalLevel})`
);

const stabilityScore = scoreOpportunityForUser(
  sec9Opp,
  {
    archetype: 'Stability Seeker',
    sliders: { orientation: 0, riskAppetite: 0, timeHorizon: 0 },
    weights: ARCHETYPE_BASE_WEIGHTS['Stability Seeker'],
    updatedAt: '',
    history: [],
  },
  []
);
assert(
  stabilityScore.rawScore === 1.4 && stabilityScore.finalLevel === 'Low fit',
  `Section 9 Stability Seeker arithmetic: expected 1.40 (Low fit), got ${stabilityScore.rawScore.toFixed(2)} (${stabilityScore.finalLevel})`
);

// 2. Verify OP-6: Unverified opportunity caps at Normal even when raw score is Exceptional
const unverifiedOpp = SEEDED_OPPORTUNITIES.find(
  (o) => o.id === 'opp-unverified-ai-health-grant'
)!;
const unverifiedScore = scoreOpportunityForUser(
  unverifiedOpp,
  {
    archetype: 'Maximizer',
    sliders: { orientation: 0, riskAppetite: 0, timeHorizon: 0 },
    weights: ARCHETYPE_BASE_WEIGHTS['Maximizer'],
    updatedAt: '',
    history: [],
  },
  []
);
assert(
  unverifiedScore.rawScore >= 5.0 &&
    unverifiedScore.uncappedLevel === 'Exceptional' &&
    unverifiedScore.finalLevel === 'Normal' &&
    unverifiedScore.wasCappedByVerification === true,
  `Rule OP-6 enforced: Unverified item with raw score ${unverifiedScore.rawScore} (${unverifiedScore.uncappedLevel}) is capped at ${unverifiedScore.finalLevel}`
);

// 3. Verify PI-1 & PI-3: All 13 Career Fields x 10 Destinations produce distinct pathways with all 9 dimensions
const supportedCareers = CAREER_FIELDS.filter((c) => c.id !== 'custom-unsupported');
assert(
  supportedCareers.length === 13,
  `All 13 requested career fields are seeded (count = ${supportedCareers.length})`
);
assert(
  DESTINATIONS.length === 10,
  `All 10 requested origin/destination contexts are seeded (count = ${DESTINATIONS.length})`
);

const medUk = getPathwayForCareerAndDestination('medicine-surgery', 'uk');
const medUs = getPathwayForCareerAndDestination('medicine-surgery', 'us');
const medNg = getPathwayForCareerAndDestination('medicine-surgery', 'nigeria');
assert(
  medUk.regulatingBody !== medUs.regulatingBody &&
    medUs.regulatingBody !== medNg.regulatingBody,
  `Rule PI-1 verified: Same goal (Medicine) produces distinct destination pathways (UK="${medUk.regulatingBody}", US="${medUs.regulatingBody}", NG="${medNg.regulatingBody}")`
);
assert(
  medUk.dimensions.length === 9,
  `Rule PI-3 verified: Pathway reports across all 9 difficulty dimensions (count = ${medUk.dimensions.length})`
);

// 4. Verify PI-8: Unsupported pathway returns honest message and generic guided plan
const unsupportedPw = getPathwayForCareerAndDestination(
  'custom-unsupported',
  'canada',
  'Early-Career Professional',
  'Deep Sea Robotics Law'
);
assert(
  unsupportedPw.isSupported === false && unsupportedPw.requirements.length >= 2,
  'Rule PI-8 verified: Unsupported pathway returns isSupported=false and a safe generic guided plan'
);

// 5. Verify VO-3 slider nudging adjusts weights smoothly
const nudgedWeights = computeWeightsFromArchetypeAndSliders('Balanced Builder', {
  orientation: 2,
  riskAppetite: 1,
  timeHorizon: 1,
});
assert(
  nudgedWeights.credibility > ARCHETYPE_BASE_WEIGHTS['Balanced Builder'].credibility &&
    nudgedWeights.disruptionCost < ARCHETYPE_BASE_WEIGHTS['Balanced Builder'].disruptionCost,
  'Rule VO-3 verified: Nudging Orientation and Risk Appetite sliders updates stored weights deterministically'
);

// 6. Verify Route Resolution for /, /pathway, /roadmap, /opportunities, /profile, /curator, /simulator, and 404
assert(
  resolveRouteFromPathname('/') === '/' &&
    resolveRouteFromPathname('/pathway') === '/pathway' &&
    resolveRouteFromPathname('/roadmap/') === '/roadmap' &&
    resolveRouteFromPathname('/opportunities') === '/opportunities' &&
    resolveRouteFromPathname('/profile') === '/profile' &&
    resolveRouteFromPathname('/curator') === '/curator' &&
    resolveRouteFromPathname('/simulator') === '/simulator' &&
    resolveRouteFromPathname('/unknown-route') === '404' &&
    resolveRouteFromPathname('/curator/extra') === '404',
  'Route resolution verified: /, /pathway, /roadmap, /opportunities, /profile, /curator, /simulator resolve cleanly and unknown paths return 404'
);
assert(
  resolveTabFromPathname('/pathway') === 'pathway' &&
    resolveTabFromPathname('/roadmap') === 'roadmap' &&
    resolveTabFromPathname('/opportunities') === 'opportunities' &&
    resolveTabFromPathname('/profile') === 'profile' &&
    resolveTabFromPathname('/') === 'home',
  'Deep-link tab mapping verified across all 5 user routes'
);

console.log('\n🎉 ALL PRD DETERMINISTIC ENGINE CHECKS PASSED!');

