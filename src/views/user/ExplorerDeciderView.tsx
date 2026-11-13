import React, { useState } from 'react';
import { Compass, Columns, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CareerFieldId } from '../../types/domain';
import { CAREER_FIELDS, DESTINATIONS } from '../../data/careersAndDestinations';
import { getPathwayForCareerAndDestination } from '../../data/pathwaysSeed';
import { useNorthStore } from '../../store/useNorthStore';

export const ExplorerDeciderView: React.FC = () => {
  const user = useNorthStore((s) => s.user);
  const handOffToBuilderMode = useNorthStore((s) => s.handOffToBuilderMode);

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
    <div className="space-y-6">
      {/* Header Banner */}
      <header className="bg-[#14161A] text-[#F9F9F7] border-2 border-[#14161A] p-4 sm:p-6 space-y-3">
        <h1 className="type-display text-white">
          {modeTab === 'Explorer'
            ? 'Explorer Mode: Advisory Career Discovery'
            : 'Decider Mode: Side-by-Side Pathway Comparison'}
        </h1>
        <div className="type-label text-[#93C5FD]">
          Advisory Career Discovery &amp; Comparison
        </div>
        <p className="type-dark-body text-[#D1D5DB]">
          Assessments and comparisons are strictly advisory. You always choose your own destination.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={() => setModeTab('Explorer')}
            className={`min-h-[44px] py-2.5 px-4 text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 border transition-colors ${
              modeTab === 'Explorer'
                ? 'bg-[#D92B2B] text-white border-[#D92B2B]'
                : 'bg-[#1F242D] text-[#D1D5DB] border-[#323846] hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4 shrink-0" />
            <span>Explorer</span>
          </button>
          <button
            onClick={() => setModeTab('Decider')}
            className={`min-h-[44px] py-2.5 px-4 text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 border transition-colors ${
              modeTab === 'Decider'
                ? 'bg-[#D92B2B] text-white border-[#D92B2B]'
                : 'bg-[#1F242D] text-[#D1D5DB] border-[#323846] hover:text-white'
            }`}
          >
            <Columns className="w-4 h-4 shrink-0" />
            <span>Decider Compare</span>
          </button>
        </div>
      </header>

      {modeTab === 'Explorer' ? (
        <div className="space-y-4">
          {/* Advisory Self-Reflection Filter */}
          <div className="bg-white border-2 border-[#14161A] p-4 space-y-2.5">
            <span className="block text-sm font-extrabold text-[#14161A]">
              Filter by Day-to-Day Work Style (Advisory Signal — Never Restricts Choice)
            </span>
            <div className="flex flex-wrap gap-2">
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
                  className={`min-h-[44px] px-3.5 py-2 text-xs font-mono font-bold border transition-colors ${
                    selectedWorkTag === item.tag
                      ? 'bg-[#14161A] text-white border-[#14161A]'
                      : 'bg-[#F9F9F7] text-[#14161A] border-[#D6D5CE] hover:border-[#14161A]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Career Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFields.map((career) => {
              const samplePathway = getPathwayForCareerAndDestination(
                career.id,
                user.destinationId
              );
              const isInCompare = compareIds.includes(career.id);

              return (
                <div
                  key={career.id}
                  className="bg-white border-2 border-[#14161A] p-4 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="text-base font-extrabold text-[#14161A]">
                          {career.title}
                        </h2>
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1D4ED8] block mt-0.5">
                          {career.category}
                        </span>
                      </div>
                      <span className="text-xs font-mono bg-[#F2F1EC] border border-[#14161A] px-2.5 py-1 text-[#14161A] font-bold shrink-0">
                        ~{samplePathway.estimatedMonths}m pathway
                      </span>
                    </div>

                    <p className="text-sm text-[#4B5563] leading-relaxed">
                      {career.description}
                    </p>

                    <div className="text-xs text-[#4B5563] bg-[#F2F1EC] p-2.5 border border-[#D6D5CE]">
                      <strong className="text-[#14161A]">
                        In {destinationMeta.flag} {destinationMeta.name}:
                      </strong>{' '}
                      Regulated/benchmarked via {samplePathway.regulatingBody}.
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                    <button
                      onClick={() => toggleCompare(career.id)}
                      className={`min-h-[44px] px-3 py-2 border-2 text-xs font-mono font-bold ${
                        isInCompare
                          ? 'bg-[#EFF6FF] border-[#1D4ED8] text-[#1D4ED8]'
                          : 'bg-white border-[#14161A] text-[#14161A] hover:bg-[#F2F1EC]'
                      }`}
                    >
                      {isInCompare ? '✓ In Decider Compare' : '+ Add to Compare'}
                    </button>
                    <button
                      onClick={() => handOffToBuilderMode(career.id)}
                      className="min-h-[44px] flex-1 py-2 px-3 bg-[#14161A] hover:bg-[#D92B2B] text-white text-xs font-mono font-bold uppercase flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Choose &amp; Build Roadmap</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Decider Selector */}
          <div className="bg-white border-2 border-[#14161A] p-4 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-extrabold text-[#14161A]">
                Comparing {compareIds.length} Pathways in {destinationMeta.flag} {destinationMeta.name}
              </span>
              <span className="text-xs font-mono text-[#4B5563]">Pick up to 3</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {validCareerFields.map((c) => {
                const active = compareIds.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleCompare(c.id)}
                    className={`min-h-[44px] px-3 py-1.5 text-xs font-mono font-bold border transition-colors ${
                      active
                        ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                        : 'bg-[#F9F9F7] text-[#14161A] border-[#D6D5CE] hover:border-[#14161A]'
                    }`}
                  >
                    {c.shortTitle}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Side-by-Side Comparison Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {compareIds.map((cId) => {
              const pw = getPathwayForCareerAndDestination(cId, user.destinationId);
              const competitionDim = pw.dimensions.find((d) => d.dimension === 'Competition');
              const financeDim = pw.dimensions.find((d) => d.dimension === 'Financial burden');
              const bottleneckDim = pw.dimensions.find((d) => d.dimension === 'Bottlenecks');

              return (
                <div
                  key={cId}
                  className="bg-white border-2 border-[#14161A] p-4 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 border-b-2 border-[#14161A] pb-2.5">
                      <div className="min-w-0">
                        <h3 className="text-base font-extrabold text-[#14161A]">
                          {pw.careerTitle}
                        </h3>
                        <p className="text-xs text-[#4B5563]">{pw.regulatingBody}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-[#EFF6FF] text-[#1D4ED8] border border-[#1D4ED8] text-xs font-mono font-bold shrink-0">
                        ~{pw.estimatedMonths} mos
                      </span>
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm">
                      <div>
                        <span className="font-bold text-[#14161A]">Primary Licensing Gate: </span>
                        <span className="text-[#4B5563]">{pw.requirements[1]?.title}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#14161A]">Competition Reality: </span>
                        <span className="text-[#4B5563]">{competitionDim?.specificChallenge}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#14161A]">Financial Dimension: </span>
                        <span className="text-[#4B5563]">{financeDim?.specificChallenge}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#14161A]">Key Bottleneck: </span>
                        <span className="text-[#4B5563]">{bottleneckDim?.specificChallenge}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handOffToBuilderMode(cId)}
                    className="min-h-[44px] w-full py-2.5 px-3 bg-[#14161A] hover:bg-[#D92B2B] text-white text-xs font-mono font-bold uppercase transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Choose {pw.careerTitle}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-[#F2F1EC] border border-[#14161A] p-3.5 flex items-center gap-2.5 text-xs sm:text-sm text-[#4B5563]">
        <ShieldCheck className="w-4 h-4 text-[#1D4ED8] shrink-0" />
        <span>
          <strong className="text-[#14161A]">Seamless Handoff:</strong> Selecting any career moves your existing profile and Value Orientation directly into your active roadmap with zero data re-entry.
        </span>
      </div>
    </div>
  );
};
