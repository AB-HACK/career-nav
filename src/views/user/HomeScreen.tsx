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
  gaps: _gaps,
  tasks,
  evaluatedOpportunities,
  progressMeta,
  insights,
}) => {
  const user = useNorthStore((s) => s.user);
  const valueOrientation = useNorthStore((s) => s.valueOrientation);
  const behindScheduleBannerDismissed = useNorthStore(
    (s) => s.behindScheduleBannerDismissed
  );
  const completeTask = useNorthStore((s) => s.completeTask);
  const applyBehindScheduleOption = useNorthStore(
    (s) => s.applyBehindScheduleOption
  );
  const updateOpportunityLifecycle = useNorthStore(
    (s) => s.updateOpportunityLifecycle
  );
  const setActiveTab = useNorthStore((s) => s.setActiveTab);
  const setActiveBreakdownOpportunityId = useNorthStore(
    (s) => s.setActiveBreakdownOpportunityId
  );

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
    <div className="space-y-6 lg:grid lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_380px] lg:gap-8 lg:space-y-0 lg:items-start">
      {/* =====================================================================
          MAIN COLUMN: CORRIDOR HEADER, WEEKLY PRIORITY TIMETABLE & FEATURED OPPORTUNITY
         ===================================================================== */}
      <div className="space-y-6 min-w-0">
        {/* Header Strip */}
        <header className="border-b-[3px] border-[#14161A] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="min-w-0">
            <h1 className="type-display text-[#14161A]">
              This Week&apos;s Priority Schedule
            </h1>
            <p className="type-label text-[#1D4ED8] mt-1.5">
              Departure Corridor · {pathway.careerTitle} → {destOption.flag} {pathway.destinationName}
            </p>
          </div>
          <span className="self-start sm:self-auto font-mono text-xs bg-[#14161A] text-[#F9F9F7] px-2.5 py-1 shrink-0">
            {pathway.version} · {pathway.regulatingBody.split(' ')[0]}
          </span>
        </header>

        {/* Above-the-Fold 4-Question Navigation Summary (HS-1, K15) */}
        <section
          aria-label="At-a-Glance Navigation Summary"
          className="bg-[#14161A] text-[#F9F9F7] border-2 border-[#14161A] p-4 space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. WHERE AM I? (HS-1, HS-4) */}
            <div className="bg-[#1F242D] border border-[#323846] p-3 flex flex-col justify-between">
              <div>
                <div className="text-sm font-bold text-white">
                  Lvl {progressMeta.current.level}: {progressMeta.current.name}
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#93C5FD] block mt-0.5">
                  1. Where am I?
                </span>
                <p className="text-xs text-[#D1D5DB] mt-1.5 leading-relaxed">
                  {progressMeta.current.focus}
                </p>
              </div>
              <div className="grid grid-cols-6 gap-1.5 mt-3" aria-hidden="true">
                {PROGRESS_LEVELS.map((lvl) => (
                  <div
                    key={lvl.level}
                    title={`Level ${lvl.level}: ${lvl.name}`}
                    className={`h-1.5 ${
                      lvl.level === progressMeta.current.level
                        ? 'bg-[#D92B2B]'
                        : lvl.level < progressMeta.current.level
                        ? 'bg-[#3B82F6]'
                        : 'bg-[#323846]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 2. WHERE AM I GOING? (HS-1) */}
            <button
              onClick={() => setActiveTab('pathway')}
              className="min-h-[44px] text-left bg-[#1F242D] hover:bg-[#252B36] border border-[#323846] hover:border-[#93C5FD] p-3 flex flex-col justify-between transition-colors group"
            >
              <div className="flex items-start justify-between gap-2 w-full">
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">
                    {pathway.careerTitle}
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#93C5FD] block mt-0.5">
                    2. Where am I going?
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-white shrink-0" />
              </div>
              <div className="mt-2">
                <p className="text-xs text-[#D1D5DB] truncate">
                  {destOption.flag} {pathway.destinationName}
                </p>
                <div className="text-[11px] text-[#9CA3AF] truncate mt-1 font-mono">
                  {pathway.regulatingBody}
                </div>
              </div>
            </button>
          </div>

          {/* 3. HOW AM I PROGRESSING? (Neutral Indicators — Zero Streaks/Points per EX-5) */}
          <div className="bg-[#1F242D] border border-[#323846] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#93C5FD] block">
                3. How am I progressing?
              </span>
              <p className="text-sm text-[#F9F9F7] mt-0.5">
                <strong>
                  {progressMeta.closedGapsCount}/{progressMeta.totalGapsCount}
                </strong>{' '}
                Pathway Requirements Evidenced ·{' '}
                <strong>{progressMeta.evidencedItemsCount}</strong> Verified Proof Items
              </p>
            </div>
            <span className="px-2.5 py-1 bg-[#14161A] border border-[#323846] text-[11px] font-mono text-[#F9F9F7] shrink-0">
              Cap: {user.effectiveWeeklyCap}/wk
            </span>
          </div>

          {/* 4. WHAT SHOULD I DO NOW? — Today's Single Clear Next Step (HS-1, RM-2) */}
          {weeklyPriorityTasks[0] && (
            <div className="bg-[#27171A] border-2 border-[#D92B2B] p-3.5 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2 py-0.5 bg-[#D92B2B] text-white text-[11px] font-mono uppercase tracking-wider font-bold">
                  4. What should I do now? · Today&apos;s Next Step
                </span>
                <span className="text-[11px] font-mono text-[#F9F9F7]">
                  ~{weeklyPriorityTasks[0].effortHours}h effort
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-sm font-bold text-white leading-snug break-words min-w-0">
                  {weeklyPriorityTasks[0].title}
                </p>
                {weeklyPriorityTasks[0].status === 'Completed' ? (
                  <span className="px-3 py-1.5 bg-[#065F46] text-white text-xs font-mono font-bold uppercase self-start sm:self-auto shrink-0">
                    Done
                  </span>
                ) : weeklyPriorityTasks[0].status === 'Locked' ? (
                  <span className="px-3 py-1.5 bg-[#1F242D] border border-[#323846] text-[#CBD5E1] text-xs font-mono font-bold uppercase self-start sm:self-auto shrink-0">
                    Locked
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      completeTask(
                        weeklyPriorityTasks[0].id,
                        weeklyPriorityTasks[0].unlocksIdentityItem
                      )
                    }
                    className="min-h-[44px] px-4 py-2 bg-[#D92B2B] hover:bg-[#B91C1C] text-white text-xs font-mono font-bold uppercase tracking-wider shrink-0 transition-colors"
                  >
                    Mark Done
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Neutral Behind-Schedule / Workload Scaling Banner (EX-4, EX-6) */}
        {user.missedTasksCount >= 2 && !behindScheduleBannerDismissed && (
          <section
            aria-label="Capacity Adjusted Check-in"
            className="bg-[#F2F1EC] border-2 border-[#14161A] p-4 space-y-3"
          >
            <div className="flex items-start gap-2.5">
              <CalendarClock className="w-5 h-5 text-[#14161A] shrink-0 mt-0.5" />
              <div className="text-sm text-[#14161A] leading-relaxed">
                <strong className="font-bold">
                  Weekly Pace Adjusted:
                </strong>{' '}
                A few tasks slipped recently, so we scaled your weekly list down to{' '}
                <strong>{user.effectiveWeeklyCap} core priorities</strong> to protect
                momentum without guilt. How would you like to adjust?
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { key: 'reschedule', label: 'Reschedule' },
                  { key: 'reduce_scope', label: 'Reduce Scope (1/wk)' },
                  { key: 'reprioritize', label: 'Reprioritize' },
                  { key: 'drop_lowest', label: 'Drop Lowest Task' },
                  { key: 'replan', label: 'Replan Week' },
                ] as const
              ).map((opt) => {
                const isDisabled =
                  opt.key === 'reduce_scope' && user.effectiveWeeklyCap <= 1;
                return (
                  <button
                    type="button"
                    key={opt.key}
                    disabled={isDisabled}
                    onClick={() =>
                      applyBehindScheduleOption(
                        opt.key,
                        weeklyPriorityTasks[weeklyPriorityTasks.length - 1]?.id
                      )
                    }
                    className="min-h-[44px] px-3 py-2 bg-white hover:bg-[#E4E2DA] disabled:opacity-50 disabled:cursor-not-allowed border border-[#14161A] text-xs font-semibold text-[#14161A] transition-colors"
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* =====================================================================
            THIS WEEK'S TOP PRIORITIES TIMETABLE (Capped strictly at 3 — HS-2, EX-6)
           ===================================================================== */}
        <section aria-labelledby="weekly-priorities-heading" className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2
              id="weekly-priorities-heading"
              className="type-section text-[#14161A]"
            >
              Top Weekly Priorities
            </h2>
            <button
              onClick={() => setActiveTab('roadmap')}
              className="min-h-[44px] px-3 py-2 text-xs font-mono font-bold uppercase text-[#1D4ED8] hover:bg-[#EFF6FF] border border-transparent hover:border-[#1D4ED8] transition-colors"
            >
              Full Roadmap →
            </button>
          </div>

          <div className="border-2 border-[#14161A] bg-white">
            {/* Desktop / Tablet Timetable Column Header */}
            <div className="hidden sm:grid sm:grid-cols-[76px_1fr_76px_124px] bg-[#14161A] text-white px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider gap-3">
              <span>Index</span>
              <span>Priority Milestone</span>
              <span className="text-right">Effort</span>
              <span className="text-center">Gate State</span>
            </div>

            <div className="divide-y divide-[#D6D5CE]">
              {weeklyPriorityTasks.length === 0 ? (
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F9F9F7]">
                  <p className="text-sm text-[#4B5563]">
                    No active tasks scheduled this week. Open your Roadmap to schedule or restore milestones.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('roadmap')}
                    className="min-h-[44px] px-4 py-2 bg-[#14161A] hover:bg-[#D92B2B] text-white text-xs font-mono font-bold uppercase shrink-0 transition-colors"
                  >
                    Open Roadmap
                  </button>
                </div>
              ) : (
                weeklyPriorityTasks.map((task, index) => {
                const isDone = task.status === 'Completed';
                const isLocked = task.status === 'Locked';
                const code = `W1-0${index + 1}`;

                return (
                  <div
                    key={task.id}
                    className={`p-4 flex flex-col sm:grid sm:grid-cols-[76px_1fr_76px_124px] sm:items-center gap-3 ${
                      isDone
                        ? 'bg-[#ECFDF5]/60'
                        : isLocked
                        ? 'bg-[#F2F1EC]/70 opacity-85'
                        : 'bg-white'
                    }`}
                  >
                    {/* Index + Mobile Effort/Action Row */}
                    <div className="flex items-center justify-between sm:block">
                      <span
                        className={`inline-block font-mono text-xs font-bold px-2.5 py-1.5 text-center ${
                          index === 0 && !isDone
                            ? 'bg-[#D92B2B] text-white'
                            : 'bg-[#14161A] text-white'
                        }`}
                      >
                        {code}
                      </span>

                      <span className="sm:hidden font-mono text-xs font-bold text-[#14161A]">
                        {task.effortHours}h · {task.dueDate}
                      </span>
                    </div>

                    {/* Title & Explanation */}
                    <div className="min-w-0">
                      <div className="flex items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 shrink-0"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-[#047857]" />
                          ) : isLocked ? (
                            <Lock className="w-5 h-5 text-[#4B5563]" />
                          ) : (
                            <Circle className="w-5 h-5 text-[#14161A]" />
                          )}
                        </span>

                        <div className="min-w-0">
                          <h3
                            className={`text-sm sm:text-base font-bold leading-snug ${
                              isDone
                                ? 'line-through text-[#4B5563]'
                                : 'text-[#14161A]'
                            }`}
                          >
                            {task.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#4B5563] mt-1 leading-relaxed">
                            {task.priorityExplanation}
                          </p>
                          <div className="hidden sm:block text-[11px] font-mono text-[#4B5563] mt-1">
                            {task.dueDate}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Effort */}
                    <div className="hidden sm:block text-right font-mono text-sm font-bold text-[#14161A]">
                      {task.effortHours}h
                    </div>

                    {/* Gate State / Action */}
                    <div className="flex sm:justify-center">
                      {isDone ? (
                        <span className="w-full sm:w-auto px-2.5 py-1.5 border border-[#047857] bg-emerald-50 text-[#047857] font-mono text-[11px] font-bold text-center uppercase">
                          Completed
                        </span>
                      ) : isLocked ? (
                        <span className="w-full sm:w-auto px-2.5 py-1.5 border border-[#D6D5CE] bg-[#F2F1EC] text-[#4B5563] font-mono text-[11px] font-bold text-center uppercase">
                          Locked
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            completeTask(task.id, task.unlocksIdentityItem)
                          }
                          aria-label={`Mark ${task.title} complete`}
                          className="min-h-[44px] w-full sm:w-auto px-3 py-1.5 border-2 border-[#14161A] bg-white hover:bg-[#14161A] hover:text-white font-mono text-[11px] font-bold uppercase transition-colors"
                        >
                          Mark Done
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
              )}
            </div>
          </div>
        </section>

        {/* =====================================================================
            SINGLE VERIFIED HIGH-LEVERAGE OPPORTUNITY CARD (HS-3, LV-5, LV-6)
           ===================================================================== */}
        {featuredOpportunity && (
          <section
            aria-label="Verified High-Leverage Opportunity"
            className="border-2 border-[#1D4ED8] bg-[#EFF6FF] p-4 sm:p-5 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[#1D4ED8]">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {featuredOpportunity.isImmediateAlertEligible
                      ? 'Immediate High-Fit Alert'
                      : 'High-Leverage Opportunity Now'}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-[#14161A] leading-snug">
                  {featuredOpportunity.opportunity.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#4B5563]">
                  {featuredOpportunity.opportunity.organization} · Verified Deadline:{' '}
                  <strong className="text-[#14161A]">
                    {featuredOpportunity.opportunity.deadline}
                  </strong>
                </p>
              </div>

              {/* 1-Tap Score Breakdown Button (LV-6) */}
              <button
                onClick={() =>
                  setActiveBreakdownOpportunityId(
                    featuredOpportunity.opportunity.id
                  )
                }
                className="min-h-[44px] self-start bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-4 py-2.5 font-mono text-left sm:text-center shrink-0 transition-colors"
                title="Tap to inspect deterministic score breakdown and Value Orientation weights"
              >
                <div className="flex items-center gap-1.5 text-xl font-bold leading-none">
                  <Calculator className="w-4 h-4 shrink-0" />
                  <span>
                    {featuredOpportunity.breakdown.rawScore > 0
                      ? `+${featuredOpportunity.breakdown.rawScore.toFixed(2)}`
                      : featuredOpportunity.breakdown.rawScore.toFixed(2)}
                  </span>
                </div>
                <div className="text-[11px] uppercase tracking-wider mt-1">
                  {featuredOpportunity.breakdown.finalLevel}
                </div>
              </button>
            </div>

            <p className="text-sm text-[#14161A] leading-relaxed bg-white p-3.5 border border-[#1D4ED8]/40">
              <strong>Why it matters for you: </strong>
              Closes {featuredOpportunity.breakdown.comboGapsClosedCount} pathway gaps (
              {featuredOpportunity.breakdown.comboGapsTitles.join(', ')}) and scores{' '}
              <strong>{featuredOpportunity.breakdown.rawScore.toFixed(2)}</strong>{' '}
              under your <strong>{valueOrientation.archetype}</strong> weights.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <button
                onClick={() => {
                  updateOpportunityLifecycle(
                    featuredOpportunity.opportunity.id,
                    'Preparing'
                  );
                  setActiveTab('roadmap');
                }}
                className="min-h-[44px] w-full py-2.5 px-4 bg-[#14161A] hover:bg-[#D92B2B] text-white text-xs font-mono font-bold uppercase text-center transition-colors"
              >
                Start Preparing (Adds Prep Tasks)
              </button>
            </div>
          </section>
        )}
      </div>

      {/* =====================================================================
          RIGHT RAIL (Desktop >= 1024px; stacked cleanly below on Phone & Tablet)
          Progress Level Standing, Strategic Insights, Progressive Identity Prompt
         ===================================================================== */}
      <aside className="space-y-5 lg:border-l-2 lg:border-[#14161A] lg:pl-7">
        {/* 6-Stop Corridor Standing Panel */}
        <section
          aria-label="Corridor Standing"
          className="border-2 border-[#14161A] bg-white p-4 sm:p-5 space-y-4"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#14161A]">
              Corridor Standing
            </h2>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#D92B2B] font-bold">
              Level {progressMeta.current.level} of 6
            </span>
          </div>

          <ol className="space-y-2.5 border-l-2 border-[#14161A] pl-3.5">
            {PROGRESS_LEVELS.map((lvl) => {
              const isCurrent = lvl.level === progressMeta.current.level;
              const isCleared = lvl.level < progressMeta.current.level;
              return (
                <li
                  key={lvl.level}
                  className={`font-mono text-xs leading-snug ${
                    isCurrent
                      ? 'text-[#1D4ED8] font-bold'
                      : isCleared
                      ? 'text-[#14161A]'
                      : 'text-[#4B5563]'
                  }`}
                >
                  {isCurrent ? '● ' : isCleared ? '✓ ' : '○ '}
                  0{lvl.level} · {lvl.name}
                  {isCurrent &&
                    ` (Active · ${progressMeta.closedGapsCount}/${progressMeta.totalGapsCount} Evidenced)`}
                </li>
              );
            })}
          </ol>

          <p className="text-xs text-[#4B5563] bg-[#F2F1EC] p-2.5 border border-[#D6D5CE]">
            {progressMeta.nextLevelHint}
          </p>
        </section>

        {/* Strategic Accountability & Insight Banners (EX-3, EX-8, VO-7) */}
        {insights.conversionInsight.active && (
          <section className="border-2 border-[#14161A] bg-[#F2F1EC] p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#14161A]">
              <Info className="w-4 h-4 text-[#1D4ED8] shrink-0" />
              <span>Application Outcome Pattern</span>
            </div>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              {insights.conversionInsight.message}
            </p>
            <p className="text-xs text-[#14161A] font-medium bg-white p-2.5 border border-[#D6D5CE]">
              <strong>Recommended Alternative:</strong>{' '}
              {insights.conversionInsight.recommendedAlternative}
            </p>
          </section>
        )}

        {insights.timelinePushback.active && (
          <section className="border-2 border-[#14161A] bg-[#F2F1EC] p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#14161A]">
              <Compass className="w-4 h-4 text-[#14161A] shrink-0" />
              <span>Timeline Check</span>
            </div>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              {insights.timelinePushback.message}
            </p>
            <button
              onClick={() => setActiveTab('profile')}
              className="min-h-[44px] w-full sm:w-auto px-3 py-2 bg-white border border-[#14161A] text-xs font-mono font-bold text-[#1D4ED8] hover:bg-[#EFF6FF] transition-colors"
            >
              Adjust timeline or weekly hours in Settings →
            </button>
          </section>
        )}

        {insights.valueOrientationRecheck.active && (
          <section className="border-2 border-amber-500 bg-amber-50 p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
              <Sliders className="w-4 h-4 text-amber-800 shrink-0" />
              <span>Value Orientation Check</span>
            </div>
            <p className="text-sm text-amber-950 leading-relaxed">
              {insights.valueOrientationRecheck.message}
            </p>
            <button
              onClick={() => setActiveTab('profile')}
              className="min-h-[44px] w-full px-3 py-2 bg-amber-900 hover:bg-amber-950 text-white text-xs font-mono font-bold uppercase transition-colors"
            >
              Review Archetype &amp; Sliders
            </button>
          </section>
        )}

        {/* Progressive Profile Prompt (Rule CI-2) */}
        <ProgressivePromptCard />
      </aside>
    </div>
  );
};
