import React, { useState } from 'react';
import {
  Calculator,
  ArrowLeft,
  Sliders,
  RotateCcw,
  Zap,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import {
  ArchetypeName,
  OpportunityFacts,
  VerificationState,
} from '../../types/domain';
import {
  ARCHETYPE_BASE_WEIGHTS,
  FORMULA_VERSION,
} from '../../engines/valueOrientationEngine';
import { classifyLeverageLevel } from '../../engines/leverageEngine';
import { useNorthStore } from '../../store/useNorthStore';

interface PrdSimulatorViewProps {
  onNavigateRoute: (route: '/' | '/curator' | '/simulator') => void;
}

const DEFAULT_SEC9_FACTS: OpportunityFacts = {
  gapsClosed: 9,
  credibility: 8,
  funding: 7,
  networkAndMentor: 8,
  impactAlignment: 8,
  disruptionCost: 7,
  delayToPayoff: 6,
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export const PrdSimulatorView: React.FC<PrdSimulatorViewProps> = ({
  onNavigateRoute,
}) => {
  const {
    user,
    valueOrientation,
    setValueOrientation,
    simulateMissedTasksWorkloadScaling,
    simulateFiveSubmissionsZeroOutcomes,
    resetToDefaultDemoUser,
  } = useNorthStore();

  const [facts, setFacts] = useState<OpportunityFacts>(DEFAULT_SEC9_FACTS);
  const [simVerificationState, setSimVerificationState] =
    useState<VerificationState>('verified');
  const [triggerBanner, setTriggerBanner] = useState<string | null>(null);

  const archetypes: ArchetypeName[] = [
    'Maximizer',
    'Balanced Builder',
    'Stability Seeker',
    'Mission-Driven',
  ];

  // Compute score per archetype using the exact Section 9 formula
  const computeForArchetype = (arch: ArchetypeName) => {
    const w = ARCHETYPE_BASE_WEIGHTS[arch];
    const benefits = round2(
      w.gapsClosed * facts.gapsClosed +
        w.credibility * facts.credibility +
        w.funding * facts.funding +
        w.networkAndMentor * facts.networkAndMentor +
        w.impactAlignment * facts.impactAlignment
    );
    const costs = round2(
      w.disruptionCost * facts.disruptionCost +
        w.delayToPayoff * facts.delayToPayoff
    );
    const net = round2(benefits - costs);
    const uncappedLevel = classifyLeverageLevel(net);
    const isVerified = simVerificationState === 'verified';
    const finalLevel =
      !isVerified &&
      (uncappedLevel === 'Exceptional' || uncappedLevel === 'High Leverage')
        ? 'Normal'
        : uncappedLevel;

    return {
      w,
      benefits,
      costs,
      net,
      uncappedLevel,
      finalLevel,
      wasCapped: finalLevel !== uncappedLevel,
    };
  };

  return (
    <div className="min-h-screen bg-stone-100 text-slate-900">
      {/* Header */}
      <header className="bg-[#0F172A] text-white border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight">
                  PRD SECTION 9 WORKED EXAMPLE &amp; ACCEPTANCE SIMULATOR
                </h1>
                <span className="px-2 py-0.5 rounded bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-mono">
                  DEMO SANDBOX · /simulator
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Standalone verification workbench for testing Section 9 arithmetic, Value Orientation weights, and P1–P6 acceptance triggers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateRoute('/curator')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
            >
              Open /curator Queue
            </button>
            <button
              onClick={() => onNavigateRoute('/')}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to User App (/)</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {triggerBanner && (
          <div className="rounded-xl bg-emerald-900 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{triggerBanner}</span>
            </div>
            <button
              onClick={() => onNavigateRoute('/')}
              className="px-3 py-1 rounded-lg bg-white text-slate-950 text-xs font-bold shrink-0"
            >
              Inspect in User App (/) →
            </button>
          </div>
        )}

        {/* ===================================================================
            SECTION 9 WORKED EXAMPLE INTERACTIVE MATRIX
           =================================================================== */}
        <section className="rounded-2xl bg-white border border-stone-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                PRD Section 9 · Deterministic Leverage Formula ({FORMULA_VERSION})
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Score = sum(weight × benefit) − sum(weight × cost)
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Opportunity: <strong>Funded Research Programme</strong> (funding, research experience, mentor, conference, network; requires relocation).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setSimVerificationState(
                    simVerificationState === 'verified' ? 'unverified' : 'verified'
                  )
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  simVerificationState === 'verified'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : 'bg-amber-100 text-amber-950 border-amber-400'
                }`}
              >
                Verification State: {simVerificationState.toUpperCase()} (Test OP-6 Cap)
              </button>
              <button
                onClick={() => {
                  setFacts(DEFAULT_SEC9_FACTS);
                  setSimVerificationState('verified');
                }}
                className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-xs font-semibold text-slate-700 inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset to Sec. 9 Numbers
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Interactive 0-10 Fact Sliders */}
            <div className="lg:col-span-4 rounded-xl bg-stone-50 border border-stone-200 p-4 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800">
                <Sliders className="w-3.5 h-3.5 text-emerald-800" />
                <span>Opportunity Facts (0–10)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                The facts stay the same for every user; only the weights change with Value Orientation.
              </p>

              {(
                [
                  { key: 'gapsClosed', label: 'Gaps closed (Sec. 9 = 9)', kind: 'benefit' },
                  { key: 'credibility', label: 'Credibility / halo (Sec. 9 = 8)', kind: 'benefit' },
                  { key: 'funding', label: 'Funding (Sec. 9 = 7)', kind: 'benefit' },
                  { key: 'networkAndMentor', label: 'Network & mentor (Sec. 9 = 8)', kind: 'benefit' },
                  { key: 'impactAlignment', label: 'Impact alignment (Gap 3 = 8)', kind: 'benefit' },
                  { key: 'disruptionCost', label: 'Disruption cost (Sec. 9 = 7)', kind: 'cost' },
                  { key: 'delayToPayoff', label: 'Delay to payoff (Sec. 9 = 6)', kind: 'cost' },
                ] as Array<{ key: keyof OpportunityFacts; label: string; kind: 'benefit' | 'cost' }>
              ).map((item) => (
                <div key={item.key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">{item.label}</span>
                    <span
                      className={`font-mono font-bold ${
                        item.kind === 'benefit' ? 'text-emerald-800' : 'text-rose-700'
                      }`}
                    >
                      {facts[item.key]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={facts[item.key]}
                    onChange={(e) =>
                      setFacts({ ...facts, [item.key]: Number(e.target.value) })
                    }
                    className="w-full accent-slate-900 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Right: Side-by-Side Comparison Table (Exact Section 9 Layout) */}
            <div className="lg:col-span-8 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs rounded-xl overflow-hidden border border-stone-200">
                <thead>
                  <tr className="bg-[#0F172A] text-white">
                    <th className="py-3 px-3 font-semibold">Factor (Fact Value)</th>
                    {archetypes.map((arch) => (
                      <th key={arch} className="py-3 px-3 font-semibold text-right">
                        <div>{arch}</div>
                        <button
                          onClick={() => {
                            setValueOrientation(arch, {
                              orientation: 0,
                              riskAppetite: 0,
                              timeHorizon: 0,
                            });
                            setTriggerBanner(
                              `Active User App orientation switched to "${arch}". All opportunities in (/) are now re-scored!`
                            );
                          }}
                          className={`mt-1 px-2 py-0.5 rounded text-[10px] font-mono ${
                            valueOrientation.archetype === arch
                              ? 'bg-emerald-400 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {valueOrientation.archetype === arch ? 'Active in App' : 'Apply to App'}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white font-mono">
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-800">
                      Gaps closed ({facts.gapsClosed}) <span className="text-emerald-700">[+]</span>
                    </td>
                    {archetypes.map((a) => (
                      <td key={a} className="py-2.5 px-3 text-right text-slate-700">
                        {ARCHETYPE_BASE_WEIGHTS[a].gapsClosed.toFixed(2)}{' '}
                        <span className="text-emerald-700 font-semibold">
                          (+{(ARCHETYPE_BASE_WEIGHTS[a].gapsClosed * facts.gapsClosed).toFixed(2)})
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-800">
                      Credibility / halo ({facts.credibility}) <span className="text-emerald-700">[+]</span>
                    </td>
                    {archetypes.map((a) => (
                      <td key={a} className="py-2.5 px-3 text-right text-slate-700">
                        {ARCHETYPE_BASE_WEIGHTS[a].credibility.toFixed(2)}{' '}
                        <span className="text-emerald-700 font-semibold">
                          (+{(ARCHETYPE_BASE_WEIGHTS[a].credibility * facts.credibility).toFixed(2)})
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-800">
                      Funding ({facts.funding}) <span className="text-emerald-700">[+]</span>
                    </td>
                    {archetypes.map((a) => (
                      <td key={a} className="py-2.5 px-3 text-right text-slate-700">
                        {ARCHETYPE_BASE_WEIGHTS[a].funding.toFixed(2)}{' '}
                        <span className="text-emerald-700 font-semibold">
                          (+{(ARCHETYPE_BASE_WEIGHTS[a].funding * facts.funding).toFixed(2)})
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-800">
                      Network and mentor ({facts.networkAndMentor}) <span className="text-emerald-700">[+]</span>
                    </td>
                    {archetypes.map((a) => (
                      <td key={a} className="py-2.5 px-3 text-right text-slate-700">
                        {ARCHETYPE_BASE_WEIGHTS[a].networkAndMentor.toFixed(2)}{' '}
                        <span className="text-emerald-700 font-semibold">
                          (+{(ARCHETYPE_BASE_WEIGHTS[a].networkAndMentor * facts.networkAndMentor).toFixed(2)})
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-800">
                      Impact alignment ({facts.impactAlignment}) <span className="text-emerald-700">[+]</span>
                    </td>
                    {archetypes.map((a) => (
                      <td key={a} className="py-2.5 px-3 text-right text-slate-700">
                        {ARCHETYPE_BASE_WEIGHTS[a].impactAlignment.toFixed(2)}{' '}
                        <span className="text-emerald-700 font-semibold">
                          (+{(ARCHETYPE_BASE_WEIGHTS[a].impactAlignment * facts.impactAlignment).toFixed(2)})
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-rose-50/30">
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-800">
                      Disruption cost ({facts.disruptionCost}), subtracted{' '}
                      <span className="text-rose-700">[−]</span>
                    </td>
                    {archetypes.map((a) => (
                      <td key={a} className="py-2.5 px-3 text-right text-slate-700">
                        {ARCHETYPE_BASE_WEIGHTS[a].disruptionCost.toFixed(2)}{' '}
                        <span className="text-rose-700 font-semibold">
                          (−{(ARCHETYPE_BASE_WEIGHTS[a].disruptionCost * facts.disruptionCost).toFixed(2)})
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-rose-50/30">
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-800">
                      Delay to payoff ({facts.delayToPayoff}), subtracted{' '}
                      <span className="text-rose-700">[−]</span>
                    </td>
                    {archetypes.map((a) => (
                      <td key={a} className="py-2.5 px-3 text-right text-slate-700">
                        {ARCHETYPE_BASE_WEIGHTS[a].delayToPayoff.toFixed(2)}{' '}
                        <span className="text-rose-700 font-semibold">
                          (−{(ARCHETYPE_BASE_WEIGHTS[a].delayToPayoff * facts.delayToPayoff).toFixed(2)})
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
                <tfoot className="bg-stone-100 border-t-2 border-stone-300 font-mono">
                  <tr>
                    <td className="py-3 px-3 font-sans font-bold text-slate-900">
                      Resulting Score (−10 to +10)
                    </td>
                    {archetypes.map((a) => {
                      const res = computeForArchetype(a);
                      return (
                        <td
                          key={a}
                          className="py-3 px-3 text-right text-base font-bold text-slate-900"
                        >
                          {res.net.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="bg-stone-200/70">
                    <td className="py-3 px-3 font-sans font-bold text-slate-900">
                      Level (Thresholds: ≥5.0, ≥3.5, ≥2.0)
                    </td>
                    {archetypes.map((a) => {
                      const res = computeForArchetype(a);
                      const badgeStyle = {
                        Exceptional: 'bg-emerald-900 text-white',
                        'High Leverage': 'bg-emerald-100 text-emerald-950 border border-emerald-300',
                        Normal: 'bg-stone-300 text-slate-900',
                        'Low fit': 'bg-amber-100 text-amber-900 border border-amber-300',
                      }[res.finalLevel];
                      return (
                        <td key={a} className="py-3 px-3 text-right font-sans">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${badgeStyle}`}>
                            {res.finalLevel}
                          </span>
                          {res.wasCapped && (
                            <div className="text-[10px] text-amber-800 mt-1 font-semibold">
                              Capped from {res.uncappedLevel} (OP-6)
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </tfoot>
              </table>

              <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>PRD Section 9 Verification Check:</strong> Maximizer ={' '}
                  <code className="font-mono font-bold">6.55 − 1.30 = 5.25 (Exceptional)</code> · Balanced Builder ={' '}
                  <code className="font-mono font-bold">5.30 − 2.30 = 3.00 (Normal)</code> · Stability Seeker ={' '}
                  <code className="font-mono font-bold">4.40 − 3.00 = 1.40 (Low fit)</code>.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            ONE-CLICK PRD PHASE ACCEPTANCE TRIGGERS (P1–P6)
           =================================================================== */}
        <section className="rounded-2xl bg-white border border-stone-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
            <Zap className="w-4 h-4 text-emerald-700" />
            <span>One-Click PRD Behavioral &amp; Phase Acceptance Triggers</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-4 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold">
                  Phase 3 / 6 · Rules EX-4 &amp; EX-6
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  Simulate Repeated Missed Tasks (Capacity Scaling)
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Shrinks weekly task cap from 3 down to 2 priorities and activates the neutral behind-schedule adjustment bar (Reschedule, Reduce Scope, Reprioritize, Drop, Replan).
                </p>
              </div>
              <button
                onClick={() => {
                  simulateMissedTasksWorkloadScaling();
                  setTriggerBanner(
                    'Triggered EX-6 Capacity Scaling: Weekly cap scaled from 3 to 2 tasks and EX-4 neutral options enabled on Home & Roadmap.'
                  );
                }}
                className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
              >
                Trigger 3 Missed Tasks → Scale Cap to 2
              </button>
            </div>

            <div className="rounded-xl bg-stone-50 border border-stone-200 p-4 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold">
                  Phase 5 · Rule EX-3 &amp; Keynote K13
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  Simulate 5 Submissions with 0 Outcomes
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Seeds 5 opportunities in &ldquo;Submitted&rdquo; state with zero conversions so the engine surfaces the neutral conversion pattern insight on the Home screen.
                </p>
              </div>
              <button
                onClick={() => {
                  simulateFiveSubmissionsZeroOutcomes();
                  setTriggerBanner(
                    'Triggered EX-3 Conversion Pattern: 5 submissions with 0 outcomes recorded. Inspect the neutral insight banner on the Home screen.'
                  );
                }}
                className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
              >
                Seed 5 Submissions &amp; 0 Outcomes (EX-3)
              </button>
            </div>

            <div className="rounded-xl bg-stone-50 border border-stone-200 p-4 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-800 font-bold">
                  Reset State
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  Restore Clean Default Demo State
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Resets the user profile (Amara Okafor · Medicine &amp; Surgery · UK · Balanced Builder · 3 tasks/wk cap) to fresh seeded baseline.
                </p>
              </div>
              <button
                onClick={() => {
                  resetToDefaultDemoUser();
                  setTriggerBanner('Restored clean default demo profile and seeded opportunities.');
                }}
                className="w-full py-2 px-3 rounded-lg bg-white hover:bg-stone-200 border border-stone-300 text-slate-800 text-xs font-semibold"
              >
                Reset All Demo Data
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-stone-100 border border-stone-200 p-3 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-800" />
              Active User Profile in Store: <strong>{user.name}</strong> · Archetype:{' '}
              <strong>{valueOrientation.archetype}</strong> · Weekly Cap:{' '}
              <strong>{user.effectiveWeeklyCap} tasks/wk</strong>
            </span>
          </div>
        </section>
      </main>
    </div>
  );
};

