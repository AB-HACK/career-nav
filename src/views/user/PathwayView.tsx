import React, { useState } from 'react';
import {
  Compass,
  Grid,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  SlidersHorizontal,
  MapPin,
} from 'lucide-react';
import {
  CareerFieldId,
  DestinationId,
  Gap,
  Pathway,
  ProgressLevelMeta,
  Task,
} from '../../types/domain';
import { CAREER_FIELDS, DESTINATIONS } from '../../data/careersAndDestinations';
import { useNorthStore } from '../../store/useNorthStore';
import { VerificationBadge } from '../../components/shared/VerificationBadge';

interface PathwayViewProps {
  pathway: Pathway;
  gaps: Gap[];
  tasks: Task[];
  progressMeta: {
    current: ProgressLevelMeta;
    closedGapsCount: number;
    totalGapsCount: number;
    evidencedItemsCount: number;
  };
}

export const PathwayView: React.FC<PathwayViewProps> = ({
  pathway,
  gaps,
  tasks,
  progressMeta,
}) => {
  const { user, identityItems, updateGoalAndDestination, setActiveTab } = useNorthStore();
  const [showDestinationSwitcher, setShowDestinationSwitcher] = useState(false);
  const [customGoalInput, setCustomGoalInput] = useState(
    user.customGoalText || 'Space Law & Orbital Policy'
  );

  const openGaps = gaps.filter((g) => g.status !== 'Evidenced');
  const topNextTask = tasks.find((t) => t.status !== 'Completed' && t.status !== 'Dropped');

  return (
    <div className="p-3.5 space-y-4">
      {/* =====================================================================
          GOAL FRAMING PANEL (Rule SM-5: The 7 Required Framing Items)
          1. Goal  2. Profile  3. Destination  4. Pathway  5. Current Position  6. Gaps  7. Next Actions
         ===================================================================== */}
      <section className="rounded-2xl bg-[#0F172A] text-white p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-emerald-400">
            <Compass className="w-3.5 h-3.5" />
            <span>Engine 3 · Goal Framing Panel (Rule SM-5)</span>
          </div>
          <button
            onClick={() => setShowDestinationSwitcher(!showDestinationSwitcher)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-emerald-300 font-medium transition-colors"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Change Goal / Destination (PI-1)</span>
          </button>
        </div>

        {/* Interactive Career + Destination Switcher to test PI-1, RM-6 & PI-8 */}
        {showDestinationSwitcher && (
          <div className="rounded-xl bg-slate-900 border border-slate-700 p-3 space-y-2.5">
            <div className="text-[11px] text-emerald-300 font-semibold">
              Test PI-1 &amp; RM-6: Two users with the same goal and different destinations get different pathways (history preserved).
            </div>
            <div className="space-y-2">
              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">
                  Target Career Goal (13 Curated Fields + PI-8 Unsupported Test)
                </label>
                <select
                  value={user.goalCareerId}
                  onChange={(e) =>
                    updateGoalAndDestination(
                      e.target.value as CareerFieldId,
                      user.destinationId,
                      user.institutionOrCity,
                      customGoalInput,
                      user.engineeringTrack
                    )
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                >
                  {CAREER_FIELDS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {user.goalCareerId === 'engineering' && (
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">
                    Engineering Sub-Discipline
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['Petroleum', 'Civil', 'Electrical/Electronics', 'Mechanical'] as const).map(
                      (tr) => (
                        <button
                          key={tr}
                          onClick={() =>
                            updateGoalAndDestination(
                              'engineering',
                              user.destinationId,
                              user.institutionOrCity,
                              customGoalInput,
                              tr
                            )
                          }
                          className={`px-2 py-1 rounded text-[11px] font-medium border ${
                            user.engineeringTrack === tr
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {tr}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {user.goalCareerId === 'custom-unsupported' && (
                <div>
                  <label className="block text-[10px] uppercase text-amber-300 mb-1">
                    Custom Unlisted Career Goal (Rule PI-8 Fallback)
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={customGoalInput}
                      onChange={(e) => setCustomGoalInput(e.target.value)}
                      className="flex-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-amber-500/60 text-xs text-white"
                    />
                    <button
                      onClick={() =>
                        updateGoalAndDestination(
                          'custom-unsupported',
                          user.destinationId,
                          user.institutionOrCity,
                          customGoalInput
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 text-xs font-bold"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">
                  Target Destination Country / Hub (10 Contexts)
                </label>
                <select
                  value={user.destinationId}
                  onChange={(e) =>
                    updateGoalAndDestination(
                      user.goalCareerId,
                      e.target.value as DestinationId,
                      user.institutionOrCity,
                      customGoalInput,
                      user.engineeringTrack
                    )
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                >
                  {DESTINATIONS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.flag} {d.name} ({d.region})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* The 7 Mandatory Items of SM-5 */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">
              1. Your Goal
            </span>
            <span className="font-bold text-white block mt-0.5">{pathway.careerTitle}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">
              2. Your Destination
            </span>
            <span className="font-bold text-white block mt-0.5">
              {pathway.destinationName}
              {user.institutionOrCity ? ` · ${user.institutionOrCity}` : ''}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">
              3. Your Profile
            </span>
            <span className="font-semibold text-slate-200 block mt-0.5">
              {identityItems.length} recorded items ({progressMeta.evidencedItemsCount} evidenced)
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">
              4. Your Pathway
            </span>
            <span className="font-semibold text-emerald-300 block mt-0.5 truncate">
              {pathway.regulatingBody}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">
              5. Current Position
            </span>
            <span className="font-semibold text-slate-200 block mt-0.5">
              Lvl {progressMeta.current.level}: {progressMeta.current.name}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">
              6. Your Gaps
            </span>
            <span className="font-semibold text-amber-300 block mt-0.5">
              {openGaps.length} open of {gaps.length} requirements
            </span>
          </div>
        </div>

        {/* 7. Your Next Action */}
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] font-mono text-emerald-400 uppercase block">
              7. Your Next Action
            </span>
            <span className="text-xs font-semibold text-white truncate block mt-0.5">
              {topNextTask ? topNextTask.title : 'All current pathway tasks completed'}
            </span>
          </div>
          <button
            onClick={() => setActiveTab('roadmap')}
            className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-[11px] font-bold shrink-0"
          >
            Go
          </button>
        </div>

        {/* Specificity Adaptation Badge (PI-7) */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            Specificity Level (PI-7): <strong className="text-slate-200">{pathway.specificityUsed}</strong>
          </span>
          <span className="font-mono text-[10px]">{pathway.version}</span>
        </div>
      </section>

      {/* =====================================================================
          UNSUPPORTED PATHWAY HONEST FALLBACK BANNER (Rule PI-8)
         ===================================================================== */}
      {!pathway.isSupported && (
        <div className="rounded-2xl bg-amber-50 border-2 border-amber-300 p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Unsupported Specific Pathway — Generic Guided Plan Active (Rule PI-8)</span>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">{pathway.overview}</p>
        </div>
      )}

      {/* =====================================================================
          THE 9 MULTIDIMENSIONAL DIFFICULTY DIMENSIONS (Rules PI-3 & PI-4, K7)
          Never output "this career is hard" — always specific challenges linked to a gap/task.
         ===================================================================== */}
      <section className="rounded-2xl bg-white border border-stone-200 p-3.5 space-y-3 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800">
              <Grid className="w-3.5 h-3.5 text-emerald-800" />
              <span>9-Dimension Pathway Analysis (PI-3 &amp; PI-4)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Keynote K7: Never say &ldquo;this career is hard.&rdquo; Here are the 9 specific challenges to plan around, each linked to a gap or task.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {pathway.dimensions.map((dim, idx) => {
            const linkedGap = gaps.find((g) => g.requirementId === dim.linkedRequirementId);
            return (
              <div
                key={dim.dimension}
                className="p-3 rounded-xl bg-stone-50/90 border border-stone-200/90 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    {idx + 1}. {dim.dimension}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-stone-200 text-slate-600">
                    {dim.planningHorizonNote}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 italic">{dim.whatItExamines}</p>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {dim.specificChallenge}
                </p>
                {linkedGap && (
                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 truncate">
                      Linked Requirement:{' '}
                      <strong className="text-slate-800">{linkedGap.requirementTitle}</strong>
                    </span>
                    <button
                      onClick={() => setActiveTab('roadmap')}
                      className="inline-flex items-center gap-0.5 text-emerald-800 font-semibold hover:underline shrink-0 ml-2"
                    >
                      <span>Plan Task</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          STRUCTURED PATHWAY REQUIREMENTS & VERIFICATION PROVENANCE (PI-2, PI-6)
         ===================================================================== */}
      <section className="rounded-2xl bg-white border border-stone-200 p-3.5 space-y-3 shadow-sm">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-800" />
            <span>Structured Pathway Requirements (Rules PI-2 &amp; PI-6)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Maintained as structured, versioned data records. The AI never invents or alters requirements. Stale items display an explicit warning.
          </p>
        </div>

        <div className="space-y-3">
          {pathway.requirements.map((req) => {
            const gap = gaps.find((g) => g.requirementId === req.id);
            return (
              <div
                key={req.id}
                className="rounded-xl border border-stone-200 p-3 space-y-2.5 bg-white"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
                      {req.type}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-0.5">{req.title}</h4>
                  </div>
                  {gap && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 border ${
                        gap.status === 'Evidenced'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : gap.status === 'Declared Only'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {gap.status}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{req.description}</p>

                <div className="text-[11px] text-slate-700 bg-stone-50 p-2 rounded-lg border border-stone-200/80 space-y-1">
                  <div>
                    <strong>Deadline / Window:</strong>{' '}
                    {req.isDeadlineVerified ? (
                      req.deadline
                    ) : (
                      <span className="text-amber-800 font-semibold">
                        {req.deadline} (Verification required — OP-5)
                      </span>
                    )}
                  </div>
                  <div>
                    <strong>Evidence Needed:</strong> {req.evidenceNeeded}
                  </div>
                </div>

                <VerificationBadge
                  state={req.isStale ? 'under_review' : 'verified'}
                  source={req.source}
                  organization={req.organization}
                  lastVerified={req.lastVerified}
                  isStale={req.isStale}
                  isDeadlineVerified={req.isDeadlineVerified}
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
