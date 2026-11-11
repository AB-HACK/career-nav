import React from 'react';
import {
  CheckCircle2,
  Circle,
  Lock,
  Sparkles,
  ArrowUpRight,
  Calculator,
  Compass,
  Sliders,
  CalendarClock,
  Info,
} from 'lucide-react';
import {
  EvaluatedOpportunity,
  Gap,
  Pathway,
  ProgressLevelMeta,
  Task,
} from '../../types/domain';
import { DESTINATIONS, PROGRESS_LEVELS } from '../../data/careersAndDestinations';
import { useNorthStore } from '../../store/useNorthStore';
import { ProgressivePromptCard } from '../../components/shared/ProgressivePromptCard';
import { ExplorerDeciderView } from './ExplorerDeciderView';

interface HomeScreenProps {
  pathway: Pathway;
  gaps: Gap[];
  tasks: Task[];
  evaluatedOpportunities: EvaluatedOpportunity[];
  progressMeta: {
    current: ProgressLevelMeta;
    closedGapsCount: number;
    totalGapsCount: number;
    evidencedItemsCount: number;
    nextLevelHint: string;
  };
  insights: {
    conversionInsight: {
      active: boolean;
      submittedCount: number;
      convertedCount: number;
      message: string;
      recommendedAlternative: string;
    };
    timelinePushback: {
      active: boolean;
      remainingHours: number;
      monthsNeededAtCurrentPace: number;
      message: string;
    };
    valueOrientationRecheck: {
      active: boolean;
      dismissedCount: number;
      message: string;
    };
  };
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  pathway,
  gaps,
  tasks,
  evaluatedOpportunities,
  progressMeta,
  insights,
}) => {
  const {
    user,
    valueOrientation,
    behindScheduleBannerDismissed,
    completeTask,
    applyBehindScheduleOption,
    updateOpportunityLifecycle,
    setActiveTab,
    setActiveBreakdownOpportunityId,
  } = useNorthStore();

  // If user is in Explorer or Decider mode, render the Discovery / Compare view at top with seamless handoff
  if (user.startingMode === 'Explorer' || user.startingMode === 'Decider') {
    return <ExplorerDeciderView />;
  }

  const destOption =
    DESTINATIONS.find((d) => d.id === user.destinationId) || DESTINATIONS[0];

  // HS-2: "This Week" lists the top priorities (capped at user.effectiveWeeklyCap <= 3)
  const weeklyPriorityTasks = tasks
    .filter(
      (t) =>
        (t.layer === 'today' || t.layer === 'this_week') &&
        t.status !== 'Dropped'
    )
    .slice(0, user.effectiveWeeklyCap);

  // HS-3: A single high-leverage opportunity card when one is relevant now — ONLY for a verified, relevant item!
  const featuredOpportunity = evaluatedOpportunities.find(
    (eo) =>
      eo.opportunity.verification.state === 'verified' &&
      eo.funnel.stage7_recommendedAction &&
      (eo.breakdown.finalLevel === 'Exceptional' ||
        eo.breakdown.finalLevel === 'High Leverage') &&
      !eo.isDismissed
  );

  return (
    <div className="p-3.5 space-y-3.5">
      {/* =====================================================================
          ABOVE-THE-FOLD 4-QUESTION COMPASS QUADRANT (HS-1, K15)
          Answers without scrolling:
          1. Where am I?  2. Where am I going?  3. How am I progressing?  4. What should I do now?
         ===================================================================== */}
      <section
        aria-label="At-a-Glance Navigation Summary"
        className="rounded-2xl bg-[#0F172A] text-white p-3.5 space-y-3 shadow-md border border-slate-800"
      >
        {/* Q1 & Q2 Row: Where am I? + Where am I going? */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* 1. WHERE AM I? (HS-1, HS-4) */}
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-2.5 flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
              1. Where am I?
            </span>
            <div className="mt-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-bold text-white">
                  Lvl {progressMeta.current.level}: {progressMeta.current.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">
                {progressMeta.current.focus}
              </p>
            </div>
            {/* 6-step mini level bar */}
            <div className="grid grid-cols-6 gap-1 mt-2">
              {PROGRESS_LEVELS.map((lvl) => (
                <div
                  key={lvl.level}
                  title={`Level ${lvl.level}: ${lvl.name}`}
                  className={`h-1 rounded-full ${
                    lvl.level <= progressMeta.current.level
                      ? 'bg-emerald-400'
                      : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 2. WHERE AM I GOING? (HS-1) */}
          <button
            onClick={() => setActiveTab('pathway')}
            className="text-left rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 p-2.5 flex flex-col justify-between transition-colors group"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                2. Where am I going?
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-300" />
            </div>
            <div className="mt-1">
              <div className="text-xs font-bold text-white line-clamp-1">
                {pathway.careerTitle}
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 truncate">
                {destOption.flag} {pathway.destinationName}
              </p>
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-1.5 font-mono">
              {pathway.regulatingBody}
            </div>
          </button>
        </div>

        {/* 3. HOW AM I PROGRESSING? (Neutral Indicators — Zero Streaks/Points per EX-5) */}
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 px-3 py-2 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block">
              3. How am I progressing?
            </span>
            <p className="text-[11px] text-slate-200 mt-0.5">
              <strong>
                {progressMeta.closedGapsCount}/{progressMeta.totalGapsCount}
              </strong>{' '}
              Pathway Requirements Evidenced ·{' '}
              <strong>{progressMeta.evidencedItemsCount}</strong> Verified Proof Items
            </p>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-stone-300 shrink-0">
            Cap: {user.effectiveWeeklyCap}/wk
          </span>
        </div>

        {/* 4. WHAT SHOULD I DO NOW? — Today's Single Clear Next Step (HS-1, RM-2) */}
        {weeklyPriorityTasks[0] && (
          <div className="rounded-xl bg-emerald-950/90 border border-emerald-700/70 p-2.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-semibold">
                4. What should I do now? · Today&apos;s Next Step
              </span>
              <span className="text-[10px] font-mono text-emerald-200">
                ~{weeklyPriorityTasks[0].effortHours}h effort
              </span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold text-white leading-snug">
                {weeklyPriorityTasks[0].title}
              </p>
              {weeklyPriorityTasks[0].status !== 'Completed' ? (
                <button
                  onClick={() =>
                    completeTask(
                      weeklyPriorityTasks[0].id,
                      weeklyPriorityTasks[0].unlocksIdentityItem
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-[11px] font-bold shrink-0 transition-colors"
                >
                  Mark Done
                </button>
              ) : (
                <span className="px-2 py-0.5 rounded bg-emerald-800 text-emerald-100 text-[10px] font-semibold">
                  Done
                </span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* =====================================================================
          THIS WEEK'S TOP PRIORITIES (Capped strictly at 3 or scaled capacity — HS-2, EX-6)
         ===================================================================== */}
      <section className="rounded-2xl bg-white border border-stone-200 p-3.5 space-y-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              This Week&apos;s Priorities (Rule HS-2 &amp; K14)
            </h2>
            <p className="text-[11px] text-slate-500">
              Capped at {user.effectiveWeeklyCap} tasks/week ({user.weeklyHoursAvailable}h/wk capacity) — never a 25-task dump.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('roadmap')}
            className="text-[11px] font-semibold text-emerald-800 hover:underline"
          >
            Full Roadmap →
          </button>
        </div>

        {/* Neutral Behind-Schedule / Workload Scaling Banner (EX-4, EX-6) */}
        {user.missedTasksCount >= 2 && !behindScheduleBannerDismissed && (
          <div className="rounded-xl bg-stone-100 border border-stone-300 p-3 space-y-2">
            <div className="flex items-start gap-2">
              <CalendarClock className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900">
                  Capacity Adjusted Neutral Check-in (Rules EX-4 &amp; EX-6):
                </strong>{' '}
                A few tasks slipped recently, so we scaled your weekly list down to{' '}
                <strong>{user.effectiveWeeklyCap} core priorities</strong> to protect momentum without guilt. How would you like to adjust?
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {(
                [
                  { key: 'reschedule', label: 'Reschedule' },
                  { key: 'reduce_scope', label: 'Reduce Scope (1/wk)' },
                  { key: 'reprioritize', label: 'Reprioritize' },
                  { key: 'drop_lowest', label: 'Drop Lowest Task' },
                  { key: 'replan', label: 'Replan Week' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() =>
                    applyBehindScheduleOption(
                      opt.key,
                      weeklyPriorityTasks[weeklyPriorityTasks.length - 1]?.id
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-200 border border-stone-300 text-[11px] font-medium text-slate-800 transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          {weeklyPriorityTasks.map((task, index) => {
            const isDone = task.status === 'Completed';
            const isLocked = task.status === 'Locked';
            return (
              <div
                key={task.id}
                className={`p-2.5 rounded-xl border transition-all ${
                  isDone
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : isLocked
                    ? 'bg-stone-50 border-stone-200 opacity-75'
                    : 'bg-stone-50/70 border-stone-200/90 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <button
                    disabled={isLocked || isDone}
                    onClick={() => completeTask(task.id, task.unlocksIdentityItem)}
                    className="mt-0.5 text-slate-500 hover:text-emerald-700 disabled:cursor-not-allowed"
                    title={isLocked ? 'Prerequisite task must finish first (RM-3)' : 'Complete task'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4 text-slate-400" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                        Priority #{index + 1} · {task.dueDate}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {task.effortHours}h
                      </span>
                    </div>
                    <h3
                      className={`text-xs font-bold mt-0.5 leading-snug ${
                        isDone ? 'line-through text-slate-500' : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      {task.priorityExplanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          SINGLE VERIFIED HIGH-LEVERAGE OPPORTUNITY CARD (HS-3, LV-5, LV-6)
         ===================================================================== */}
      {featuredOpportunity && (
        <section className="rounded-2xl bg-white border border-emerald-300/90 p-3.5 space-y-2.5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-900">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>
                {featuredOpportunity.isImmediateAlertEligible
                  ? 'Immediate Exceptional Alert (LV-5)'
                  : 'High-Leverage Opportunity Now (HS-3)'}
              </span>
            </div>

            {/* 1-Tap Score Breakdown Button (LV-6) */}
            <button
              onClick={() =>
                setActiveBreakdownOpportunityId(featuredOpportunity.opportunity.id)
              }
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-900 text-white hover:bg-emerald-800 transition-colors"
              title="Tap to inspect deterministic score breakdown and Value Orientation weights"
            >
              <Calculator className="w-3 h-3" />
              <span>
                {featuredOpportunity.breakdown.rawScore.toFixed(2)} ·{' '}
                {featuredOpportunity.breakdown.finalLevel}
              </span>
            </button>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-900 leading-snug">
              {featuredOpportunity.opportunity.title}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {featuredOpportunity.opportunity.organization} · Verified Deadline:{' '}
              <strong className="text-slate-700">
                {featuredOpportunity.opportunity.deadline}
              </strong>
            </p>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed bg-stone-50 p-2.5 rounded-lg border border-stone-200/80">
            <strong className="text-slate-800">Why it matters for you: </strong>
            Closes {featuredOpportunity.breakdown.comboGapsClosedCount} pathway gaps (
            {featuredOpportunity.breakdown.comboGapsTitles.join(', ')}) and scores{' '}
            <strong>{featuredOpportunity.breakdown.rawScore.toFixed(2)}</strong> under your{' '}
            <strong>{valueOrientation.archetype}</strong> weights.
          </p>

          <div className="flex items-center justify-between gap-2 pt-0.5">
            <button
              onClick={() =>
                setActiveBreakdownOpportunityId(featuredOpportunity.opportunity.id)
              }
              className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-slate-700 hover:bg-stone-100 text-xs font-medium"
            >
              Explain Score (LV-6)
            </button>
            <button
              onClick={() => {
                updateOpportunityLifecycle(
                  featuredOpportunity.opportunity.id,
                  'Preparing'
                );
                setActiveTab('roadmap');
              }}
              className="flex-1 py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold text-center transition-colors"
            >
              Start Preparing (Spawns Prep Tasks — EX-1)
            </button>
          </div>
        </section>
      )}

      {/* =====================================================================
          STRATEGIC ACCOUNTABILITY & INSIGHT BANNERS (EX-3, EX-8, VO-7)
         ===================================================================== */}
      {insights.conversionInsight.active && (
        <div className="rounded-xl bg-stone-100 border border-stone-300 p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <Info className="w-4 h-4 text-emerald-800" />
            <span>Submission vs. Outcome Pattern Insight (Rule EX-3 &amp; K13)</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {insights.conversionInsight.message}
          </p>
          <p className="text-xs text-emerald-950 font-medium bg-white p-2 rounded-lg border border-stone-200">
            <strong>Recommended Alternative:</strong>{' '}
            {insights.conversionInsight.recommendedAlternative}
          </p>
        </div>
      )}

      {insights.timelinePushback.active && (
        <div className="rounded-xl bg-stone-100 border border-stone-300 p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <Compass className="w-4 h-4 text-slate-700" />
            <span>Strategic Plan &amp; Timeline Check (Rule EX-8)</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {insights.timelinePushback.message}
          </p>
          <button
            onClick={() => setActiveTab('profile')}
            className="text-xs font-semibold text-emerald-900 hover:underline"
          >
            Adjust timeline or weekly hours in Settings →
          </button>
        </div>
      )}

      {insights.valueOrientationRecheck.active && (
        <div className="rounded-xl bg-amber-50/80 border border-amber-200 p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
            <Sliders className="w-4 h-4 text-amber-800" />
            <span>Value Orientation Re-Check (Rule VO-7)</span>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            {insights.valueOrientationRecheck.message}
          </p>
          <button
            onClick={() => setActiveTab('profile')}
            className="px-3 py-1 rounded-lg bg-amber-900 text-white text-xs font-semibold"
          >
            Review Archetype &amp; Sliders
          </button>
        </div>
      )}

      {/* Progressive Profile Prompt (Rule CI-2) */}
      <ProgressivePromptCard />
    </div>
  );
};
