import React, { useState } from 'react';
import {
  UserCheck,
  Sliders,
  FileCheck2,
  Plus,
  Shield,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import {
  ArchetypeName,
  ConstraintCategory,
  IdentityCategory,
} from '../../types/domain';
import { ARCHETYPE_DESCRIPTIONS } from '../../engines/valueOrientationEngine';
import { useNorthStore } from '../../store/useNorthStore';
import { ProgressivePromptCard } from '../../components/shared/ProgressivePromptCard';

export const ProfileSettingsView: React.FC = () => {
  const user = useNorthStore((s) => s.user);
  const valueOrientation = useNorthStore((s) => s.valueOrientation);
  const identityItems = useNorthStore((s) => s.identityItems);
  const consent = useNorthStore((s) => s.consent);
  const goalHistory = useNorthStore((s) => s.goalHistory);
  const setValueOrientation = useNorthStore((s) => s.setValueOrientation);
  const addOrUpdateIdentityItem = useNorthStore((s) => s.addOrUpdateIdentityItem);
  const attachEvidenceToItem = useNorthStore((s) => s.attachEvidenceToItem);
  const removeIdentityItem = useNorthStore((s) => s.removeIdentityItem);
  const toggleConsent = useNorthStore((s) => s.toggleConsent);
  const updateCapacitySettings = useNorthStore((s) => s.updateCapacitySettings);
  const resetOrDeleteProfileData = useNorthStore((s) => s.resetOrDeleteProfileData);
  const resetToDefaultDemoUser = useNorthStore((s) => s.resetToDefaultDemoUser);

  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newCategory, setNewCategory] = useState<IdentityCategory>('skill');
  const [newMatchTag, setNewMatchTag] = useState('practical-experience');
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addOrUpdateIdentityItem({
      category: newCategory,
      title: newTitle.trim(),
      detail: newDetail.trim() || 'Added directly in Career Identity wallet',
      matchTag: newMatchTag,
      status: 'declared',
    });
    setNewTitle('');
    setNewDetail('');
  };

  // CI-6: Export all profile data as JSON
  const handleExportProfile = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      user,
      valueOrientation,
      identityItems,
      consent,
      goalHistory,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `north-career-identity-${user.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportStatus('Profile JSON exported successfully (Rule CI-6).');
    setTimeout(() => setExportStatus(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="bg-[#14161A] text-[#F9F9F7] border-2 border-[#14161A] p-4 sm:p-6 space-y-2">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
          {user.name || 'Career Navigator'}
        </h1>
        <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#93C5FD]">
          <UserCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Engine 1 · Living Career Identity &amp; Settings (CI-3..7, VO-4)</span>
        </div>
        <p className="text-sm text-[#D1D5DB] leading-relaxed pt-1">
          Keynote K5 &amp; K6: Your Career Identity learns from what you complete and tracks Declared vs. Evidenced proof. Revisit your Value Orientation weights anytime.
        </p>
      </header>

      {/* Progressive Profile Prompt if any remain */}
      <ProgressivePromptCard />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* =====================================================================
            VALUE ORIENTATION EDITOR IN SETTINGS (Rules VO-4, VO-5, VO-6)
           ===================================================================== */}
        <section className="bg-white border-2 border-[#14161A] p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D6D5CE] pb-3">
            <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[#14161A]">
              <Sliders className="w-4 h-4 text-[#1D4ED8] shrink-0" />
              <h2>Value Orientation Weighting Layer (VO-4 &amp; VO-5)</h2>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 bg-[#EFF6FF] text-[#1D4ED8] font-bold border border-[#1D4ED8]">
              {valueOrientation.archetype}
            </span>
          </div>

          <p className="text-sm text-[#4B5563] leading-relaxed">
            Rule VO-5: Changing your orientation updates Leverage scores and task priorities immediately, while leaving your career goal and pathway requirements 100% untouched.
          </p>

          {/* 4 Archetype Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(
              ['Maximizer', 'Balanced Builder', 'Stability Seeker', 'Mission-Driven'] as ArchetypeName[]
            ).map((arch) => {
              const active = valueOrientation.archetype === arch;
              return (
                <button
                  key={arch}
                  onClick={() =>
                    setValueOrientation(arch, {
                      orientation: 0,
                      riskAppetite: 0,
                      timeHorizon: 0,
                    })
                  }
                  className={`min-h-[52px] p-3 border-2 text-left transition-colors ${
                    active
                      ? 'bg-[#14161A] text-white border-[#D92B2B]'
                      : 'bg-[#F9F9F7] text-[#14161A] border-[#D6D5CE] hover:border-[#14161A]'
                  }`}
                >
                  <div className="text-sm font-bold">{arch}</div>
                  <div
                    className={`text-xs mt-0.5 line-clamp-1 ${
                      active ? 'text-[#D1D5DB]' : 'text-[#4B5563]'
                    }`}
                  >
                    {ARCHETYPE_DESCRIPTIONS[arch].tagline}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 3 Sliders */}
          <div className="space-y-3 pt-2 border-t border-[#D6D5CE]">
            {(
              [
                {
                  key: 'orientation',
                  label: 'Orientation (Security ↔ Prestige/Impact)',
                },
                {
                  key: 'riskAppetite',
                  label: 'Risk Appetite (Low Disruption ↔ High Ceiling)',
                },
                {
                  key: 'timeHorizon',
                  label: 'Time Horizon (Immediate ↔ Long-Term)',
                },
              ] as const
            ).map((s) => (
              <div key={s.key} className="space-y-1">
                <div className="flex justify-between gap-2 text-xs sm:text-sm">
                  <span className="font-semibold text-[#14161A]">{s.label}</span>
                  <span className="font-mono font-bold text-[#1D4ED8] shrink-0">
                    {valueOrientation.sliders[s.key] > 0
                      ? `+${valueOrientation.sliders[s.key]}`
                      : valueOrientation.sliders[s.key]}
                  </span>
                </div>
                <input
                  type="range"
                  min={-2}
                  max={2}
                  step={1}
                  value={valueOrientation.sliders[s.key]}
                  onChange={(e) =>
                    setValueOrientation(valueOrientation.archetype, {
                      ...valueOrientation.sliders,
                      [s.key]: Number(e.target.value),
                    })
                  }
                  className="w-full cursor-pointer"
                />
              </div>
            ))}
          </div>

          {/* Active Weight Readout */}
          <div className="bg-[#F2F1EC] border border-[#14161A] p-3 text-xs font-mono text-[#14161A] grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <div>Gaps Closed: +{valueOrientation.weights.gapsClosed.toFixed(2)}</div>
            <div>Halo/Credibility: +{valueOrientation.weights.credibility.toFixed(2)}</div>
            <div>Funding: +{valueOrientation.weights.funding.toFixed(2)}</div>
            <div>Mentor/Net: +{valueOrientation.weights.networkAndMentor.toFixed(2)}</div>
            <div>Impact Fit: +{valueOrientation.weights.impactAlignment.toFixed(2)}</div>
            <div>Disruption Cost: −{valueOrientation.weights.disruptionCost.toFixed(2)}</div>
            <div>Delay Cost: −{valueOrientation.weights.delayToPayoff.toFixed(2)}</div>
          </div>
        </section>

        {/* =====================================================================
            CAPACITY & TIMELINE CALIBRATION (Rules EX-8 & EX-9)
           ===================================================================== */}
        <section className="bg-white border-2 border-[#14161A] p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[#14161A] border-b border-[#D6D5CE] pb-3">
            <Clock className="w-4 h-4 text-[#1D4ED8] shrink-0" />
            <h2>Capacity &amp; Target Horizon (Rules EX-8 &amp; EX-9)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <label
                htmlFor="weekly-hours-input"
                className="block text-xs font-semibold text-[#14161A] mb-1.5"
              >
                Weekly Hours Available
              </label>
              <input
                id="weekly-hours-input"
                type="number"
                min={2}
                max={40}
                value={user.weeklyHoursAvailable}
                onChange={(e) =>
                  updateCapacitySettings(
                    Number(e.target.value) || 6,
                    user.targetMonthsToLaunch
                  )
                }
                className="min-h-[44px] w-full px-3 py-2 border-2 border-[#14161A] font-mono text-sm bg-[#F9F9F7]"
              />
            </div>
            <div>
              <label
                htmlFor="target-months-input"
                className="block text-xs font-semibold text-[#14161A] mb-1.5"
              >
                Target Months to Launch
              </label>
              <input
                id="target-months-input"
                type="number"
                min={3}
                max={60}
                value={user.targetMonthsToLaunch}
                onChange={(e) =>
                  updateCapacitySettings(
                    user.weeklyHoursAvailable,
                    Number(e.target.value) || 12
                  )
                }
                className="min-h-[44px] w-full px-3 py-2 border-2 border-[#14161A] font-mono text-sm bg-[#F9F9F7]"
              />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#4B5563]">
            Tip: Set Target Months to <strong>4</strong> to see the non-intrusive <strong>Rule EX-8</strong> Strategic Timeline Pushback on the Home screen.
          </p>
        </section>
      </div>

      {/* =====================================================================
          LIVING CAREER IDENTITY ITEMS & EVIDENCE ATTACHMENT (CI-3, CI-4)
         ===================================================================== */}
      <section className="bg-white border-2 border-[#14161A] p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D6D5CE] pb-3">
          <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[#14161A]">
            <FileCheck2 className="w-4 h-4 text-[#1D4ED8] shrink-0" />
            <h2>Career Identity &amp; Evidence Wallet (CI-3 &amp; CI-4)</h2>
          </div>
          <span className="text-xs font-mono font-bold text-[#14161A]">
            {identityItems.filter((i) => i.status === 'evidenced').length}/{identityItems.length} Evidenced
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {identityItems.map((item) => {
            const isEvidenced = item.status === 'evidenced';
            return (
              <div
                key={item.id}
                className="p-3.5 border border-[#14161A] bg-[#F9F9F7] space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#14161A]">{item.title}</h3>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#4B5563] block mt-0.5">
                        {item.category}
                        {item.constraintSubType ? ` · ${item.constraintSubType}` : ''}
                      </span>
                      <p className="text-xs text-[#4B5563] mt-1">{item.detail}</p>
                    </div>
                    <span
                      className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase border shrink-0 ${
                        isEvidenced
                          ? 'bg-emerald-50 text-[#047857] border-[#047857]'
                          : 'bg-amber-50 text-amber-900 border-amber-500'
                      }`}
                    >
                      {isEvidenced ? '✓ Evidenced' : 'Declared'}
                    </span>
                  </div>

                  {isEvidenced && item.evidenceFileName && (
                    <div className="flex items-center gap-1.5 text-xs text-[#047857] bg-emerald-50 px-3 py-2 border border-[#047857]">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span className="truncate font-mono">
                        <strong>{item.evidenceType}:</strong> {item.evidenceFileName}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#D6D5CE]">
                  {!isEvidenced && item.category !== 'constraint' ? (
                    <div className="flex flex-wrap gap-1.5">
                      {(['CV', 'Transcript', 'Certificate', 'Publication'] as const).map(
                        (evType) => (
                          <button
                            key={evType}
                            onClick={() =>
                              attachEvidenceToItem(
                                item.id,
                                evType,
                                `${evType}_${item.matchTag}_verified.pdf`
                              )
                            }
                            className="min-h-[44px] px-2.5 py-1.5 bg-white hover:bg-[#EFF6FF] border border-[#14161A] text-[11px] font-mono font-bold text-[#14161A]"
                          >
                            + Attach {evType} (CI-4)
                          </button>
                        )
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] text-[#4B5563] font-mono">
                      Updated {item.updatedAt.slice(0, 10)}
                    </span>
                  )}

                  <button
                    onClick={() => removeIdentityItem(item.id)}
                    className="min-h-[44px] px-3 text-xs font-mono font-bold text-[#D92B2B] hover:underline ml-auto"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add New Profile Item Form */}
        <form
          onSubmit={handleAddItem}
          className="pt-4 border-t-2 border-[#14161A] space-y-3"
        >
          <span className="text-sm font-extrabold text-[#14161A] block">
            + Add Skill, Experience, or Achievement
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as IdentityCategory)}
              className="min-h-[44px] px-3 py-2 border-2 border-[#14161A] text-sm bg-white"
            >
              <option value="education">Education</option>
              <option value="experience">Experience</option>
              <option value="skill">Skill</option>
              <option value="achievement">Achievement</option>
              <option value="interest">Interest</option>
            </select>
            <select
              value={newMatchTag}
              onChange={(e) => setNewMatchTag(e.target.value)}
              className="min-h-[44px] px-3 py-2 border-2 border-[#14161A] text-sm bg-white"
            >
              <option value="practical-experience">Closes: Practical / Portfolio</option>
              <option value="licensing-exam">Closes: Licensing / Exam</option>
              <option value="research-output">Closes: Research / Output</option>
              <option value="language-verified">Closes: Language / Visa</option>
              <option value="degree-completed">Closes: Primary Degree</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g., Published Clinical Audit / AWS Certified / Law Externship"
              className="min-h-[44px] flex-1 px-3 py-2 border-2 border-[#14161A] text-sm bg-white"
            />
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2.5 bg-[#14161A] hover:bg-[#1D4ED8] text-white text-xs font-mono font-bold uppercase flex items-center justify-center gap-1.5 shrink-0 transition-colors"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Add to Living Career Identity</span>
            </button>
          </div>
        </form>
      </section>

      {/* =====================================================================
          PRIVACY CONSENT & DATA SOVEREIGNTY (Rules CI-6, CI-7, Section 11)
         ===================================================================== */}
      <section className="bg-white border-2 border-[#14161A] p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[#14161A] border-b border-[#D6D5CE] pb-3">
          <Shield className="w-4 h-4 text-[#1D4ED8] shrink-0" />
          <h2>Consent &amp; Data Control (Rules CI-6 &amp; CI-7)</h2>
        </div>
        <p className="text-sm text-[#4B5563] leading-relaxed">
          Constraint data (finances, visa status, geographic access, barriers) requires explicit per-category consent and is used strictly to filter recommendations (NDPA / KDPA / POPIA / GDPR aligned).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {(
            [
              {
                key: 'finances',
                label: 'Financial & Scholarship Need Constraints',
                purpose: 'Filters out expensive self-funded programmes when funding is required',
              },
              {
                key: 'visa',
                label: 'Visa & Work Sponsorship Eligibility',
                purpose: 'Checks Funnel Stage 3 international sponsorship rules',
              },
              {
                key: 'geography',
                label: 'Geographic & Relocation Constraints',
                purpose: 'Weights local vs. cross-border disruption costs',
              },
              {
                key: 'barriers',
                label: 'Institutional & Access Barriers',
                purpose: 'Tailors weekly task pacing and mentor recommendations',
              },
            ] as Array<{ key: ConstraintCategory; label: string; purpose: string }>
          ).map((item) => {
            const granted = consent[item.key].granted;
            return (
              <div
                key={item.key}
                className="flex items-center justify-between gap-3 p-3 bg-[#F9F9F7] border border-[#14161A]"
              >
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#14161A]">{item.label}</div>
                  <div className="text-xs text-[#4B5563] mt-0.5">{item.purpose}</div>
                </div>
                <button
                  onClick={() => toggleConsent(item.key, !granted)}
                  className={`min-h-[44px] px-3 py-1.5 text-[11px] font-mono font-bold uppercase border transition-colors shrink-0 ${
                    granted
                      ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                      : 'bg-[#E4E2DA] text-[#14161A] border-[#14161A]'
                  }`}
                >
                  {granted ? 'Consent Active' : 'Withdrawn'}
                </button>
              </div>
            );
          })}
        </div>

        {exportStatus && (
          <div className="p-3 bg-emerald-50 border border-[#047857] text-sm text-[#047857] font-semibold">
            {exportStatus}
          </div>
        )}

        {/* Export & Delete Buttons (CI-6) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={handleExportProfile}
            className="min-h-[44px] py-2.5 px-4 border-2 border-[#14161A] bg-white hover:bg-[#F2F1EC] text-[#14161A] text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>Export JSON (CI-6)</span>
          </button>
          <button
            onClick={resetOrDeleteProfileData}
            className="min-h-[44px] py-2.5 px-4 border-2 border-[#D92B2B] bg-rose-50 hover:bg-[#D92B2B] hover:text-white text-[#D92B2B] text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span>Delete Data (CI-6)</span>
          </button>
        </div>

        <button
          onClick={resetToDefaultDemoUser}
          className="min-h-[44px] w-full py-2 text-xs font-mono text-[#4B5563] hover:text-[#14161A] underline"
        >
          Restore Default Seeded Demo Profile (Amara Okafor)
        </button>
      </section>
    </div>
  );
};
