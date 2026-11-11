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
  const {
    valueOrientation,
    updateOpportunityLifecycle,
    dismissOpportunity,
    setActiveBreakdownOpportunityId,
    setActiveTab,
  } = useNorthStore();

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
    <div className="p-3.5 space-y-4">
      {/* =====================================================================
          7-STAGE OPPORTUNITY FUNNEL HEADER (Keynote K10, Rules OP-1, OP-2, OP-9)
         ===================================================================== */}
      <section className="rounded-2xl bg-[#0F172A] text-white p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-emerald-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Engine 5 · 7-Stage Funnel &amp; Leverage (OP-2, LV-1)</span>
          </div>
          <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-emerald-300">
            Hard Cap: {OPPORTUNITY_CURATED_CAP} (OP-9)
          </span>
        </div>

        <div>
          <h2 className="text-base font-bold">Filter, Do Not List (Keynote K10)</h2>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
            Scored against your <strong>{valueOrientation.archetype}</strong> weights. Tap any score badge to inspect the exact calculation table (Rule LV-6).
          </p>
        </div>

        {/* Visual 7-Stage Funnel Bar */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-2.5 space-y-1.5 text-[11px]">
          {[
            { label: '1. Everything Available', count: stageCounts.s1_available, width: 'w-full' },
            { label: '2. Relevant to Your Career', count: stageCounts.s2_relevant, width: 'w-11/12' },
            { label: '3. Eligible for You (OP-3)', count: stageCounts.s3_eligible, width: 'w-10/12' },
            { label: '4. Realistically Accessible', count: stageCounts.s4_accessible, width: 'w-9/12' },
            { label: '5. Potentially Valuable (Combo)', count: stageCounts.s5_valuable, width: 'w-8/12' },
            { label: '6. Worth Your Time (Not Low-Fit)', count: stageCounts.s6_worthTime, width: 'w-7/12' },
            {
              label: `7. Curated Action (Capped at ${OPPORTUNITY_CURATED_CAP})`,
              count: Math.min(stageCounts.s7_recommended, OPPORTUNITY_CURATED_CAP),
              width: 'w-6/12',
              highlight: true,
            },
          ].map((st) => (
            <div key={st.label} className="flex items-center justify-between gap-2">
              <div
                className={`${st.width} px-2 py-0.5 rounded text-[10px] font-medium truncate ${
                  st.highlight
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {st.label}
              </div>
              <span className="font-mono text-[10px] text-slate-400 shrink-0">{st.count}</span>
            </div>
          ))}
        </div>

        {/* View Toggle: Curated Funnel Output vs. Filtered/Unverified Audit */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => setViewMode('curated')}
            className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold ${
              viewMode === 'curated'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Recommended ({curatedRecommendations.length}/{OPPORTUNITY_CURATED_CAP})
          </button>
          <button
            onClick={() => setViewMode('filtered_audit')}
            className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold ${
              viewMode === 'filtered_audit'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Filtered / Unverified ({heldBackOrLowFit.length})
          </button>
        </div>
      </section>

      {/* Opportunity Type Filter (OP-1) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {(
          ['All', 'Fellowship', 'Scholarship', 'Grant', 'Internship', 'Leadership', 'Clinical'] as const
        ).map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium border shrink-0 transition-colors ${
              selectedType === t
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Opportunity Cards */}
      <div className="space-y-3">
        {displayedList.map((eo) => {
          const { opportunity, breakdown, funnel, lifecycleStatus, lifecycleHistory } = eo;

          const levelColors = {
            Exceptional: 'bg-emerald-900 text-white border-emerald-950',
            'High Leverage': 'bg-emerald-100 text-emerald-950 border-emerald-300',
            Normal: 'bg-stone-200 text-slate-800 border-stone-300',
            'Low fit': 'bg-amber-100 text-amber-900 border-amber-300',
          }[breakdown.finalLevel];

          return (
            <div
              key={opportunity.id}
              className="rounded-2xl bg-white border border-stone-200 p-3.5 space-y-3 shadow-sm"
            >
              {/* Top Row: Type + Immediate Alert Flag + 1-Tap Score Breakdown Button (LV-6) */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-slate-700 border border-stone-200">
                    {opportunity.type}
                  </span>
                  {eo.isImmediateAlertEligible && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300">
                      <Sparkles className="w-3 h-3" />
                      Exceptional Alert (LV-5)
                    </span>
                  )}
                </div>

                {/* LV-6: Tapping any score shows its factors, values and the Value Orientation weights applied */}
                <button
                  onClick={() => setActiveBreakdownOpportunityId(opportunity.id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold border transition-transform active:scale-95 ${levelColors}`}
                  title="Tap to open deterministic Score Breakdown (Rule LV-6)"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>
                    {breakdown.rawScore.toFixed(2)} · {breakdown.finalLevel}
                  </span>
                </button>
              </div>

              {/* Title & Org */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {opportunity.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{opportunity.organization}</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{opportunity.summary}</p>

              {/* OP-5 Deadline Verification Rule */}
              <div className="flex items-center justify-between text-xs bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-200/80">
                <span className="text-slate-600 font-medium">Deadline:</span>
                {opportunity.isDeadlineVerified ? (
                  <span className="font-mono font-semibold text-slate-900">
                    {opportunity.deadline} (Verified)
                  </span>
                ) : (
                  <span className="font-semibold text-amber-800 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Verification required (OP-5)
                  </span>
                )}
              </div>

              {/* OP-6 Unverified Cap Notice */}
              {breakdown.wasCappedByVerification && (
                <div className="rounded-lg bg-amber-50 border border-amber-300 p-2.5 text-xs text-amber-900">
                  <strong>Rule OP-6 Enforced:</strong> Raw score is{' '}
                  <span className="font-mono font-bold">{breakdown.rawScore.toFixed(2)}</span> (
                  {breakdown.uncappedLevel}), but capped at <strong>Normal</strong> because verification state is{' '}
                  <code className="font-mono">{opportunity.verification.state}</code>.
                  {isReviewMode && (
                    <>
                      {' '}Verify it in <code className="font-mono">/curator</code> to unlock High Leverage / Exceptional status.
                    </>
                  )}
                </div>
              )}

              {/* OP-3 Failing Eligibility Rule if Ineligible */}
              {!funnel.stage3_eligibleForYou && funnel.ineligibleReasons.length > 0 && (
                <div className="rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-900 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 text-rose-700" />
                    <span>Filtered at Funnel Stage 3 — Eligibility Check (Rule OP-3):</span>
                  </div>
                  {funnel.ineligibleReasons.map((reason, i) => (
                    <p key={i}>{reason}</p>
                  ))}
                </div>
              )}

              {/* LV-8 Low-Fit Reasons */}
              {(breakdown.finalLevel === 'Low fit' || viewMode === 'filtered_audit') &&
                opportunity.lowFitReasons.length > 0 && (
                  <div className="rounded-lg bg-stone-100 border border-stone-200 p-2.5 text-xs text-slate-700 space-y-1">
                    <strong className="text-slate-900 block">
                      Low-Fit / Cost Tradeoff Reasons (Rule LV-8):
                    </strong>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
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
              <div className="pt-2 border-t border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    Execution Lifecycle (Rules EX-1 &amp; EX-2)
                  </span>
                  <span className="text-[11px] font-mono text-emerald-800 font-semibold">
                    Status: {lifecycleStatus}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {LIFECYCLE_STEPS.map((st) => {
                    const active = lifecycleStatus === st;
                    return (
                      <button
                        key={st}
                        onClick={() => updateOpportunityLifecycle(opportunity.id, st)}
                        className={`px-2 py-1 rounded text-[10px] font-semibold border transition-colors ${
                          active
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-stone-50 text-slate-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>

                {(lifecycleStatus === 'Interested' || lifecycleStatus === 'Preparing') && (
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2 flex items-center justify-between text-xs text-emerald-950">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      {opportunity.prepTaskTemplates.length} prep tasks added to Roadmap (EX-1)
                    </span>
                    <button
                      onClick={() => setActiveTab('roadmap')}
                      className="font-bold underline ml-2 shrink-0"
                    >
                      View Tasks →
                    </button>
                  </div>
                )}

                {lifecycleHistory.length > 1 && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>
                      Last transition: {lifecycleHistory[lifecycleHistory.length - 1].status} at{' '}
                      {lifecycleHistory[lifecycleHistory.length - 1].timestamp.slice(0, 16).replace('T', ' ')}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setActiveBreakdownOpportunityId(opportunity.id)}
                    className="text-xs font-semibold text-emerald-900 hover:underline"
                  >
                    Inspect Full Score Math (LV-6) →
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
                      className="text-[11px] text-slate-400 hover:text-slate-700"
                    >
                      Not for me (Dismiss)
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
