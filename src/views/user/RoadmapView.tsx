import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Lock,
  Layers,
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
  const {
    user,
    identityItems,
    completeTask,
    markTaskStatus,
    applyBehindScheduleOption,
    attachEvidenceToItem,
  } = useNorthStore();

  const [activeLayerTab, setActiveLayerTab] = useState<'tasks' | 'gaps'>('tasks');
  const isReviewMode =
    import.meta.env.VITE_REVIEW_MODE === 'true' ||
    import.meta.env.VITE_REVIEW_MODE === '1';

  const todayTask = tasks.find(
    (t) => t.layer === 'today' && t.status !== 'Completed' && t.status !== 'Dropped'
  );
  const weekTasks = tasks
    .filter((t) => (t.layer === 'today' || t.layer === 'this_week') && t.status !== 'Dropped')
    .slice(0, user.effectiveWeeklyCap);
  const monthTasks = tasks.filter(
    (t) =>
      (t.layer === 'this_month' || t.layer === 'later') &&
      !weekTasks.some((w) => w.id === t.id) &&
      t.status !== 'Dropped'
  );
  const completedTasks = tasks.filter((t) => t.status === 'Completed');

  return (
    <div className="p-3.5 space-y-4">
      {/* Header */}
      <section className="rounded-2xl bg-[#0F172A] text-white p-4 space-y-2.5 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
            Engine 4 &amp; 6 · Gap Analysis &amp; Dynamic Roadmap (RM-1..6)
          </span>
          <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-stone-300">
            Cap: {user.effectiveWeeklyCap} tasks/wk
          </span>
        </div>
        <h2 className="text-base font-bold">
          From {pathway.careerTitle} in {pathway.destinationName} to Today&apos;s Next Step
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Keynote K9 &amp; K13: Tasks update your Career Identity on completion (CI-5), unlock prerequisite-dependent steps (RM-3), and adapt to your real capacity without streaks or guilt (EX-5).
        </p>

        {/* Sub-view Toggle */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => setActiveLayerTab('tasks')}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold ${
              activeLayerTab === 'tasks'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Layered Roadmap ({tasks.length})
          </button>
          <button
            onClick={() => setActiveLayerTab('gaps')}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold ${
              activeLayerTab === 'gaps'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Ranked Gap Analysis ({gaps.length})
          </button>
        </div>
      </section>

      {activeLayerTab === 'tasks' ? (
        <div className="space-y-4">
          {/* =================================================================
              NEUTRAL ACCOUNTABILITY & WORKLOAD SCALING BAR (EX-4, EX-5, EX-6)
             ================================================================= */}
          <div className="rounded-xl bg-white border border-stone-200 p-3.5 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <CalendarClock className="w-4 h-4 text-emerald-800" />
                <span>Capacity-Aware Workload &amp; Neutral Options (EX-4, EX-6)</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                {user.weeklyHoursAvailable}h/wk · {user.missedTasksCount} missed
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Falling behind? Choose a neutral adjustment below—no streaks lost, no points deducted:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { key: 'reschedule', label: 'Reschedule Overdue' },
                  { key: 'reduce_scope', label: 'Reduce Weekly Cap' },
                  { key: 'reprioritize', label: 'Reprioritize by Impact' },
                  { key: 'drop_lowest', label: 'Drop Lowest-Priority Task' },
                  { key: 'replan', label: 'Replan Month' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() =>
                    applyBehindScheduleOption(
                      opt.key,
                      weekTasks[weekTasks.length - 1]?.id
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-[11px] font-medium text-slate-800 transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* LAYER 1: TODAY'S NEXT STEP (RM-2) */}
          {todayTask && (
            <section className="rounded-2xl bg-emerald-950 text-white p-3.5 space-y-2 shadow-sm border border-emerald-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                  Layer 1 · Today&apos;s Next Step (RM-2)
                </span>
                <span className="text-[11px] font-mono text-emerald-200">
                  {todayTask.effortHours}h · Impact {todayTask.careerImpact}/5
                </span>
              </div>
              <h3 className="text-sm font-bold leading-snug">{todayTask.title}</h3>
              <p className="text-xs text-stone-200 leading-relaxed">{todayTask.description}</p>
              <div className="text-[11px] text-emerald-200/90 bg-emerald-900/60 p-2 rounded-lg border border-emerald-800">
                <strong>Why Ranked #1 (RM-5):</strong> {todayTask.priorityExplanation}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => completeTask(todayTask.id, todayTask.unlocksIdentityItem)}
                  className="flex-1 py-2 px-3 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete &amp; Update Career Identity (CI-5)</span>
                </button>
                {isReviewMode && (
                  <button
                    onClick={() => markTaskStatus(todayTask.id, 'Missed')}
                    className="px-2.5 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-100 text-[11px] font-medium border border-emerald-700"
                    title="Simulate missing a task to test EX-4 & EX-6 capacity scaling"
                  >
                    Slip / Miss
                  </button>
                )}
              </div>
            </section>
          )}

          {/* LAYER 2: THIS WEEK'S ACTIONS (Capped at user.effectiveWeeklyCap) */}
          <section className="rounded-2xl bg-white border border-stone-200 p-3.5 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Layer 2 · This Week&apos;s Actions (Max {user.effectiveWeeklyCap})
              </h3>
              <span className="text-[11px] text-slate-500">
                {weekTasks.filter((t) => t.status === 'Completed').length}/{weekTasks.length} completed
              </span>
            </div>

            <div className="space-y-2.5">
              {weekTasks.map((task) => {
                const isDone = task.status === 'Completed';
                const isMissed = task.status === 'Missed';
                return (
                  <div
                    key={task.id}
                    className={`p-3 rounded-xl border space-y-2 ${
                      isDone
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : isMissed
                        ? 'bg-stone-100 border-stone-300'
                        : 'bg-stone-50/70 border-stone-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => completeTask(task.id, task.unlocksIdentityItem)}
                          className="mt-0.5 text-slate-500 hover:text-emerald-700"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-slate-500">
                            {task.dueDate} · {task.effortHours}h effort
                          </span>
                          <h4
                            className={`text-xs font-bold mt-0.5 ${
                              isDone ? 'line-through text-slate-500' : 'text-slate-900'
                            }`}
                          >
                            {task.title}
                          </h4>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-800'
                            : isMissed
                            ? 'bg-stone-200 text-slate-700'
                            : 'bg-white border border-stone-200 text-slate-700'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>

                    <div className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-stone-200/70">
                      <strong className="text-slate-700">Ranking Logic (RM-5): </strong>
                      {task.priorityExplanation}
                    </div>

                    {task.unlocksIdentityItem && !isDone && (
                      <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-medium">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          Completing this updates Career Identity: &ldquo;{task.unlocksIdentityItem.title}&rdquo; (CI-5)
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* LAYER 3: MONTHLY PLAN & PREREQUISITE QUEUE (RM-2, RM-3) */}
          <section className="rounded-2xl bg-white border border-stone-200 p-3.5 space-y-2.5 shadow-sm">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Layer 3 · Monthly Plan &amp; Prerequisite Queue (RM-3)
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Tasks with unfinished prerequisites are locked until their prerequisite finishes.
              </p>
            </div>

            <div className="space-y-2">
              {monthTasks.map((task) => {
                const isLocked = task.status === 'Locked';
                const prereqTitles = task.prerequisites
                  .map((pId) => tasks.find((t) => t.id === pId)?.title || pId)
                  .join(', ');

                return (
                  <div
                    key={task.id}
                    className={`p-3 rounded-xl border space-y-1.5 ${
                      isLocked
                        ? 'bg-stone-100/80 border-stone-200/90 opacity-85'
                        : 'bg-white border-stone-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        {isLocked ? (
                          <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        ) : (
                          <button
                            onClick={() => completeTask(task.id, task.unlocksIdentityItem)}
                            className="mt-0.5 text-slate-400 hover:text-emerald-700"
                          >
                            <Circle className="w-4 h-4" />
                          </button>
                        )}
                        <div>
                          <span className="text-[10px] font-mono text-slate-500">
                            {task.dueDate} · {task.effortHours}h effort
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                            {task.title}
                          </h4>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                          isLocked
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-stone-100 text-slate-700'
                        }`}
                      >
                        {isLocked ? 'Prerequisite Locked' : 'Scheduled'}
                      </span>
                    </div>

                    {isLocked && (
                      <p className="text-[11px] text-amber-900 bg-amber-50/90 px-2.5 py-1.5 rounded-lg border border-amber-200">
                        <strong>Rule RM-3 Prerequisite Lock:</strong> Cannot start until you finish:{' '}
                        <em>{prereqTitles}</em>.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {completedTasks.length > 0 && (
            <section className="rounded-xl bg-stone-100 border border-stone-200 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Completed Milestones ({completedTasks.length})
                </span>
              </div>
              <div className="space-y-1.5">
                {completedTasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between text-xs text-slate-600 bg-white px-2.5 py-1.5 rounded-lg border border-stone-200"
                  >
                    <span className="line-through truncate">{t.title}</span>
                    <button
                      onClick={() => markTaskStatus(t.id, 'Todo')}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-900 ml-2 shrink-0"
                    >
                      <RotateCcw className="w-3 h-3" />
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
        <div className="space-y-3">
          <div className="rounded-xl bg-white border border-stone-200 p-3.5 space-y-1.5 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800">
              <Layers className="w-3.5 h-3.5 text-emerald-800" />
              <span>Ranked Gap Analysis (Rule RM-1)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Each gap links directly to its Pathway Requirement and compares it against your current Career Identity items (Declared vs. Evidenced).
            </p>
          </div>

          {gaps.map((gap) => {
            const matchingIdentityItem = identityItems.find((i) =>
              gap.requirementId.includes(i.matchTag)
            );
            return (
              <div
                key={gap.id}
                className="rounded-xl bg-white border border-stone-200 p-3.5 space-y-2.5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      {gap.requirementType} · Severity: {gap.severity}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                      {gap.requirementTitle}
                    </h4>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${
                      gap.status === 'Evidenced'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : gap.status === 'Declared Only'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    {gap.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{gap.whyItMattersNow}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-200/80">
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
                    className="w-full py-1.5 px-3 rounded-lg bg-emerald-900 text-white text-xs font-semibold hover:bg-emerald-800 flex items-center justify-center gap-1.5"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Attach Verification Evidence to Close Gap (CI-4)</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
