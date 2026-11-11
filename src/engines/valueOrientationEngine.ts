import {
  ArchetypeName,
  ValueOrientationSliders,
  ValueOrientationWeights,
} from '../types/domain';

export const FORMULA_VERSION = 'v1.0-sec9-calibrated';

// VO-6: Written mapping table from the four archetypes to the underlying factor weights
export const ARCHETYPE_BASE_WEIGHTS: Record<ArchetypeName, ValueOrientationWeights> = {
  Maximizer: {
    gapsClosed: 0.25,
    credibility: 0.30,
    funding: 0.10,
    networkAndMentor: 0.15,
    impactAlignment: 0.00,
    disruptionCost: 0.10,
    delayToPayoff: 0.10,
  },
  'Balanced Builder': {
    gapsClosed: 0.25,
    credibility: 0.10,
    funding: 0.15,
    networkAndMentor: 0.15,
    impactAlignment: 0.00,
    disruptionCost: 0.20,
    delayToPayoff: 0.15,
  },
  'Stability Seeker': {
    gapsClosed: 0.20,
    credibility: 0.05,
    funding: 0.20,
    networkAndMentor: 0.10,
    impactAlignment: 0.00,
    disruptionCost: 0.30,
    delayToPayoff: 0.15,
  },
  'Mission-Driven': {
    gapsClosed: 0.25,
    credibility: 0.05,
    funding: 0.10,
    networkAndMentor: 0.10,
    impactAlignment: 0.30,
    disruptionCost: 0.10,
    delayToPayoff: 0.10,
  },
};

export const ARCHETYPE_DESCRIPTIONS: Record<
  ArchetypeName,
  {
    tagline: string;
    optimizesFor: string;
    plainExplanation: string; // VO-7: Explain in plain words how orientation affects what the user sees
    unpaidPrestigeRankNote: string;
  }
> = {
  Maximizer: {
    tagline: 'Ceiling, prestige & differentiation',
    optimizesFor: 'Prestige, differentiation, long-term ceiling; willing to trade stability, money, or time now.',
    plainExplanation:
      'Your orientation boosts high-credibility fellowships and breakthrough opportunities (+0.30 Halo weight) while tolerating higher relocation or short-term disruption costs.',
    unpaidPrestigeRankNote: 'High — if it closes critical gaps and carries strong halo credibility',
  },
  'Balanced Builder': {
    tagline: 'Steady, compounding competence (Default)',
    optimizesFor: 'Steady, compounding competence and a strong profile without reckless disruption.',
    plainExplanation:
      'Your orientation balances gap closure (+0.25) and practical funding/mentorship (+0.15 each) while penalizing heavy disruption (-0.20) that would derail your current roadmap.',
    unpaidPrestigeRankNote: 'Medium — good, but not worth disrupting the current plan',
  },
  'Stability Seeker': {
    tagline: 'Income security, predictability & low disruption',
    optimizesFor: 'Income security, financial predictability, and work-life stability.',
    plainExplanation:
      'Your orientation prioritizes paid, low-disruption opportunities (+0.20 Funding, -0.30 Disruption penalty) and down-weights unpaid prestige labels (+0.05 Halo).',
    unpaidPrestigeRankNote: 'Low — even if objectively prestigious, unpaid relocation is heavily penalized',
  },
  'Mission-Driven': {
    tagline: 'Community impact & cause alignment',
    optimizesFor: 'Impact or alignment with a public, health, civic, or community cause over conventional prestige.',
    plainExplanation:
      'Your orientation applies a dedicated +0.30 weight to Impact & Community Alignment alongside +0.25 for Gap Closure, surfacing mission-aligned fellowships first.',
    unpaidPrestigeRankNote: 'Depends on mission fit — high only if directly advancing your cause and closing gaps',
  },
};

const round2 = (n: number) => Math.round(n * 100) / 100;
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

/**
 * VO-2 & VO-3: Computes effective weights from the selected archetype + the 3 bounded sliders (-2 to +2).
 * When sliders are at {0, 0, 0}, returns the exact ARCHETYPE_BASE_WEIGHTS (guaranteeing exact Section 9 math).
 */
export function computeWeightsFromArchetypeAndSliders(
  archetype: ArchetypeName,
  sliders: ValueOrientationSliders
): ValueOrientationWeights {
  const base = ARCHETYPE_BASE_WEIGHTS[archetype];

  // Each slider step (-2 to +2) nudges the relevant weights by 0.03
  const oDelta = sliders.orientation * 0.03; // + boosts credibility/impact, - boosts funding
  const rDelta = sliders.riskAppetite * 0.03; // + reduces disruptionCost penalty, - increases disruptionCost penalty
  const tDelta = sliders.timeHorizon * 0.03; // + reduces delayToPayoff penalty & boosts network, - increases delayToPayoff penalty

  return {
    gapsClosed: round2(clamp(base.gapsClosed + (sliders.orientation > 0 ? 0.01 * sliders.orientation : 0), 0.1, 0.45)),
    credibility: round2(
      clamp(
        archetype === 'Mission-Driven' ? base.credibility + oDelta * 0.5 : base.credibility + oDelta,
        0.02,
        0.45
      )
    ),
    funding: round2(clamp(base.funding - oDelta * 0.5 - rDelta * 0.5, 0.05, 0.40)),
    networkAndMentor: round2(clamp(base.networkAndMentor + tDelta * 0.5, 0.05, 0.35)),
    impactAlignment: round2(
      clamp(
        archetype === 'Mission-Driven'
          ? base.impactAlignment + oDelta
          : base.impactAlignment + (sliders.orientation > 0 ? sliders.orientation * 0.02 : 0),
        0.0,
        0.45
      )
    ),
    disruptionCost: round2(clamp(base.disruptionCost - rDelta, 0.05, 0.45)),
    delayToPayoff: round2(clamp(base.delayToPayoff - tDelta, 0.05, 0.40)),
  };
}
