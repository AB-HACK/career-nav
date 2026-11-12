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
    <div className="p-3.5 space-y-4">
      {/* Header */}
      <section className="rounded-2xl bg-[#0F172A] text-white p-4 space-y-2 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-emerald-400">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Engine 1 · Living Career Identity &amp; Settings (CI-3..7, VO-4)</span>
          </div>
        </div>
        <h2 className="text-base font-bold">{user.name || 'Career Navigator'}</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Keynote K5 &amp; K6: Your Career Identity learns from what you complete and tracks Declared vs. Evidenced proof. Revisit your Value Orientation weights anytime.
        </p>
      </section>

      {/* Progressive Profile Prompt if any remain */}
      <ProgressivePromptCard />

      {/* =====================================================================
          VALUE ORIENTATION EDITOR IN SETTINGS (Rules VO-4, VO-5, VO-6)
          Changes re-score opportunities and re-rank priorities; never changes goal or gaps.
         ===================================================================== */}
      <section className="rounded-2xl bg-white border border-stone-200 p-3.5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800">
            <Sliders className="w-3.5 h-3.5 text-emerald-800" />
            <span>Value Orientation Weighting Layer (VO-4 &amp; VO-5)</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200">
            {valueOrientation.archetype}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Rule VO-5: Changing your orientation updates Leverage scores and task priorities immediately, while leaving your career goal and pathway requirements 100% untouched.
        </p>

        {/* 4 Archetype Buttons */}
        <div className="grid grid-cols-2 gap-1.5">
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
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  active
                    ? 'bg-emerald-950 text-white border-emerald-900 shadow-sm'
                    : 'bg-stone-50 text-slate-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="text-xs font-bold">{arch}</div>
                <div
                  className={`text-[10px] mt-0.5 line-clamp-1 ${
                    active ? 'text-emerald-200' : 'text-slate-500'
                  }`}
                >
                  {ARCHETYPE_DESCRIPTIONS[arch].tagline}
                </div>
              </button>
            );
          })}
        </div>

        {/* 3 Sliders */}
        <div className="space-y-2.5 pt-2 border-t border-stone-100">
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
              <div className="flex justify-between text-[11px]">
                <span className="font-medium text-slate-700">{s.label}</span>
                <span className="font-mono font-bold text-slate-800">
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
                className="w-full accent-emerald-800 cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* Active Weight Readout */}
        <div className="rounded-lg bg-stone-50 border border-stone-200 p-2.5 text-[11px] font-mono text-slate-700 grid grid-cols-2 gap-1">
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
          LIVING CAREER IDENTITY ITEMS & EVIDENCE ATTACHMENT (CI-3, CI-4)
         ===================================================================== */}
      <section className="rounded-2xl bg-white border border-stone-200 p-3.5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-800" />
            <span>Career Identity &amp; Evidence Wallet (CI-3 &amp; CI-4)</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {identityItems.filter((i) => i.status === 'evidenced').length}/{identityItems.length} Evidenced
          </span>
        </div>

        <div className="space-y-2">
          {identityItems.map((item) => {
            const isEvidenced = item.status === 'evidenced';
            return (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      {item.category}
                      {item.constraintSubType ? ` · ${item.constraintSubType}` : ''}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">{item.detail}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${
                      isEvidenced
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        : 'bg-amber-50 text-amber-900 border-amber-200'
                    }`}
                  >
                    {isEvidenced ? '✓ Evidenced' : 'Declared'}
                  </span>
                </div>

                {isEvidenced && item.evidenceFileName && (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-900 bg-emerald-50/80 px-2.5 py-1 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="truncate">
                      <strong>{item.evidenceType}:</strong> {item.evidenceFileName}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 pt-1">
                  {!isEvidenced && item.category !== 'constraint' ? (
                    <div className="flex flex-wrap gap-1">
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
                            className="px-2 py-1 rounded bg-white hover:bg-emerald-50 border border-stone-300 text-[10px] font-semibold text-slate-800"
                          >
                            + Attach {evType} (CI-4)
                          </button>
                        )
                      )}
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">
                      Updated {item.updatedAt.slice(0, 10)}
                    </span>
                  )}

                  <button
                    onClick={() => removeIdentityItem(item.id)}
                    className="text-[11px] text-rose-700 hover:underline ml-auto"
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
          className="pt-2 border-t border-stone-200 space-y-2"
        >
          <span className="text-xs font-bold text-slate-800 block">
            + Add Skill, Experience, or Achievement
          </span>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as IdentityCategory)}
              className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
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
              className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
            >
              <option value="practical-experience">Closes: Practical / Portfolio</option>
              <option value="licensing-exam">Closes: Licensing / Exam</option>
              <option value="research-output">Closes: Research / Output</option>
              <option value="language-verified">Closes: Language / Visa</option>
              <option value="degree-completed">Closes: Primary Degree</option>
            </select>
          </div>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g., Published Clinical Audit / AWS Certified / Law Externship"
            className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
          />
          <button
            type="submit"
            className="w-full py-2 px-3 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add to Living Career Identity</span>
          </button>
        </form>
      </section>

      {/* =====================================================================
          CAPACITY & TIMELINE CALIBRATION (Rules EX-8 & EX-9)
         ===================================================================== */}
      <section className="rounded-2xl bg-white border border-stone-200 p-3.5 space-y-2.5 shadow-sm">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800">
          <Clock className="w-3.5 h-3.5 text-emerald-800" />
          <span>Capacity &amp; Target Horizon (Rules EX-8 &amp; EX-9)</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[11px] text-slate-600 mb-1">
              Weekly Hours Available
            </label>
            <input
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
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-600 mb-1">
              Target Months to Launch
            </label>
            <input
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
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 font-mono"
            />
          </div>
        </div>
        <p className="text-[11px] text-slate-500">
          Tip: Set Target Months to <strong>4</strong> to see the non-intrusive <strong>Rule EX-8</strong> Strategic Timeline Pushback on the Home screen.
        </p>
      </section>

      {/* =====================================================================
          PRIVACY CONSENT & DATA SOVEREIGNTY (Rules CI-6, CI-7, Section 11)
         ===================================================================== */}
      <section className="rounded-2xl bg-white border border-stone-200 p-3.5 space-y-3 shadow-sm">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800">
          <Shield className="w-3.5 h-3.5 text-emerald-800" />
          <span>Consent &amp; Data Control (Rules CI-6 &amp; CI-7)</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Constraint data (finances, visa status, geographic access, barriers) requires explicit per-category consent and is used strictly to filter recommendations (NDPA / KDPA / POPIA / GDPR aligned).
        </p>

        <div className="space-y-1.5">
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
                className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900">{item.label}</div>
                  <div className="text-[10px] text-slate-500">{item.purpose}</div>
                </div>
                <button
                  onClick={() => toggleConsent(item.key, !granted)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors shrink-0 ${
                    granted
                      ? 'bg-emerald-900 text-white border-emerald-950'
                      : 'bg-stone-200 text-slate-700 border-stone-300'
                  }`}
                >
                  {granted ? 'Consent Active' : 'Withdrawn'}
                </button>
              </div>
            );
          })}
        </div>

        {exportStatus && (
          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium">
            {exportStatus}
          </div>
        )}

        {/* Export & Delete Buttons (CI-6) */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleExportProfile}
            className="py-2 px-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON (CI-6)</span>
          </button>
          <button
            onClick={resetOrDeleteProfileData}
            className="py-2 px-3 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Data (CI-6)</span>
          </button>
        </div>

        <button
          onClick={resetToDefaultDemoUser}
          className="w-full py-1.5 text-[11px] text-slate-500 hover:text-slate-900 underline"
        >
          Restore Default Seeded Demo Profile (Amara Okafor)
        </button>
      </section>
    </div>
  );
};
