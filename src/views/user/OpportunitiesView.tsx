import React, { useState } from 'react';
import {
  Filter,
  Calculator,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import {
  EvaluatedOpportunity,
  OpportunityLifecycleStatus,
  OpportunityType,
} from '../../types/domain';
import { OPPORTUNITY_CURATED_CAP } from '../../engines/leverageEngine';
import { useNorthStore } from '../../store/useNorthStore';
import { VerificationBadge } from '../../components/shared/VerificationBadge';

interface OpportunitiesViewProps {
  evaluatedOpportunities: EvaluatedOpportunity[];
}

const LIFECYCLE_STEPS: OpportunityLifecycleStatus[] = [
  'Discovered',
  'Interested',
  'Preparing',
  'Submitted',
  'Shortlisted',
  'Accepted',
  'Rejected',
  'Completed',
];

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  evaluatedOpportunities,
}) => {
  const valueOrientation = useNorthStore((s) => s.valueOrientation);
  const updateOpportunityLifecycle = useNorthStore(
    (s) => s.updateOpportunityLifecycle
  );
  const dismissOpportunity = useNorthStore((s) => s.dismissOpportunity);
  const setActiveBreakdownOpportunityId = useNorthStore(
    (s) => s.setActiveBreakdownOpportunityId
  );
  const setActiveTab = useNorthStore((s) => s.setActiveTab);

  const [viewMode, setViewMode] = useState<'curated' | 'filtered_audit'>('curated');
  const [selectedType, setSelectedType] = useState<OpportunityType | 'All'>('All');
  const isReviewMode =
    import.meta.env.VITE_REVIEW_MODE === 'true' ||
    import.meta.env.VITE_REVIEW_MODE === '1';

  // Count 7-Stage Funnel progression across all records (OP-2)
  const stageCounts = {
    s1_available: evaluatedOpportunities.filter((o) => o.funnel.stage1_available).length,
    s2_relevant: evaluatedOpportunities.filter((o) => o.funnel.stage2_relevantToCareer).length,
    s3_eligible: evaluatedOpportunities.filter((o) => o.funnel.stage3_eligibleForYou).length,
    s4_accessible: evaluatedOpportunities.filter((o) => o.funnel.stage4_realisticallyAccessible).length,
    s5_valuable: evaluatedOpportunities.filter((o) => o.funnel.stage5_potentiallyValuable).length,
    s6_worthTime: evaluatedOpportunities.filter((o) => o.funnel.stage6_worthYourTime).length,
    s7_recommended: evaluatedOpportunities.filter(
      (o) => o.funnel.stage7_recommendedAction && !o.isDismissed
    ).length,
  };

  // OP-9: Show only a small, curated set of opportunities at once (hard cap = OPPORTUNITY_CURATED_CAP)
  const typeFiltered = evaluatedOpportunities.filter(
    (eo) => selectedType === 'All' || eo.opportunity.type === selectedType
  );

  const curatedRecommendations = typeFiltered
    .filter((eo) => eo.funnel.stage7_recommendedAction && !eo.isDismissed)
    .slice(0, OPPORTUNITY_CURATED_CAP);

  const heldBackOrLowFit = typeFiltered.filter(
    (eo) =>
      !eo.funnel.stage7_recommendedAction ||
      eo.breakdown.wasCappedByVerification ||
      eo.isDismissed
  );

  const displayedList =
    viewMode === 'curated' ? curatedRecommendations : heldBackOrLowFit;

  return (
    <div className="space-y-6">
      {/* =====================================================================
          7-STAGE OPPORTUNITY FUNNEL HEADER (Keynote K10, Rules OP-1, OP-2, OP-9)
         ===================================================================== */}
      <header className="bg-[#14161A] text-[#F9F9F7] border-2 border-[#14161A] p-4 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="type-display text-white">
              Curated Opportunity Funnel
            </h1>
            <div className="flex items-center gap-1.5 type-label text-[#93C5FD] mt-1.5">
              <Filter className="w-3.5 h-3.5 shrink-0" />
              <span>7-Stage Eligibility &amp; Fit Filter</span>
            </div>
          </div>
          <span className="text-xs font-mono bg-[#1F242D] border border-[#323846] px-3 py-1.5 text-white shrink-0">
            Max {OPPORTUNITY_CURATED_CAP} Shown
          </span>
        </div>

        <p className="type-dark-body text-[#CBD5E1]">
          Ranked using your <strong>{valueOrientation.archetype}</strong> weights. Select any score badge to inspect the full calculation.
        </p>

        {/* Visual 7-Stage Funnel Bar */}
        <div className="bg-[#1F242D] border border-[#323846] p-3 space-y-1.5 text-xs">
          {[
            { label: '1. Everything Available', count: stageCounts.s1_available, width: 'w-full', tone: 'bg-[#14161A] text-[#CBD5E1]' },
            { label: '2. Relevant to Your Career', count: stageCounts.s2_relevant, width: 'w-11/12', tone: 'bg-[#1B2230] text-[#CBD5E1]' },
            { label: '3. Eligible for You', count: stageCounts.s3_eligible, width: 'w-10/12', tone: 'bg-[#1E293B] text-[#E2E8F0]' },
            { label: '4. Realistically Accessible', count: stageCounts.s4_accessible, width: 'w-9/12', tone: 'bg-[#1E3A8A]/70 text-[#E2E8F0]' },
            { label: '5. Potentially Valuable (Combo)', count: stageCounts.s5_valuable, width: 'w-8/12', tone: 'bg-[#1E3A8A] text-white' },
            { label: '6. Worth Your Time (Not Low-Fit)', count: stageCounts.s6_worthTime, width: 'w-7/12', tone: 'bg-[#1D4ED8] text-white' },
            {
              label: `7. Curated Action (Capped at ${OPPORTUNITY_CURATED_CAP})`,
              count: Math.min(stageCounts.s7_recommended, OPPORTUNITY_CURATED_CAP),
              width: 'w-6/12',
              tone: 'bg-[#D92B2B] text-white font-bold',
            },
          ].map((st) => (
            <div key={st.label} className="flex items-center justify-between gap-2">
              <div
                className={`${st.width} px-2.5 py-1 text-[11px] font-mono truncate ${st.tone}`}
              >
                {st.label}
              </div>
              <span className="font-mono text-xs text-white font-bold shrink-0">
                {st.count}
              </span>
            </div>
          ))}
        </div>

        {/* View Toggle: Curated Funnel Output vs. Filtered/Unverified Audit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={() => setViewMode('curated')}
            className={`min-h-[44px] py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-wider border transition-colors ${
              viewMode === 'curated'
                ? 'bg-[#D92B2B] text-white border-[#D92B2B]'
                : 'bg-[#1F242D] text-[#D1D5DB] border-[#323846] hover:text-white'
            }`}
          >
            Recommended ({curatedRecommendations.length}/{OPPORTUNITY_CURATED_CAP})
          </button>
          <button
            onClick={() => setViewMode('filtered_audit')}
            className={`min-h-[44px] py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-wider border transition-colors ${
              viewMode === 'filtered_audit'
                ? 'bg-amber-400 text-[#14161A] border-amber-400'
                : 'bg-[#1F242D] text-[#D1D5DB] border-[#323846] hover:text-white'
            }`}
          >
            Filtered / Unverified ({heldBackOrLowFit.length})
          </button>
        </div>
      </header>

      {/* Opportunity Type Filter (OP-1) — Touch-friendly horizontal scroll strip */}
      <div
        role="group"
        aria-label="Filter by opportunity type"
        className="flex items-center gap-2 overflow-x-auto pb-1"
      >
        {(
          ['All', 'Fellowship', 'Scholarship', 'Grant', 'Internship', 'Leadership', 'Clinical'] as const
        ).map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`min-h-[44px] px-3.5 py-2 text-xs font-mono font-bold uppercase border shrink-0 transition-colors ${
              selectedType === t
                ? 'bg-[#14161A] text-white border-[#14161A]'
                : 'bg-white text-[#14161A] border-[#D6D5CE] hover:border-[#14161A]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Opportunity Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
        {displayedList.map((eo) => {
          const { opportunity, breakdown, funnel, lifecycleStatus, lifecycleHistory } = eo;

          const levelColors = {
            Exceptional: 'bg-[#1D4ED8] text-white border-[#1D4ED8]',
            'High Leverage': 'bg-[#EFF6FF] text-[#1D4ED8] border-[#1D4ED8]',
            Normal: 'bg-[#F2F1EC] text-[#14161A] border-[#14161A]',
            'Low fit': 'bg-amber-100 text-amber-950 border-amber-500',
          }[breakdown.finalLevel];

          return (
            <article
              key={opportunity.id}
              className="bg-white border-2 border-[#14161A] p-4 sm:p-5 space-y-4"
            >
              {/* Top Row: Type + Immediate Alert Flag + 1-Tap Score Breakdown Button (LV-6) */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 bg-[#F2F1EC] text-[#14161A] border border-[#14161A]">
                    {opportunity.type}
                  </span>
                  {eo.isImmediateAlertEligible && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase px-2.5 py-1 bg-[#D92B2B] text-white">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      Immediate High-Fit Alert
                    </span>
                  )}
                </div>

                {/* LV-6: Tapping any score shows its factors, values and the Value Orientation weights applied */}
                <button
                  onClick={() => setActiveBreakdownOpportunityId(opportunity.id)}
                  className={`min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold border-2 transition-colors ${levelColors}`}
                  title="Inspect full score calculation and Value Orientation weights"
                >
                  <Calculator className="w-4 h-4 shrink-0" />
                  <span>
                    {breakdown.rawScore.toFixed(2)} · {breakdown.finalLevel}
                  </span>
                </button>
              </div>

              {/* Title & Org */}
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-[#14161A] leading-snug">
                  {opportunity.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#4B5563] mt-0.5 font-medium">
                  {opportunity.organization}
                </p>
              </div>

              <p className="text-sm text-[#4B5563] leading-relaxed">
                {opportunity.summary}
              </p>

              {/* OP-5 Deadline Verification Rule */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm bg-[#F2F1EC] px-3 py-2.5 border border-[#D6D5CE]">
                <span className="text-[#4B5563] font-semibold">Deadline:</span>
                {opportunity.isDeadlineVerified ? (
                  <span className="font-mono font-bold text-[#14161A]">
                    {opportunity.deadline} (Verified)
                  </span>
                ) : (
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    Verification required
                  </span>
                )}
              </div>

              {/* OP-6 Unverified Cap Notice */}
              {breakdown.wasCappedByVerification && (
                <div className="bg-amber-50 border-2 border-amber-500 p-3 text-xs sm:text-sm text-amber-950">
                  <strong>Score Capped at Normal:</strong> Raw score is{' '}
                  <span className="font-mono font-bold">{breakdown.rawScore.toFixed(2)}</span> (
                  {breakdown.uncappedLevel}), but capped at <strong>Normal</strong> because verification state is{' '}
                  <code className="font-mono bg-amber-100 px-1">{opportunity.verification.state}</code>.
                  {isReviewMode && (
                    <>
                      {' '}Verify it in <code className="font-mono">/curator</code> to unlock High Leverage / Exceptional status.
                    </>
                  )}
                </div>
              )}

              {/* OP-3 Failing Eligibility Rule if Ineligible */}
              {!funnel.stage3_eligibleForYou && funnel.ineligibleReasons.length > 0 && (
                <div className="bg-rose-50 border-2 border-[#D92B2B] p-3 text-xs sm:text-sm text-rose-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-[#D92B2B] shrink-0" />
                    <span>Ineligible at Stage 3:</span>
                  </div>
                  {funnel.ineligibleReasons.map((reason, i) => (
                    <p key={i}>{reason}</p>
                  ))}
                </div>
              )}

              {/* LV-8 Low-Fit Reasons */}
              {(breakdown.finalLevel === 'Low fit' || viewMode === 'filtered_audit') &&
                opportunity.lowFitReasons.length > 0 && (
                  <div className="bg-[#F2F1EC] border border-[#D6D5CE] p-3 text-xs sm:text-sm text-[#4B5563] space-y-1">
                    <strong className="text-[#14161A] block">
                      Tradeoffs &amp; Fit Notes:
                    </strong>
                    <ul className="list-disc list-inside space-y-0.5 text-xs">
                      {opportunity.lowFitReasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Mandatory Verification Provenance Record (OP-4) */}
              <VerificationBadge
                state={opportunity.verification.state}
                source={opportunity.verification.source}
                organization={opportunity.verification.organization}
                lastVerified={opportunity.verification.lastVerified}
                isStale={opportunity.verification.isStale}
                isDeadlineVerified={opportunity.isDeadlineVerified}
              />

              {/* EX-1 & EX-2 Lifecycle Tracker: Discovered through Completed */}
              <div className="pt-3 border-t-2 border-[#14161A] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#14161A]">
                    Application Stage
                  </span>
                  <span className="text-xs font-mono text-[#1D4ED8] font-bold">
                    Status: {lifecycleStatus}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {LIFECYCLE_STEPS.map((st) => {
                    const active = lifecycleStatus === st;
                    return (
                      <button
                        key={st}
                        onClick={() => updateOpportunityLifecycle(opportunity.id, st)}
                        className={`min-h-[44px] px-3 py-1.5 text-[11px] font-mono font-bold border transition-colors ${
                          active
                            ? 'bg-[#14161A] text-white border-[#14161A]'
                            : 'bg-[#F9F9F7] text-[#4B5563] border-[#D6D5CE] hover:border-[#14161A] hover:text-[#14161A]'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>

                {(lifecycleStatus === 'Interested' || lifecycleStatus === 'Preparing') && (
                  <div className="bg-[#EFF6FF] border border-[#1D4ED8] p-3 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-[#14161A]">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#1D4ED8] shrink-0" />
                      {opportunity.prepTaskTemplates.length} prep tasks added to your Roadmap
                    </span>
                    <button
                      onClick={() => setActiveTab('roadmap')}
                      className="min-h-[44px] px-3 py-1 font-mono font-bold text-xs text-[#1D4ED8] underline shrink-0"
                    >
                      View Tasks →
                    </button>
                  </div>
                )}

                {lifecycleHistory.length > 1 && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#4B5563] font-mono">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Last transition: {lifecycleHistory[lifecycleHistory.length - 1].status} at{' '}
                      {lifecycleHistory[lifecycleHistory.length - 1].timestamp.slice(0, 16).replace('T', ' ')}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => setActiveBreakdownOpportunityId(opportunity.id)}
                    className="min-h-[44px] px-3 py-2 text-xs font-mono font-bold text-[#1D4ED8] hover:bg-[#EFF6FF] border border-transparent hover:border-[#1D4ED8] transition-colors"
                  >
                    Inspect Score Breakdown →
                  </button>
                  {!eo.isDismissed && (
                    <button
                      onClick={() =>
                        dismissOpportunity(
                          opportunity.id,
                          breakdown.finalLevel === 'Exceptional' ||
                            breakdown.finalLevel === 'High Leverage'
                        )
                      }
                      className="min-h-[44px] px-3 py-2 text-xs font-mono text-[#4B5563] hover:text-[#D92B2B] transition-colors"
                    >
                      Dismiss Opportunity
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
