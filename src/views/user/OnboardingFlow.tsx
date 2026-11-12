import React, { useState } from 'react';
import { Compass, ArrowRight, Check, Sliders, Sparkles } from 'lucide-react';
import {
  ArchetypeName,
  CareerFieldId,
  DestinationId,
  StartingMode,
  ValueOrientationSliders,
} from '../../types/domain';
import { CAREER_FIELDS, DESTINATIONS } from '../../data/careersAndDestinations';
import {
  ARCHETYPE_DESCRIPTIONS,
  computeWeightsFromArchetypeAndSliders,
} from '../../engines/valueOrientationEngine';
import { useNorthStore } from '../../store/useNorthStore';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const user = useNorthStore((s) => s.user);
  const valueOrientation = useNorthStore((s) => s.valueOrientation);
  const completeOnboarding = useNorthStore((s) => s.completeOnboarding);

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState(user.name || 'Amara Okafor');
  const [originCountry, setOriginCountry] = useState<DestinationId>(user.originCountry || 'nigeria');
  const [startingMode, setStartingMode] = useState<StartingMode>(user.startingMode || 'Builder');
  const [goalCareerId, setGoalCareerId] = useState<CareerFieldId>(
    user.goalCareerId || 'medicine-surgery'
  );
  const [engineeringTrack, setEngineeringTrack] = useState<
    'Petroleum' | 'Civil' | 'Electrical/Electronics' | 'Mechanical'
  >(user.engineeringTrack || 'Electrical/Electronics');
  const [customGoalText, setCustomGoalText] = useState(
    user.customGoalText || 'Space Law & Satellite Policy'
  );
  const [destinationId, setDestinationId] = useState<DestinationId>(user.destinationId || 'uk');
  const [institutionOrCity, setInstitutionOrCity] = useState(
    user.institutionOrCity || ''
  );
  const [deciderIds, setDeciderIds] = useState<CareerFieldId[]>(
    user.deciderCandidateCareerIds.length >= 2
      ? user.deciderCandidateCareerIds
      : ['medicine-surgery', 'healthcare-nursing']
  );

  // Step 2: Value Orientation (VO-1: Balanced Builder is default)
  const [archetype, setArchetype] = useState<ArchetypeName>(
    valueOrientation.archetype || 'Balanced Builder'
  );
  const [sliders, setSliders] = useState<ValueOrientationSliders>(
    valueOrientation.sliders || { orientation: 0, riskAppetite: 0, timeHorizon: 0 }
  );

  const liveWeights = computeWeightsFromArchetypeAndSliders(archetype, sliders);

  const toggleDeciderCandidate = (id: CareerFieldId) => {
    if (deciderIds.includes(id)) {
      if (deciderIds.length > 1) {
        setDeciderIds(deciderIds.filter((c) => c !== id));
      }
    } else if (deciderIds.length < 3) {
      setDeciderIds([...deciderIds, id]);
    }
  };

  const handleFinish = () => {
    completeOnboarding({
      name,
      originCountry,
      startingMode,
      goalCareerId: startingMode === 'Decider' ? deciderIds[0] : goalCareerId,
      customGoalText: goalCareerId === 'custom-unsupported' ? customGoalText : undefined,
      engineeringTrack: goalCareerId === 'engineering' ? engineeringTrack : undefined,
      destinationId,
      institutionOrCity: institutionOrCity.trim() || undefined,
      deciderCandidateCareerIds: startingMode === 'Decider' ? deciderIds : [goalCareerId],
      archetype,
      sliders,
    });
    onComplete();
  };

  return (
    <div className="p-4 space-y-5">
      {/* Step Header */}
      <div className="rounded-2xl bg-[#0F172A] text-white p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
            {step === 1 ? 'Step 1 of 2 · Minimal Signup (CI-1)' : 'Step 2 of 2 · Value Orientation (VO-1..3)'}
          </span>
          <span className="text-[11px] text-slate-400">{step}/2</span>
        </div>
        <h1 className="text-lg font-bold tracking-tight">
          {step === 1
            ? 'Who are you, where are you, and where do you want to go?'
            : 'How do you define "worth it"?'}
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed">
          {step === 1
            ? 'Rule CI-1: Signup asks only these three things. Everything else is requested progressively when relevant, with a clear reason.'
            : 'Rule VO-1: Two people with the same goal can want different things. Pick a starter archetype and nudge the weights—or finish immediately with Balanced Builder.'}
        </p>
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          {/* 1. Who are you */}
          <div className="rounded-xl bg-white border border-stone-200 p-3.5 space-y-2.5 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Who are you?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-700 bg-stone-50/50"
            />
          </div>

          {/* 2. Where are you (Origin Location) */}
          <div className="rounded-xl bg-white border border-stone-200 p-3.5 space-y-2.5 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Where are you currently based?
            </label>
            <select
              value={originCountry}
              onChange={(e) => setOriginCountry(e.target.value as DestinationId)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm text-slate-900 bg-stone-50/50 focus:outline-none focus:border-emerald-700"
            >
              {DESTINATIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.flag} {d.name} ({d.region})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Where do you want to go (Starting Mode + Target Career & Destination) */}
          <div className="rounded-xl bg-white border border-stone-200 p-3.5 space-y-3 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              3. Where do you want to go? (Starting Mode — K4)
            </label>

            {/* 3 Starting Modes */}
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { mode: 'Builder', quote: '"I know my goal"' },
                  { mode: 'Decider', quote: '"I have 2–3 ideas"' },
                  { mode: 'Explorer', quote: '"Help me explore"' },
                ] as const
              ).map((item) => (
                <button
                  key={item.mode}
                  type="button"
                  onClick={() => setStartingMode(item.mode)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    startingMode === item.mode
                      ? 'bg-emerald-950 text-white border-emerald-900 shadow-sm'
                      : 'bg-stone-50 text-slate-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="text-xs font-bold">{item.mode}</div>
                  <div
                    className={`text-[10px] mt-0.5 ${
                      startingMode === item.mode ? 'text-emerald-200' : 'text-slate-500'
                    }`}
                  >
                    {item.quote}
                  </div>
                </button>
              ))}
            </div>

            {startingMode === 'Builder' && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Target Career Field (13 Seeded Fields + PI-8 Test)
                  </label>
                  <select
                    value={goalCareerId}
                    onChange={(e) => setGoalCareerId(e.target.value as CareerFieldId)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium text-slate-900 bg-stone-50/50"
                  >
                    {CAREER_FIELDS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                {goalCareerId === 'engineering' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Engineering Discipline
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(['Petroleum', 'Civil', 'Electrical/Electronics', 'Mechanical'] as const).map(
                        (track) => (
                          <button
                            key={track}
                            type="button"
                            onClick={() => setEngineeringTrack(track)}
                            className={`py-1.5 px-2.5 rounded-lg border text-xs font-medium text-left ${
                              engineeringTrack === track
                                ? 'bg-emerald-50 border-emerald-700 text-emerald-950 font-semibold'
                                : 'bg-white border-stone-200 text-slate-700'
                            }`}
                          >
                            {track}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

                {goalCareerId === 'custom-unsupported' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-amber-800 mb-1">
                      Enter Custom Unlisted Career (Demonstrates PI-8 Honest Fallback)
                    </label>
                    <input
                      type="text"
                      value={customGoalText}
                      onChange={(e) => setCustomGoalText(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50/40 text-xs text-slate-900"
                    />
                  </div>
                )}
              </div>
            )}

            {startingMode === 'Decider' && (
              <div className="space-y-1.5 pt-1">
                <label className="block text-[11px] font-semibold text-slate-600">
                  Pick 2–3 Career Ideas to Compare Side-by-Side (SM-2):
                </label>
                <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
                  {CAREER_FIELDS.filter((c) => c.id !== 'custom-unsupported').map((c) => {
                    const selected = deciderIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleDeciderCandidate(c.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg border text-xs flex items-center justify-between ${
                          selected
                            ? 'bg-emerald-50 border-emerald-700 text-emerald-950 font-semibold'
                            : 'bg-white border-stone-200 text-slate-700'
                        }`}
                      >
                        <span className="truncate">{c.title}</span>
                        {selected && <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {startingMode === 'Explorer' && (
              <div className="rounded-lg bg-stone-50 border border-stone-200 p-2.5 text-xs text-slate-600">
                <strong className="text-slate-800">Explorer Mode (SM-1 &amp; K3):</strong> After signup, North will guide you through a short advisory discovery across all 13 career fields. You always keep 100% control of the destination.
              </div>
            )}

            {/* Target Destination Country / Hub */}
            <div className="pt-1 border-t border-stone-100 space-y-2">
              <label className="block text-[11px] font-semibold text-slate-600">
                Target Destination Country or Hub (PI-1)
              </label>
              <select
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value as DestinationId)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium text-slate-900 bg-stone-50/50"
              >
                {DESTINATIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.flag} {d.name} — {d.region}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={institutionOrCity}
                onChange={(e) => setInstitutionOrCity(e.target.value)}
                placeholder="Optional city, state, or institution (PI-7 specificity)"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-slate-800 bg-stone-50/40"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFinish}
              className="px-3 py-2.5 rounded-xl border border-stone-300 bg-white text-slate-700 text-xs font-semibold hover:bg-stone-100 transition-colors"
              title="VO-1: A user can finish onboarding without choosing; Balanced Builder default applies."
            >
              Skip Step 2 (Use Default)
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Next: Value Orientation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 4 Starter Archetypes (VO-1) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Pick a Starter Archetype (VO-1)
            </label>
            <div className="grid grid-cols-1 gap-2">
              {(
                ['Balanced Builder', 'Maximizer', 'Stability Seeker', 'Mission-Driven'] as ArchetypeName[]
              ).map((arch) => {
                const meta = ARCHETYPE_DESCRIPTIONS[arch];
                const isSelected = archetype === arch;
                return (
                  <button
                    key={arch}
                    type="button"
                    onClick={() => {
                      setArchetype(arch);
                      setSliders({ orientation: 0, riskAppetite: 0, timeHorizon: 0 });
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-emerald-950 text-white border-emerald-900 shadow-md'
                        : 'bg-white text-slate-800 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">
                        {arch} {arch === 'Balanced Builder' && '(Default)'}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-emerald-800 text-emerald-100'
                            : 'bg-stone-100 text-slate-600'
                        }`}
                      >
                        {meta.tagline}
                      </span>
                    </div>
                    <p
                      className={`text-[11px] mt-1 leading-relaxed ${
                        isSelected ? 'text-stone-200' : 'text-slate-600'
                      }`}
                    >
                      {meta.optimizesFor}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3 Bounded Sliders (VO-2, VO-3) */}
          <div className="rounded-xl bg-white border border-stone-200 p-3.5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Sliders className="w-3.5 h-3.5 text-emerald-700" />
                <span>2. Nudge Weights Underneath (VO-2 &amp; VO-3)</span>
              </div>
              <button
                type="button"
                onClick={() => setSliders({ orientation: 0, riskAppetite: 0, timeHorizon: 0 })}
                className="text-[11px] text-emerald-800 hover:underline font-medium"
              >
                Reset to {archetype} Default
              </button>
            </div>

            {(
              [
                {
                  key: 'orientation',
                  label: 'Orientation Focus',
                  left: 'Security & Income',
                  right: 'Prestige & Impact',
                },
                {
                  key: 'riskAppetite',
                  label: 'Risk Appetite',
                  left: 'Protect Current Plan',
                  right: 'High-Ceiling Bet',
                },
                {
                  key: 'timeHorizon',
                  label: 'Time Horizon',
                  left: 'Near-Term Payoff',
                  right: 'Long-Term Compounding',
                },
              ] as const
            ).map((s) => (
              <div key={s.key} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-slate-700">{s.label}</span>
                  <span className="font-mono text-slate-500">
                    {sliders[s.key] > 0 ? `+${sliders[s.key]}` : sliders[s.key]}
                  </span>
                </div>
                <input
                  type="range"
                  min={-2}
                  max={2}
                  step={1}
                  value={sliders[s.key]}
                  onChange={(e) =>
                    setSliders({ ...sliders, [s.key]: Number(e.target.value) })
                  }
                  className="w-full accent-emerald-800 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{s.left}</span>
                  <span>Archetype Baseline (0)</span>
                  <span>{s.right}</span>
                </div>
              </div>
            ))}

            {/* Plain-words explanation & live stored weights (VO-6, VO-7) */}
            <div className="rounded-lg bg-stone-50 border border-stone-200 p-2.5 space-y-2">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-900">
                <Sparkles className="w-3.5 h-3.5" />
                <span>How this affects your scores (Rule VO-7):</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {ARCHETYPE_DESCRIPTIONS[archetype].plainExplanation}
              </p>
              <div className="grid grid-cols-4 gap-1 pt-1 text-[10px] font-mono text-slate-600">
                <div className="bg-white px-1.5 py-1 rounded border border-stone-200">
                  Gaps: +{liveWeights.gapsClosed.toFixed(2)}
                </div>
                <div className="bg-white px-1.5 py-1 rounded border border-stone-200">
                  Halo: +{liveWeights.credibility.toFixed(2)}
                </div>
                <div className="bg-white px-1.5 py-1 rounded border border-stone-200">
                  Fund: +{liveWeights.funding.toFixed(2)}
                </div>
                <div className="bg-white px-1.5 py-1 rounded border border-stone-200">
                  Disrupt: −{liveWeights.disruptionCost.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-slate-700 text-xs font-semibold hover:bg-stone-100"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleFinish}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-900 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Compass className="w-4 h-4" />
              <span>Save Career Identity &amp; Launch Navigation</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
