import {
  CareerIdentityItem,
  ConsentState,
  EvaluatedOpportunity,
  FunnelStageStatus,
  Gap,
  LeverageLevel,
  Opportunity,
  OpportunityLifecycleStatus,
  ScoreBreakdown,
  ScoreFactorBreakdown,
  UserProfile,
  ValueOrientationState,
} from '../types/domain';
import { FORMULA_VERSION } from './valueOrientationEngine';

export const OPPORTUNITY_CURATED_CAP = 4; // OP-9: Hard cap in UI and engine so users are never overwhelmed

const round2 = (n: number) => Math.round(n * 100) / 100;

export function classifyLeverageLevel(score: number): LeverageLevel {
  // Exact Section 9 thresholds:
  // Exceptional at 5.0 or above, High Leverage 3.5 to 4.99, Normal 2.0 to 3.49, Low fit below 2.0
  if (score >= 5.0) return 'Exceptional';
  if (score >= 3.5) return 'High Leverage';
  if (score >= 2.0) return 'Normal';
  return 'Low fit';
}

/**
 * LV-1 to LV-7: Deterministic Leverage Scoring Function
 * Score = sum(weight * benefit) - sum(weight * cost)
 */
export function scoreOpportunityForUser(
  opportunity: Opportunity,
  valueOrientation: ValueOrientationState,
  openGaps: Gap[]
): ScoreBreakdown {
  const { weights, archetype } = valueOrientation;
  const { facts } = opportunity;

  // LV-2 Combo Effect: how many of the user's open gaps does this opportunity help close?
  const matchedGaps = openGaps.filter(
    (g) => g.status !== 'Evidenced' && opportunity.closesGapTags.some((tag) => g.requirementId.includes(tag) || opportunity.closesGapTags.length > 0)
  );
  const comboTitles = opportunity.closesGapTags.map((tag) => {
    if (tag === 'degree-completed') return 'Primary Academic / Credential Requirement';
    if (tag === 'licensing-exam') return 'Professional Licensing / Qualifying Examination';
    if (tag === 'practical-experience') return 'Supervised Practical / Clinical / Engineering Portfolio';
    if (tag === 'research-output') return 'Published Research / Technical Output';
    if (tag === 'language-verified') return 'Language & Visa Regulatory Clearance';
    return tag;
  });

  const factors: ScoreFactorBreakdown[] = [
    {
      factorKey: 'gapsClosed',
      label: `Gaps closed (${facts.gapsClosed})`,
      kind: 'benefit',
      factValue: facts.gapsClosed,
      weightApplied: weights.gapsClosed,
      weightedContribution: round2(facts.gapsClosed * weights.gapsClosed),
    },
    {
      factorKey: 'credibility',
      label: `Credibility / halo (${facts.credibility})`,
      kind: 'benefit',
      factValue: facts.credibility,
      weightApplied: weights.credibility,
      weightedContribution: round2(facts.credibility * weights.credibility),
    },
    {
      factorKey: 'funding',
      label: `Funding (${facts.funding})`,
      kind: 'benefit',
      factValue: facts.funding,
      weightApplied: weights.funding,
      weightedContribution: round2(facts.funding * weights.funding),
    },
    {
      factorKey: 'networkAndMentor',
      label: `Network and mentor (${facts.networkAndMentor})`,
      kind: 'benefit',
      factValue: facts.networkAndMentor,
      weightApplied: weights.networkAndMentor,
      weightedContribution: round2(facts.networkAndMentor * weights.networkAndMentor),
    },
  ];

  // Include Impact Alignment factor when weight > 0 (e.g. Mission-Driven or nudged slider)
  if (weights.impactAlignment > 0) {
    factors.push({
      factorKey: 'impactAlignment',
      label: `Impact & cause alignment (${facts.impactAlignment})`,
      kind: 'benefit',
      factValue: facts.impactAlignment,
      weightApplied: weights.impactAlignment,
      weightedContribution: round2(facts.impactAlignment * weights.impactAlignment),
    });
  }

  factors.push(
    {
      factorKey: 'disruptionCost',
      label: `Disruption cost (${facts.disruptionCost}), subtracted`,
      kind: 'cost',
      factValue: facts.disruptionCost,
      weightApplied: weights.disruptionCost,
      weightedContribution: -round2(facts.disruptionCost * weights.disruptionCost),
    },
    {
      factorKey: 'delayToPayoff',
      label: `Delay to payoff (${facts.delayToPayoff}), subtracted`,
      kind: 'cost',
      factValue: facts.delayToPayoff,
      weightApplied: weights.delayToPayoff,
      weightedContribution: -round2(facts.delayToPayoff * weights.delayToPayoff),
    }
  );

  const totalBenefits = round2(
    factors.filter((f) => f.kind === 'benefit').reduce((sum, f) => sum + f.weightedContribution, 0)
  );
  const totalCosts = round2(
    factors.filter((f) => f.kind === 'cost').reduce((sum, f) => sum + Math.abs(f.weightedContribution), 0)
  );

  const rawScore = round2(totalBenefits - totalCosts);
  const uncappedLevel = classifyLeverageLevel(rawScore);

  // Requirement OP-6: Only verified opportunities can be High Leverage or Exceptional.
  // An unverified item caps at Normal.
  const isVerified = opportunity.verification.state === 'verified';
  let finalLevel: LeverageLevel = uncappedLevel;
  let wasCappedByVerification = false;

  if (!isVerified && (uncappedLevel === 'Exceptional' || uncappedLevel === 'High Leverage')) {
    finalLevel = 'Normal';
    wasCappedByVerification = true;
  }

  const haloNote =
    weights.credibility >= 0.25
      ? `Halo credibility (${facts.credibility}/10) is heavily weighted (${weights.credibility}) under your ${archetype} profile.`
      : `Halo credibility (${facts.credibility}/10) is weighted modestly (${weights.credibility}) so prestige alone does not override stability or mission fit.`;

  const explanationSentence = wasCappedByVerification
    ? `Raw score is ${rawScore.toFixed(2)} (${uncappedLevel} for ${archetype}), but capped at Normal because verification state is "${opportunity.verification.state}" (Rule OP-6).`
    : `Scored ${rawScore.toFixed(2)} (${finalLevel}) for your ${archetype} profile: +${totalBenefits.toFixed(2)} weighted benefits minus ${totalCosts.toFixed(2)} weighted disruption/delay costs.`;

  return {
    opportunityId: opportunity.id,
    formulaVersion: FORMULA_VERSION,
    archetype,
    factors,
    totalBenefits,
    totalCosts,
    rawScore,
    uncappedLevel,
    finalLevel,
    wasCappedByVerification,
    comboGapsClosedCount: Math.max(matchedGaps.length, opportunity.closesGapTags.length),
    comboGapsTitles: comboTitles,
    haloNote,
    explanationSentence,
  };
}

/**
 * OP-2 & OP-3: Apply the 7-stage funnel to every opportunity for the current user
 */
export function evaluateOpportunityFunnel(
  opportunity: Opportunity,
  user: UserProfile,
  identityItems: CareerIdentityItem[],
  consent: ConsentState,
  breakdown: ScoreBreakdown
): FunnelStageStatus {
  const ineligibleReasons: string[] = [];
  const accessibilityNotes: string[] = [];

  // Stage 1: Everything Available (except rejected scams)
  const stage1_available = opportunity.verification.state !== 'rejected';
  if (!stage1_available) {
    ineligibleReasons.push('Rejected by North Curation Team due to failed verification.');
  }

  // Stage 2: Relevant to Your Career
  const stage2_relevantToCareer =
    stage1_available &&
    (opportunity.targetCareerIds === 'all' ||
      opportunity.targetCareerIds.includes(user.goalCareerId));

  // Stage 3: Eligible for You (OP-3: state failing rule when ineligible)
  const activeConstraintTags = new Set(
    identityItems
      .filter((item) => {
        if (item.category !== 'constraint') return true;
        if (item.constraintSubType === 'finances' && !consent.finances.granted) return false;
        if (item.constraintSubType === 'visa' && !consent.visa.granted) return false;
        if (item.constraintSubType === 'geography' && !consent.geography.granted) return false;
        if (item.constraintSubType === 'barriers' && !consent.barriers.granted) return false;
        return true;
      })
      .map((i) => i.matchTag)
  );

  for (const rule of opportunity.eligibilityRules) {
    if (rule.disallowedConstraintTag && activeConstraintTags.has(rule.disallowedConstraintTag)) {
      ineligibleReasons.push(`Fails rule: "${rule.description}" (conflicts with your recorded funding/constraint profile).`);
    }
  }
  const stage3_eligibleForYou = stage2_relevantToCareer && ineligibleReasons.length === 0;

  // Stage 4: Realistically Accessible
  const stage4_realisticallyAccessible =
    stage3_eligibleForYou && opportunity.verification.state !== 'questionable';
  if (opportunity.verification.state === 'questionable') {
    accessibilityNotes.push('Flagged as questionable provenance; hidden from active recommendations.');
  }

  // Stage 5: Potentially Valuable (Combo effect >= 1 gap closed)
  const stage5_potentiallyValuable =
    stage4_realisticallyAccessible && breakdown.comboGapsClosedCount > 0;

  // Stage 6: Worth Your Time (Not Low fit for this user's Value Orientation)
  const stage6_worthYourTime =
    stage5_potentiallyValuable && breakdown.finalLevel !== 'Low fit';

  // Stage 7: Recommended Action
  const stage7_recommendedAction = stage6_worthYourTime;

  return {
    stage1_available,
    stage2_relevantToCareer,
    stage3_eligibleForYou,
    stage4_realisticallyAccessible,
    stage5_potentiallyValuable,
    stage6_worthYourTime,
    stage7_recommendedAction,
    ineligibleReasons,
    accessibilityNotes,
  };
}

export function evaluateAllOpportunitiesForUser(
  opportunities: Opportunity[],
  user: UserProfile,
  valueOrientation: ValueOrientationState,
  identityItems: CareerIdentityItem[],
  consent: ConsentState,
  openGaps: Gap[],
  lifecycleMap: Record<string, { status: OpportunityLifecycleStatus; history: Array<{ status: OpportunityLifecycleStatus; timestamp: string }>; dismissed?: boolean }>
): EvaluatedOpportunity[] {
  const evaluated = opportunities.map((opportunity) => {
    const breakdown = scoreOpportunityForUser(opportunity, valueOrientation, openGaps);
    const funnel = evaluateOpportunityFunnel(opportunity, user, identityItems, consent, breakdown);
    const savedState = lifecycleMap[opportunity.id];
    const lifecycleStatus = savedState?.status || 'Discovered';
    const lifecycleHistory = savedState?.history || [
      { status: 'Discovered', timestamp: '2026-11-09T09:00:00Z' },
    ];
    const isDismissed = Boolean(savedState?.dismissed);

    // LV-5: Only Exceptional can trigger an immediate alert, and only if Verified
    const isImmediateAlertEligible =
      breakdown.finalLevel === 'Exceptional' &&
      opportunity.verification.state === 'verified' &&
      funnel.stage7_recommendedAction &&
      !isDismissed;

    return {
      opportunity,
      lifecycleStatus,
      lifecycleHistory,
      funnel,
      breakdown,
      isImmediateAlertEligible,
      isDismissed,
    };
  });

  // Sort by: Stage 7 passed first, then Verified status, then rawScore descending
  return evaluated.sort((a, b) => {
    if (a.funnel.stage7_recommendedAction !== b.funnel.stage7_recommendedAction) {
      return a.funnel.stage7_recommendedAction ? -1 : 1;
    }
    return b.breakdown.rawScore - a.breakdown.rawScore;
  });
}
