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
  const [step1Error, setStep1Error] = useState<string | null>(null);
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

  const validateStep1 = (): boolean => {
    if (!name.trim()) {
      setStep1Error('Enter your name before continuing.');
      return false;
    }
    if (
      startingMode === 'Builder' &&
      goalCareerId === 'custom-unsupported' &&
      !customGoalText.trim()
    ) {
      setStep1Error('Enter a custom career goal before continuing.');
      return false;
    }
    if (startingMode === 'Decider' && deciderIds.length < 2) {
      setStep1Error('Select at least 2 career ideas to compare side-by-side.');
      return false;
    }
    setStep1Error(null);
    return true;
  };

  const handleFinish = () => {
    if (!validateStep1()) {
      setStep(1);
      return;
    }
    completeOnboarding({
      name: name.trim(),
      originCountry,
      startingMode,
      goalCareerId: startingMode === 'Decider' ? deciderIds[0] : goalCareerId,
      customGoalText:
        goalCareerId === 'custom-unsupported' ? customGoalText.trim() : undefined,
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Step Header */}
      <header className="bg-[#14161A] text-[#F9F9F7] border-2 border-[#14161A] p-4 sm:p-6 space-y-2.5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h1 className="type-display text-white">
            {step === 1
              ? 'Who are you, where are you, and where do you want to go?'
              : 'How do you define "worth it"?'}
          </h1>
          <span className="text-xs font-mono px-2.5 py-1 bg-[#D92B2B] text-white font-bold shrink-0">
            {step}/2
          </span>
        </div>
        <div className="type-label text-[#93C5FD]">
          {step === 1 ? 'Step 1 of 2 · Your Starting Point' : 'Step 2 of 2 · Value Orientation'}
        </div>
        <p className="type-dark-body text-[#D1D5DB]">
          {step === 1
            ? 'We only ask these three questions to get started. Everything else is asked later when needed, with a clear reason.'
            : 'Two people with the same goal can prioritize different tradeoffs. Choose a starting archetype and adjust the sliders, or keep Balanced Builder.'}
        </p>
      </header>

      {step === 1 ? (
        <div className="space-y-4">
          {/* 1. Who are you & 2. Where are you */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border-2 border-[#14161A] p-4 space-y-2.5">
              <label
                htmlFor="onboarding-name"
                className="block text-xs font-mono font-bold uppercase tracking-wider text-[#14161A]"
              >
                1. Who are you?
              </label>
              <input
                id="onboarding-name"
                type="text"
                maxLength={80}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (step1Error) setStep1Error(null);
                }}
                aria-invalid={step1Error && !name.trim() ? true : undefined}
                placeholder="Your name"
                className="min-h-[44px] w-full px-3 py-2 border-2 border-[#14161A] text-base sm:text-sm text-[#14161A] bg-[#F9F9F7]"
              />
            </div>

            <div className="bg-white border-2 border-[#14161A] p-4 space-y-2.5">
              <label
                htmlFor="onboarding-origin"
                className="block text-xs font-mono font-bold uppercase tracking-wider text-[#14161A]"
              >
                2. Where are you currently based?
              </label>
              <select
                id="onboarding-origin"
                value={originCountry}
                onChange={(e) => setOriginCountry(e.target.value as DestinationId)}
                className="min-h-[44px] w-full px-3 py-2 border-2 border-[#14161A] text-base sm:text-sm text-[#14161A] bg-[#F9F9F7]"
              >
                {DESTINATIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.flag} {d.name} ({d.region})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Where do you want to go (Starting Mode + Target Career & Destination) */}
          <div className="bg-white border-2 border-[#14161A] p-4 sm:p-5 space-y-4">
            <span className="block text-xs font-mono font-bold uppercase tracking-wider text-[#14161A]">
              3. Where do you want to go?
            </span>

            {/* 3 Starting Modes — 1 col on small phones, 3 cols on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                  className={`min-h-[52px] p-3 border-2 text-left transition-colors ${
                    startingMode === item.mode
                      ? 'bg-[#14161A] text-white border-[#D92B2B]'
                      : 'bg-[#F9F9F7] text-[#14161A] border-[#D6D5CE] hover:border-[#14161A]'
                  }`}
                >
                  <div className="text-sm font-extrabold">{item.mode}</div>
                  <div
                    className={`text-xs mt-0.5 ${
                      startingMode === item.mode ? 'text-[#D1D5DB]' : 'text-[#4B5563]'
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
                  <label
                    htmlFor="onboarding-career"
                    className="block text-xs font-semibold text-[#14161A] mb-1.5"
                  >
                    Target Career Field
                  </label>
                  <select
                    id="onboarding-career"
                    value={goalCareerId}
                    onChange={(e) => setGoalCareerId(e.target.value as CareerFieldId)}
                    className="min-h-[44px] w-full px-3 py-2 border-2 border-[#14161A] text-base sm:text-sm font-medium text-[#14161A] bg-[#F9F9F7]"
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
                    <span className="block text-xs font-semibold text-[#14161A] mb-1.5">
                      Engineering Discipline
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(['Petroleum', 'Civil', 'Electrical/Electronics', 'Mechanical'] as const).map(
                        (track) => (
                          <button
                            key={track}
                            type="button"
                            onClick={() => setEngineeringTrack(track)}
                            className={`min-h-[44px] py-2 px-3 border text-xs font-mono font-bold text-left ${
                              engineeringTrack === track
                                ? 'bg-[#EFF6FF] border-[#1D4ED8] text-[#1D4ED8]'
                                : 'bg-white border-[#D6D5CE] text-[#14161A]'
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
                    <label
                      htmlFor="onboarding-custom-goal"
                      className="block text-xs font-semibold text-amber-900 mb-1.5"
                    >
                      Enter Custom Career Goal
                    </label>
                    <input
                      id="onboarding-custom-goal"
                      type="text"
                      maxLength={100}
                      value={customGoalText}
                      onChange={(e) => {
                        setCustomGoalText(e.target.value);
                        if (step1Error) setStep1Error(null);
                      }}
                      className="min-h-[44px] w-full px-3 py-2 border-2 border-amber-500 bg-amber-50 text-base sm:text-sm text-[#14161A]"
                    />
                  </div>
                )}
              </div>
            )}

            {startingMode === 'Decider' && (
              <div className="space-y-2 pt-1">
                <span className="block text-xs font-semibold text-[#14161A]">
                  Pick 2–3 Career Ideas to Compare:
                </span>
                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                  {CAREER_FIELDS.filter((c) => c.id !== 'custom-unsupported').map((c) => {
                    const selected = deciderIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleDeciderCandidate(c.id)}
                        className={`min-h-[44px] w-full text-left px-3 py-2 border text-xs sm:text-sm flex items-center justify-between gap-2 ${
                          selected
                            ? 'bg-[#EFF6FF] border-[#1D4ED8] text-[#1D4ED8] font-bold'
                            : 'bg-white border-[#D6D5CE] text-[#14161A]'
                        }`}
                      >
                        <span className="truncate">{c.title}</span>
                        {selected && <Check className="w-4 h-4 text-[#1D4ED8] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {startingMode === 'Explorer' && (
              <div className="bg-[#F2F1EC] border border-[#14161A] p-3 text-sm text-[#4B5563]">
                <strong className="text-[#14161A]">Explorer Mode:</strong> After signup, North will guide you through a short advisory discovery across all 13 career fields. You always keep full control of your destination.
              </div>
            )}

            {/* Target Destination Country / Hub */}
            <div className="pt-3 border-t border-[#D6D5CE] space-y-2.5">
              <label
                htmlFor="onboarding-destination"
                className="block text-xs font-semibold text-[#14161A]"
              >
                Target Destination Country or Hub
              </label>
              <select
                id="onboarding-destination"
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value as DestinationId)}
                className="min-h-[44px] w-full px-3 py-2 border-2 border-[#14161A] text-base sm:text-sm font-medium text-[#14161A] bg-[#F9F9F7]"
              >
                {DESTINATIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.flag} {d.name} — {d.region}
                  </option>
                ))}
              </select>

              <input
                type="text"
                maxLength={100}
                value={institutionOrCity}
                onChange={(e) => setInstitutionOrCity(e.target.value)}
                placeholder="Optional city, state, or institution"
                aria-label="Optional city, state, or institution"
                className="min-h-[44px] w-full px-3 py-2 border border-[#14161A] text-base sm:text-sm text-[#14161A] bg-[#F9F9F7]"
              />
            </div>
          </div>

          {step1Error && (
            <div
              role="alert"
              className="p-3 bg-rose-50 border-2 border-[#D92B2B] text-sm font-semibold text-rose-950"
            >
              {step1Error}
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              type="button"
              onClick={handleFinish}
              className="min-h-[44px] px-4 py-2.5 border-2 border-[#14161A] bg-white text-[#14161A] text-xs font-mono font-bold uppercase hover:bg-[#F2F1EC] transition-colors"
              title="Finish onboarding now with the Balanced Builder default"
            >
              Skip Step 2 (Use Default)
            </button>
            <button
              type="button"
              onClick={() => {
                if (validateStep1()) {
                  setStep(2);
                }
              }}
              className="min-h-[44px] flex-1 py-2.5 px-5 bg-[#14161A] hover:bg-[#D92B2B] text-white text-xs font-mono font-bold uppercase transition-colors flex items-center justify-center gap-2"
            >
              <span>Next: Value Orientation</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* 4 Starter Archetypes (VO-1) */}
          <div className="space-y-2.5">
            <span className="block text-xs font-mono font-bold uppercase tracking-wider text-[#14161A]">
              1. Pick a Starter Archetype
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                    className={`min-h-[64px] w-full text-left p-3.5 border-2 transition-colors ${
                      isSelected
                        ? 'bg-[#14161A] text-white border-[#D92B2B]'
                        : 'bg-white text-[#14161A] border-[#D6D5CE] hover:border-[#14161A]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-extrabold">
                        {arch} {arch === 'Balanced Builder' && '(Default)'}
                      </span>
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 ${
                          isSelected
                            ? 'bg-[#D92B2B] text-white'
                            : 'bg-[#F2F1EC] text-[#4B5563]'
                        }`}
                      >
                        {meta.tagline}
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-1.5 leading-relaxed ${
                        isSelected ? 'text-[#D1D5DB]' : 'text-[#4B5563]'
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
          <div className="bg-white border-2 border-[#14161A] p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-extrabold text-[#14161A]">
                <Sliders className="w-4 h-4 text-[#1D4ED8] shrink-0" />
                <span>2. Fine-Tune Tradeoff Weights</span>
              </div>
              <button
                type="button"
                onClick={() => setSliders({ orientation: 0, riskAppetite: 0, timeHorizon: 0 })}
                className="min-h-[44px] px-3 text-xs font-mono font-bold text-[#1D4ED8] hover:underline"
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
                <div className="flex justify-between gap-2 text-xs sm:text-sm">
                  <span className="font-semibold text-[#14161A]">{s.label}</span>
                  <span className="font-mono font-bold text-[#1D4ED8]">
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
                  className="w-full cursor-pointer"
                />
                <div className="flex justify-between gap-2 text-[11px] font-mono text-[#4B5563]">
                  <span>{s.left}</span>
                  <span className="hidden sm:inline">Archetype Baseline (0)</span>
                  <span className="text-right">{s.right}</span>
                </div>
              </div>
            ))}

            {/* Plain-words explanation & live stored weights (VO-6, VO-7) */}
            <div className="bg-[#F2F1EC] border border-[#14161A] p-3.5 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#1D4ED8]">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>How this affects your scores:</span>
              </div>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                {ARCHETYPE_DESCRIPTIONS[archetype].plainExplanation}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-mono text-[#14161A]">
                <div className="bg-white px-2.5 py-1.5 border border-[#D6D5CE]">
                  Gaps: +{liveWeights.gapsClosed.toFixed(2)}
                </div>
                <div className="bg-white px-2.5 py-1.5 border border-[#D6D5CE]">
                  Halo: +{liveWeights.credibility.toFixed(2)}
                </div>
                <div className="bg-white px-2.5 py-1.5 border border-[#D6D5CE]">
                  Fund: +{liveWeights.funding.toFixed(2)}
                </div>
                <div className="bg-white px-2.5 py-1.5 border border-[#D6D5CE]">
                  Disrupt: −{liveWeights.disruptionCost.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="min-h-[44px] px-4 py-2.5 border-2 border-[#14161A] bg-white text-[#14161A] text-xs font-mono font-bold uppercase hover:bg-[#F2F1EC]"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleFinish}
              className="min-h-[44px] flex-1 py-2.5 px-5 bg-[#D92B2B] hover:bg-[#B91C1C] text-white text-xs font-mono font-bold uppercase transition-colors flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>Save Career Identity &amp; Launch Navigation</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
