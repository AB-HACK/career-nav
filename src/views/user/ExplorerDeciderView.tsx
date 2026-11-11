import React, { useState } from 'react';
import { Compass, Columns, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CareerFieldId } from '../../types/domain';
import { CAREER_FIELDS, DESTINATIONS } from '../../data/careersAndDestinations';
import { getPathwayForCareerAndDestination } from '../../data/pathwaysSeed';
import { useNorthStore } from '../../store/useNorthStore';

export const ExplorerDeciderView: React.FC = () => {
  const { user, handOffToBuilderMode } = useNorthStore();

  const [modeTab, setModeTab] = useState<'Explorer' | 'Decider'>(
    user.startingMode === 'Decider' ? 'Decider' : 'Explorer'
  );

  // Explorer Advisory filters (Strictly advisory per K3 / SM-4)
  const [selectedWorkTag, setSelectedWorkTag] = useState<string>('all');
  const [compareIds, setCompareIds] = useState<CareerFieldId[]>(
    user.deciderCandidateCareerIds.length >= 2
      ? user.deciderCandidateCareerIds
      : ['medicine-surgery', 'cs-it', 'accounting-finance']
  );

  const destinationMeta =
    DESTINATIONS.find((d) => d.id === user.destinationId) || DESTINATIONS[0];

  const toggleCompare = (id: CareerFieldId) => {
    if (compareIds.includes(id)) {
      if (compareIds.length > 1) setCompareIds(compareIds.filter((c) => c !== id));
    } else if (compareIds.length < 3) {
      setCompareIds([...compareIds, id]);
    }
  };

  const validCareerFields = CAREER_FIELDS.filter((c) => c.id !== 'custom-unsupported');
  const filteredFields =
    selectedWorkTag === 'all'
      ? validCareerFields
      : validCareerFields.filter((c) => c.workStyleTags.includes(selectedWorkTag));

  return (
    <div className="p-4 space-y-4">
      {/* Header Banner */}
      <div className="rounded-2xl bg-[#0F172A] text-white p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
            Engine 2 · Career Discovery (SM-1, SM-2, SM-4)
          </span>
        </div>
        <h2 className="text-base font-bold">
          {modeTab === 'Explorer'
            ? 'Explorer Mode: Advisory Career Discovery'
            : 'Decider Mode: Side-by-Side Pathway Comparison'}
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-emerald-300">Keynote K3 (Non-Negotiable):</strong> Assessments and comparisons are advisory information, never a verdict. We never tell a user who wants Dermatology that Public Health suits them better. You control the destination.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => setModeTab('Explorer')}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 ${
              modeTab === 'Explorer'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explorer (SM-1)</span>
          </button>
          <button
            onClick={() => setModeTab('Decider')}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 ${
              modeTab === 'Decider'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Decider Compare (SM-2)</span>
          </button>
        </div>
      </div>

      {modeTab === 'Explorer' ? (
        <div className="space-y-3">
          {/* Advisory Self-Reflection Filter */}
          <div className="rounded-xl bg-white border border-stone-200 p-3.5 space-y-2 shadow-sm">
            <label className="block text-xs font-bold text-slate-800">
              Filter by Day-to-Day Work Style (Advisory Signal — Never Restricts Choice)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { tag: 'all', label: 'All 13 Fields' },
                { tag: 'clinical', label: 'Clinical & Patient Care' },
                { tag: 'technical-build', label: 'Technical & Systems Build' },
                { tag: 'quantitative', label: 'Quantitative & Capital' },
                { tag: 'portfolio-driven', label: 'Creative & Portfolio' },
                { tag: 'public-mission', label: 'Policy & Social Impact' },
              ].map((item) => (
                <button
                  key={item.tag}
                  onClick={() => setSelectedWorkTag(item.tag)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                    selectedWorkTag === item.tag
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-stone-50 text-slate-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Career Cards */}
          <div className="space-y-2.5">
            {filteredFields.map((career) => {
              const samplePathway = getPathwayForCareerAndDestination(
                career.id,
                user.destinationId
              );
              const isInCompare = compareIds.includes(career.id);

              return (
                <div
                  key={career.id}
                  className="rounded-xl bg-white border border-stone-200 p-3.5 space-y-2.5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
                        {career.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{career.title}</h3>
                    </div>
                    <span className="text-[11px] font-mono bg-stone-100 px-2 py-0.5 rounded text-slate-700 shrink-0">
                      ~{samplePathway.estimatedMonths}m pathway
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{career.description}</p>

                  <div className="text-[11px] text-slate-500 bg-stone-50 p-2 rounded-lg border border-stone-200/70">
                    <strong className="text-slate-700">
                      In {destinationMeta.flag} {destinationMeta.name}:
                    </strong>{' '}
                    Regulated/benchmarked via {samplePathway.regulatingBody}.
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => toggleCompare(career.id)}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
                        isInCompare
                          ? 'bg-emerald-50 border-emerald-700 text-emerald-900'
                          : 'bg-white border-stone-300 text-slate-700 hover:bg-stone-50'
                      }`}
                    >
                      {isInCompare ? '✓ In Decider Compare' : '+ Add to Compare'}
                    </button>
                    <button
                      onClick={() => handOffToBuilderMode(career.id)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 flex items-center justify-center gap-1"
                    >
                      <span>Choose &amp; Build Roadmap (SM-6)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Decider Selector */}
          <div className="rounded-xl bg-white border border-stone-200 p-3.5 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Comparing {compareIds.length} Pathways in {destinationMeta.flag} {destinationMeta.name}
              </span>
              <span className="text-[11px] text-slate-500">Pick up to 3</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {validCareerFields.map((c) => {
                const active = compareIds.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleCompare(c.id)}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                      active
                        ? 'bg-emerald-900 text-white border-emerald-950'
                        : 'bg-stone-50 text-slate-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {c.shortTitle}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Side-by-Side Comparison Cards */}
          <div className="space-y-3">
            {compareIds.map((cId) => {
              const pw = getPathwayForCareerAndDestination(cId, user.destinationId);
              const competitionDim = pw.dimensions.find((d) => d.dimension === 'Competition');
              const financeDim = pw.dimensions.find((d) => d.dimension === 'Financial burden');
              const bottleneckDim = pw.dimensions.find((d) => d.dimension === 'Bottlenecks');

              return (
                <div
                  key={cId}
                  className="rounded-xl bg-white border border-stone-200 p-3.5 space-y-2.5 shadow-sm"
                >
                  <div className="flex items-start justify-between border-b border-stone-100 pb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{pw.careerTitle}</h4>
                      <p className="text-[11px] text-slate-500">{pw.regulatingBody}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-mono font-semibold">
                      ~{pw.estimatedMonths} mos
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="font-semibold text-slate-800">Primary Licensing Gate: </span>
                      <span className="text-slate-600">{pw.requirements[1]?.title}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">Competition Reality: </span>
                      <span className="text-slate-600">{competitionDim?.specificChallenge}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">Financial Dimension: </span>
                      <span className="text-slate-600">{financeDim?.specificChallenge}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">Key Bottleneck: </span>
                      <span className="text-slate-600">{bottleneckDim?.specificChallenge}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handOffToBuilderMode(cId)}
                    className="w-full py-2 px-3 rounded-lg bg-emerald-900 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Commit to {pw.careerTitle} (Seamless Builder Handoff — SM-6)</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-xl bg-stone-100 border border-stone-200 p-3 flex items-center gap-2 text-xs text-slate-600">
        <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0" />
        <span>
          <strong>Rule SM-6 Verified:</strong> Selecting any career above hands your existing profile and Value Orientation directly into the Builder flow with zero data re-entry.
        </span>
      </div>
    </div>
  );
};
