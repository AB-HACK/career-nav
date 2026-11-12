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
  const user = useNorthStore((s) => s.user);
  const identityItems = useNorthStore((s) => s.identityItems);
  const updateGoalAndDestination = useNorthStore((s) => s.updateGoalAndDestination);
  const setActiveTab = useNorthStore((s) => s.setActiveTab);
  const [showDestinationSwitcher, setShowDestinationSwitcher] = useState(false);
  const [customGoalInput, setCustomGoalInput] = useState(
    user.customGoalText || 'Space Law & Orbital Policy'
  );

  const openGaps = gaps.filter((g) => g.status !== 'Evidenced');
  const topNextTask = tasks.find((t) => t.status !== 'Completed' && t.status !== 'Dropped');

  return (
    <div className="space-y-6">
      {/* =====================================================================
          GOAL FRAMING PANEL (Rule SM-5: The 7 Required Framing Items)
         ===================================================================== */}
      <header className="bg-[#14161A] text-[#F9F9F7] border-2 border-[#14161A] p-4 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="type-display text-white">
              {pathway.careerTitle} → {pathway.destinationName}
            </h1>
            <div className="flex items-center gap-1.5 type-label text-[#93C5FD] mt-1.5">
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span>Engine 3 · Goal Framing Panel (Rule SM-5)</span>
            </div>
          </div>
          <button
            onClick={() => setShowDestinationSwitcher(!showDestinationSwitcher)}
            className="min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 bg-[#1F242D] hover:bg-[#2A2E37] border border-[#323846] text-xs font-mono font-bold text-[#93C5FD] transition-colors shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4 shrink-0" />
            <span>Change Goal / Destination (PI-1)</span>
          </button>
        </div>

        {/* Interactive Career + Destination Switcher to test PI-1, RM-6 & PI-8 */}
        {showDestinationSwitcher && (
          <div className="bg-[#1F242D] border border-[#323846] p-4 space-y-3">
            <div className="text-xs text-[#93C5FD] font-semibold">
              Test PI-1 &amp; RM-6: Two users with the same goal and different destinations get different pathways (history preserved).
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#D1D5DB] mb-1.5">
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
                  className="min-h-[44px] w-full px-3 py-2 bg-[#14161A] border border-[#323846] text-sm text-white"
                >
                  {CAREER_FIELDS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#D1D5DB] mb-1.5">
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
                  className="min-h-[44px] w-full px-3 py-2 bg-[#14161A] border border-[#323846] text-sm text-white"
                >
                  {DESTINATIONS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.flag} {d.name} ({d.region})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {user.goalCareerId === 'engineering' && (
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#D1D5DB] mb-1.5">
                  Engineering Sub-Discipline
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                        className={`min-h-[44px] px-3 py-2 text-xs font-mono font-semibold border text-left ${
                          user.engineeringTrack === tr
                            ? 'bg-[#D92B2B] text-white border-[#D92B2B]'
                            : 'bg-[#14161A] text-[#D1D5DB] border-[#323846]'
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
                <label className="block text-[11px] font-mono uppercase text-amber-300 mb-1.5">
                  Custom Unlisted Career Goal (Rule PI-8 Fallback)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={customGoalInput}
                    onChange={(e) => setCustomGoalInput(e.target.value)}
                    className="min-h-[44px] flex-1 px-3 py-2 bg-[#14161A] border border-amber-400 text-sm text-white"
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
                    className="min-h-[44px] px-4 py-2 bg-amber-400 text-[#14161A] text-xs font-mono font-bold uppercase"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* The 7 Mandatory Items of SM-5 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-sm">
          <div className="p-3 bg-[#1F242D] border border-[#323846]">
            <span className="text-[11px] font-mono text-[#9CA3AF] uppercase block">
              1. Your Goal
            </span>
            <span className="font-bold text-white block mt-1">{pathway.careerTitle}</span>
          </div>
          <div className="p-3 bg-[#1F242D] border border-[#323846]">
            <span className="text-[11px] font-mono text-[#9CA3AF] uppercase block">
              2. Your Destination
            </span>
            <span className="font-bold text-white block mt-1">
              {pathway.destinationName}
              {user.institutionOrCity ? ` · ${user.institutionOrCity}` : ''}
            </span>
          </div>
          <div className="p-3 bg-[#1F242D] border border-[#323846]">
            <span className="text-[11px] font-mono text-[#9CA3AF] uppercase block">
              3. Your Profile
            </span>
            <span className="font-semibold text-[#F9F9F7] block mt-1">
              {identityItems.length} recorded items ({progressMeta.evidencedItemsCount} evidenced)
            </span>
          </div>
          <div className="p-3 bg-[#1F242D] border border-[#323846]">
            <span className="text-[11px] font-mono text-[#9CA3AF] uppercase block">
              4. Your Pathway
            </span>
            <span className="font-semibold text-[#93C5FD] block mt-1 truncate">
              {pathway.regulatingBody}
            </span>
          </div>
          <div className="p-3 bg-[#1F242D] border border-[#323846]">
            <span className="text-[11px] font-mono text-[#9CA3AF] uppercase block">
              5. Current Position
            </span>
            <span className="font-semibold text-[#F9F9F7] block mt-1">
              Lvl {progressMeta.current.level}: {progressMeta.current.name}
            </span>
          </div>
          <div
            className={`p-3 border ${
              openGaps.length > 0
                ? 'border-amber-400/70 bg-[#231F18]'
                : 'border-[#323846] bg-[#1F242D]'
            }`}
          >
            <span className="text-[11px] font-mono text-[#9CA3AF] uppercase block">
              6. Your Gaps
            </span>
            <span className="font-semibold text-amber-300 block mt-1">
              {openGaps.length} open of {gaps.length} requirements
            </span>
          </div>
        </div>

        {/* 7. Your Next Action */}
        <div className="p-3.5 bg-[#1F242D] border-2 border-[#D92B2B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[11px] font-mono text-[#FCA5A5] uppercase font-bold block">
              7. Your Next Action
            </span>
            <span className="text-sm font-bold text-white block mt-0.5">
              {topNextTask ? topNextTask.title : 'All current pathway tasks completed'}
            </span>
          </div>
          <button
            onClick={() => setActiveTab('roadmap')}
            className="min-h-[44px] px-4 py-2 bg-[#D92B2B] hover:bg-[#B91C1C] text-white text-xs font-mono font-bold uppercase shrink-0 transition-colors"
          >
            Go →
          </button>
        </div>

        {/* Specificity Adaptation Badge (PI-7) */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#D1D5DB] pt-2 border-t border-[#2A2E37]">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#93C5FD] shrink-0" />
            Specificity Level (PI-7): <strong className="text-white">{pathway.specificityUsed}</strong>
          </span>
          <span className="font-mono text-[11px]">{pathway.version}</span>
        </div>
      </header>

      {/* =====================================================================
          UNSUPPORTED PATHWAY HONEST FALLBACK BANNER (Rule PI-8)
         ===================================================================== */}
      {!pathway.isSupported && (
        <div className="bg-amber-50 border-2 border-amber-500 p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-800 shrink-0" />
            <span>Unsupported Specific Pathway — Generic Guided Plan Active (Rule PI-8)</span>
          </div>
          <p className="text-sm text-amber-950 leading-relaxed">{pathway.overview}</p>
        </div>
      )}

      {/* =====================================================================
          THE 9 MULTIDIMENSIONAL DIFFICULTY DIMENSIONS (Rules PI-3 & PI-4, K7)
         ===================================================================== */}
      <section className="bg-white border-2 border-[#14161A] p-4 sm:p-5 space-y-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[#14161A]">
            <Grid className="w-4 h-4 text-[#1D4ED8] shrink-0" />
            <h2>9-Dimension Pathway Analysis (PI-3 &amp; PI-4)</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#4B5563] mt-1">
            Keynote K7: Never say &ldquo;this career is hard.&rdquo; Here are the 9 specific challenges to plan around, each linked to a gap or task.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {pathway.dimensions.map((dim, idx) => {
            const linkedGap = gaps.find((g) => g.requirementId === dim.linkedRequirementId);
            return (
              <div
                key={dim.dimension}
                className="p-3.5 bg-[#F9F9F7] border border-[#14161A] flex flex-col justify-between gap-2.5"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-extrabold text-[#14161A]">
                      {idx + 1}. {dim.dimension}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 bg-white border border-[#14161A] text-[#14161A]">
                      {dim.planningHorizonNote}
                    </span>
                  </div>
                  <p className="text-xs text-[#4B5563] italic">{dim.whatItExamines}</p>
                  <p className="text-sm text-[#14161A] leading-relaxed font-medium">
                    {dim.specificChallenge}
                  </p>
                </div>
                {linkedGap && (
                  <div className="pt-2 border-t border-[#D6D5CE] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-[#4B5563] truncate">
                      Linked:{' '}
                      <strong className="text-[#14161A]">{linkedGap.requirementTitle}</strong>
                    </span>
                    <button
                      onClick={() => setActiveTab('roadmap')}
                      className="min-h-[44px] px-2.5 inline-flex items-center gap-1 text-[#1D4ED8] font-mono font-bold hover:underline shrink-0"
                    >
                      <span>Plan Task</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
      <section className="bg-white border-2 border-[#14161A] p-4 sm:p-5 space-y-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[#14161A]">
            <FileCheck2 className="w-4 h-4 text-[#1D4ED8] shrink-0" />
            <h2>Structured Pathway Requirements (Rules PI-2 &amp; PI-6)</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#4B5563] mt-1">
            Maintained as structured, versioned data records. The AI never invents or alters requirements. Stale items display an explicit warning.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pathway.requirements.map((req) => {
            const gap = gaps.find((g) => g.requirementId === req.id);
            return (
              <div
                key={req.id}
                className="border-2 border-[#14161A] p-4 space-y-3 bg-white flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-extrabold text-[#14161A]">
                        {req.title}
                      </h3>
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1D4ED8] block mt-0.5">
                        {req.type}
                      </span>
                    </div>
                    {gap && (
                      <span
                        className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase shrink-0 border ${
                          gap.status === 'Evidenced'
                            ? 'bg-emerald-50 text-[#047857] border-[#047857]'
                            : gap.status === 'Declared Only'
                            ? 'bg-amber-50 text-amber-900 border-amber-500'
                            : 'bg-rose-50 text-[#D92B2B] border-[#D92B2B]'
                        }`}
                      >
                        {gap.status}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-[#4B5563] leading-relaxed">{req.description}</p>

                  <div className="text-xs sm:text-sm text-[#14161A] bg-[#F2F1EC] p-3 border border-[#D6D5CE] space-y-1">
                    <div>
                      <strong>Deadline / Window:</strong>{' '}
                      {req.isDeadlineVerified ? (
                        req.deadline
                      ) : (
                        <span className="text-amber-900 font-bold">
                          {req.deadline} (Verification required — OP-5)
                        </span>
                      )}
                    </div>
                    <div>
                      <strong>Evidence Needed:</strong> {req.evidenceNeeded}
                    </div>
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
