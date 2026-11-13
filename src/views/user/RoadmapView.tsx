import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Lock,
  CalendarClock,
  FileCheck,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { Gap, Pathway, Task } from '../../types/domain';
import { useNorthStore } from '../../store/useNorthStore';

interface RoadmapViewProps {
  pathway: Pathway;
  gaps: Gap[];
  tasks: Task[];
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  pathway,
  gaps,
  tasks,
}) => {
  const user = useNorthStore((s) => s.user);
  const identityItems = useNorthStore((s) => s.identityItems);
  const completeTask = useNorthStore((s) => s.completeTask);
  const markTaskStatus = useNorthStore((s) => s.markTaskStatus);
  const applyBehindScheduleOption = useNorthStore(
    (s) => s.applyBehindScheduleOption
  );
  const attachEvidenceToItem = useNorthStore((s) => s.attachEvidenceToItem);

  const [activeLayerTab, setActiveLayerTab] = useState<'tasks' | 'gaps'>('tasks');
  const [showPaceOptions, setShowPaceOptions] = useState(
    user.missedTasksCount > 0
  );
  const [paceStatus, setPaceStatus] = useState<string | null>(null);
  const isReviewMode =
    import.meta.env.VITE_REVIEW_MODE === 'true' ||
    import.meta.env.VITE_REVIEW_MODE === '1';

  const todayTask = tasks.find(
    (t) => t.layer === 'today' && t.status !== 'Completed' && t.status !== 'Dropped'
  );
  const weekTasks = tasks
    .filter((t) => (t.layer === 'today' || t.layer === 'this_week') && t.status !== 'Dropped')
    .slice(0, user.effectiveWeeklyCap);
  const remainingWeekTasks = todayTask
    ? weekTasks.filter((t) => t.id !== todayTask.id)
    : weekTasks;
  const monthTasks = tasks.filter(
    (t) =>
      (t.layer === 'this_month' || t.layer === 'later') &&
      !weekTasks.some((w) => w.id === t.id) &&
      t.status !== 'Dropped'
  );
  const completedTasks = tasks.filter((t) => t.status === 'Completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="bg-[#14161A] text-[#F9F9F7] border-2 border-[#14161A] p-4 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="type-display text-white">
              Execution Roadmap
            </h1>
            <p className="type-label text-[#93C5FD] mt-1.5">
              {pathway.careerTitle} → {pathway.destinationName}
            </p>
          </div>
          <span className="text-xs font-mono bg-[#1F242D] border border-[#323846] px-3 py-1.5 text-white shrink-0">
            Cap: {user.effectiveWeeklyCap} tasks/wk
          </span>
        </div>

        {/* Sub-view Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={() => setActiveLayerTab('tasks')}
            className={`min-h-[44px] py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-wider border transition-colors ${
              activeLayerTab === 'tasks'
                ? 'bg-[#D92B2B] text-white border-[#D92B2B]'
                : 'bg-[#1F242D] text-[#D1D5DB] border-[#323846] hover:text-white'
            }`}
          >
            Action Schedule ({tasks.length})
          </button>
          <button
            onClick={() => setActiveLayerTab('gaps')}
            className={`min-h-[44px] py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-wider border transition-colors ${
              activeLayerTab === 'gaps'
                ? 'bg-[#D92B2B] text-white border-[#D92B2B]'
                : 'bg-[#1F242D] text-[#D1D5DB] border-[#323846] hover:text-white'
            }`}
          >
            Requirement Gaps ({gaps.length})
          </button>
        </div>
      </header>

      {activeLayerTab === 'tasks' ? (
        <div className="space-y-6">
          {/* =================================================================
              NEUTRAL ACCOUNTABILITY & WORKLOAD SCALING BAR (Progressive Disclosure)
             ================================================================= */}
          <section className="bg-[#F2F1EC] border-2 border-[#14161A] p-3.5 sm:px-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#14161A]">
                <CalendarClock className="w-4 h-4 text-[#14161A] shrink-0" />
                <span>
                  {user.weeklyHoursAvailable}h/wk capacity
                  {user.missedTasksCount > 0 ? ` · ${user.missedTasksCount} missed` : ''}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPaceOptions((prev) => !prev)}
                className="min-h-[44px] px-3 py-1.5 bg-white hover:bg-[#E4E2DA] border border-[#14161A] text-xs font-mono font-bold uppercase text-[#14161A] transition-colors"
              >
                {showPaceOptions ? 'Hide Pace Options' : 'Adjust Weekly Pace'}
              </button>
            </div>
            {showPaceOptions && (
              <div className="flex flex-wrap gap-2 pt-1 border-t border-[#D6D5CE]">
                {(
                  [
                  { key: 'reschedule', label: 'Reschedule Overdue' },
                  { key: 'reduce_scope', label: 'Reduce Weekly Cap' },
                  { key: 'reprioritize', label: 'Reprioritize by Impact' },
                  { key: 'drop_lowest', label: 'Drop Lowest-Priority Task' },
                  { key: 'replan', label: 'Replan Month' },
                ] as const
              ).map((opt) => {
                const isDisabled =
                  opt.key === 'reduce_scope' && user.effectiveWeeklyCap <= 1;
                return (
                  <button
                    type="button"
                    key={opt.key}
                    disabled={isDisabled}
                    onClick={() => {
                      applyBehindScheduleOption(
                        opt.key,
                        weekTasks[weekTasks.length - 1]?.id
                      );
                      setPaceStatus(`Applied: ${opt.label}`);
                    }}
                    className="min-h-[44px] px-3.5 py-2 bg-white hover:bg-[#E4E2DA] disabled:opacity-50 disabled:cursor-not-allowed border border-[#14161A] text-xs font-semibold text-[#14161A] transition-colors"
                  >
                    {opt.label}
                  </button>
                );
              })}
              </div>
            )}
            {paceStatus && (
              <p role="status" className="text-xs font-mono text-[#047857] font-semibold">
                {paceStatus}
              </p>
            )}
          </section>

          {/* LAYER 1: TODAY'S NEXT STEP (RM-2) */}
          {todayTask && (
            <section className="bg-[#27171A] text-white border-2 border-[#D92B2B] p-4 sm:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-block bg-[#D92B2B] text-white text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 font-bold">
                  Layer 1 · Today&apos;s Next Step
                </span>
                <span className="text-xs font-mono text-[#CBD5E1]">
                  {todayTask.effortHours}h · Impact {todayTask.careerImpact}/5
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold leading-snug">
                {todayTask.title}
              </h2>
              <p className="text-sm text-[#CBD5E1] leading-relaxed">
                {todayTask.description}
              </p>
              <div className="text-xs sm:text-sm text-[#F9F9F7] bg-[#1F242D] p-3 border border-[#323846]">
                <strong>Why This Is #1:</strong> {todayTask.priorityExplanation}
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                <button
                  onClick={() => completeTask(todayTask.id, todayTask.unlocksIdentityItem)}
                  className="min-h-[44px] flex-1 py-2.5 px-4 bg-[#D92B2B] hover:bg-[#B91C1C] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Complete &amp; Add to Career Identity</span>
                </button>
                {isReviewMode && (
                  <button
                    onClick={() => markTaskStatus(todayTask.id, 'Missed')}
                    className="min-h-[44px] px-4 py-2.5 bg-[#1F242D] hover:bg-[#2A2E37] text-[#F9F9F7] text-xs font-mono font-semibold border border-[#323846]"
                    title="Simulate missing a task to test EX-4 & EX-6 capacity scaling"
                  >
                    Slip / Miss
                  </button>
                )}
              </div>
            </section>
          )}

          {/* LAYER 2: THIS WEEK'S ACTIONS (Capped at user.effectiveWeeklyCap) */}
          {remainingWeekTasks.length > 0 && (
          <section className="bg-white border-2 border-[#14161A] p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#EFF6FF] border-b-2 border-[#1D4ED8] -mx-4 -mt-4 sm:-mx-5 sm:-mt-5 px-4 sm:px-5 py-3">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#14161A]">
                Layer 2 · {todayTask ? 'Also This Week' : "This Week's Actions"} (Max {user.effectiveWeeklyCap})
              </h2>
              <span className="text-xs font-mono font-bold text-[#1D4ED8]">
                {weekTasks.filter((t) => t.status === 'Completed').length}/{weekTasks.length} completed
              </span>
            </div>

            <div className="space-y-3">
              {remainingWeekTasks.map((task) => {
                const isDone = task.status === 'Completed';
                const isMissed = task.status === 'Missed';
                const isLocked = task.status === 'Locked';
                return (
                  <div
                    key={task.id}
                    className={`p-3.5 sm:p-4 border space-y-2 ${
                      isDone
                        ? 'bg-[#F2F1EC] border-[#047857]'
                        : isMissed
                        ? 'bg-[#F2F1EC] border-[#14161A]'
                        : 'bg-[#F9F9F7] border-[#14161A]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 min-w-0">
                        <button
                          type="button"
                          disabled={isDone || isLocked}
                          onClick={() => completeTask(task.id, task.unlocksIdentityItem)}
                          className="min-h-[44px] min-w-[44px] -ml-2 -mt-2 inline-flex items-center justify-center text-[#14161A] hover:text-[#1D4ED8] disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
                          aria-label={
                            isDone
                              ? `${task.title} completed`
                              : isLocked
                              ? `${task.title} locked`
                              : `Mark ${task.title} complete`
                          }
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-[#047857]" />
                          ) : isLocked ? (
                            <Lock className="w-5 h-5 text-[#4B5563]" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <h3
                            className={`text-sm font-bold leading-snug break-words ${
                              isDone ? 'line-through text-[#4B5563]' : 'text-[#14161A]'
                            }`}
                          >
                            {task.title}
                          </h3>
                          <span className="text-[11px] font-mono uppercase text-[#4B5563] block mt-0.5">
                            {task.dueDate} · {task.effortHours}h effort
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-[11px] font-mono px-2.5 py-1 font-bold uppercase border shrink-0 ${
                          isDone
                            ? 'bg-emerald-50 text-[#047857] border-[#047857]'
                            : isMissed
                            ? 'bg-[#E4E2DA] text-[#14161A] border-[#14161A]'
                            : 'bg-white border-[#14161A] text-[#14161A]'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>

                    <p className="text-sm text-[#4B5563] leading-relaxed">
                      {task.description}
                    </p>

                    <p className="text-xs text-[#4B5563]">
                      <strong className="text-[#14161A]">Why Prioritized: </strong>
                      {task.priorityExplanation}
                    </p>

                    {task.unlocksIdentityItem && !isDone && (
                      <div className="flex items-center gap-1.5 text-xs text-[#1D4ED8] font-semibold">
                        <Sparkles className="w-4 h-4 shrink-0" />
                        <span>
                          Updates Career Identity: &ldquo;{task.unlocksIdentityItem.title}&rdquo;
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
          )}

          {/* LAYER 3: MONTHLY PLAN & PREREQUISITE QUEUE (RM-2, RM-3) */}
          <section className="bg-white border-2 border-[#14161A] p-4 sm:p-5 space-y-4">
            <div className="border-b border-[#D6D5CE] pb-2.5">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#14161A]">
                Layer 3 · Monthly Plan &amp; Locked Steps
              </h2>
            </div>

            <div className="space-y-3">
              {monthTasks.map((task) => {
                const isLocked = task.status === 'Locked';
                const prereqTitles = task.prerequisites
                  .map((pId) => tasks.find((t) => t.id === pId)?.title || pId)
                  .join(', ');

                return (
                  <div
                    key={task.id}
                    className={`p-3.5 border space-y-2 ${
                      isLocked
                        ? 'bg-[#F2F1EC] border-[#D6D5CE]'
                        : 'bg-white border-[#14161A]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 min-w-0">
                        {isLocked ? (
                          <div className="min-h-[44px] min-w-[44px] -ml-2 -mt-2 inline-flex items-center justify-center shrink-0">
                            <Lock className="w-4 h-4 text-amber-800" />
                          </div>
                        ) : (
                          <button
                            onClick={() => completeTask(task.id, task.unlocksIdentityItem)}
                            className="min-h-[44px] min-w-[44px] -ml-2 -mt-2 inline-flex items-center justify-center text-[#14161A] hover:text-[#1D4ED8] shrink-0"
                            aria-label={`Mark ${task.title} complete`}
                          >
                            <Circle className="w-5 h-5" />
                          </button>
                        )}
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-[#14161A] leading-snug">
                            {task.title}
                          </h3>
                          <span className="text-[11px] font-mono text-[#4B5563] block mt-0.5">
                            {task.dueDate} · {task.effortHours}h effort
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-[11px] font-mono px-2.5 py-1 font-bold uppercase border shrink-0 ${
                          isLocked
                            ? 'bg-amber-100 text-amber-950 border-amber-500'
                            : 'bg-[#F2F1EC] text-[#14161A] border-[#14161A]'
                        }`}
                      >
                        {isLocked ? 'Prerequisite Locked' : 'Scheduled'}
                      </span>
                    </div>

                    {isLocked && (
                      <p className="text-xs text-amber-950 bg-amber-50 px-3 py-2 border border-amber-400">
                        <strong>Locked Until Complete:</strong> Cannot start until you finish:{' '}
                        <em>{prereqTitles}</em>.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {completedTasks.length > 0 && (
            <section className="bg-[#F2F1EC] border border-[#14161A] p-4 space-y-2.5">
              <div className="text-xs font-mono font-bold uppercase text-[#14161A]">
                Completed Milestones ({completedTasks.length})
              </div>
              <div className="space-y-2">
                {completedTasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between gap-3 text-sm text-[#4B5563] bg-white px-3 py-2 border border-[#D6D5CE]"
                  >
                    <span className="line-through truncate">{t.title}</span>
                    <button
                      type="button"
                      onClick={() => markTaskStatus(t.id, 'Todo')}
                      aria-label={`Undo completion of ${t.title}`}
                      className="min-h-[44px] px-3 inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#14161A] hover:text-[#D92B2B] shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Undo
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        /* =================================================================
           RANKED GAP ANALYSIS (Rule RM-1: Compare Pathway Requirements with Career Identity)
           ================================================================= */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gaps.map((gap) => {
              const matchingIdentityItem = identityItems.find((i) =>
                gap.requirementId.includes(i.matchTag)
              );
              return (
                <div
                  key={gap.id}
                  className="bg-white border-2 border-[#14161A] p-4 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-extrabold text-[#14161A] leading-snug">
                          {gap.requirementTitle}
                        </h3>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#4B5563] block mt-0.5">
                          {gap.requirementType} · Severity: {gap.severity}
                        </span>
                      </div>
                      <span
                        className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase border shrink-0 ${
                          gap.status === 'Evidenced'
                            ? 'bg-emerald-50 text-[#047857] border-[#047857]'
                            : gap.status === 'Declared Only'
                            ? 'bg-amber-50 text-amber-900 border-amber-500'
                            : 'bg-rose-50 text-[#D92B2B] border-[#D92B2B]'
                        }`}
                      >
                        {gap.status}
                      </span>
                    </div>

                    <p className="text-sm text-[#4B5563] leading-relaxed">
                      {gap.whyItMattersNow}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#4B5563] bg-[#F2F1EC] px-3 py-2 border border-[#D6D5CE]">
                      <span>Source: {gap.source}</span>
                      <span>Est. Effort: ~{gap.effortHours}h</span>
                    </div>

                    {gap.status === 'Declared Only' && matchingIdentityItem && (
                      <button
                        onClick={() =>
                          attachEvidenceToItem(
                            matchingIdentityItem.id,
                            'Certificate',
                            `${matchingIdentityItem.matchTag}_verified_record.pdf`
                          )
                        }
                        className="min-h-[44px] w-full py-2.5 px-4 bg-[#14161A] hover:bg-[#1D4ED8] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                      >
                        <FileCheck className="w-4 h-4 shrink-0" />
                        <span>Attach Proof to Close Gap</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
